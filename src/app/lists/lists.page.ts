import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RepoService } from 'src/app/services/repositorio/repo.service';
import { ApiTMDBService } from 'src/app/services/API/api-tmdb.service';
import { firstValueFrom, forkJoin } from 'rxjs';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';

@Component({
  standalone:false,
  selector: 'app-lists',
  templateUrl: './lists.page.html'
})
export class ListsPage implements OnInit{
  listType: string = '';
  movies: any[] = [];
  isLoading: boolean = true;
  currentUserId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    public repoService: RepoService, // Changed to public for template access
    public movieService: ApiTMDBService, // Changed to public
    private router:Router,
    private menu: MenuController,
  ) {
    this.route.paramMap.subscribe(async params => {
      this.listType = params.get('listType') || '';
      await this.loadMovies();
    });
  }
  ngOnInit(): void {
    this.ionViewWillEnter();
  }

  //Habilita sidemenu
  ionViewWillEnter() {
    this.menu.enable(true);
  }

  private async loadMovies() {
    try {
      const user = await firstValueFrom(this.repoService.getCurrentUser$());
      this.currentUserId = user?.id || null;
      
      if (!this.currentUserId) return;

      let movieIds: string[] = [];
      switch(this.listType.toLowerCase()) {
        case 'liked': 
          movieIds = this.repoService.getLikedList(this.currentUserId)?.items || [];
          break;
        case 'favorites':
          movieIds = this.repoService.getFavouritesList(this.currentUserId)?.items || [];
          break;
        case 'watch-later':
          movieIds = this.repoService.getWatchLaterList(this.currentUserId)?.items || [];
          break;
      }

      if (movieIds.length > 0) {
        this.movies = await firstValueFrom(
          forkJoin(
            movieIds.map(id => 
              this.movieService.getMovieDetails(id)
            )
          )
        );
      } else {
        this.movies = [];
      }
    } catch (error) {
      console.error('Error loading movies:', error);
    } finally {
      this.isLoading = false;
    }
  }

  // Helper methods for checking movie status
isLiked(movieId: number): boolean {
  if (!this.currentUserId) return false;
  const list = this.repoService.getLikedList(this.currentUserId);
  return list?.items.includes(movieId.toString()) || false;
}

isFavorite(movieId: number): boolean {
  if (!this.currentUserId) return false;
  const list = this.repoService.getFavouritesList(this.currentUserId);
  return list?.items.includes(movieId.toString()) || false;
}

isWatchLater(movieId: number): boolean {
  if (!this.currentUserId) return false;
  const list = this.repoService.getWatchLaterList(this.currentUserId);
  return list?.items.includes(movieId.toString()) || false;
}

// Modified toggle methods to properly handle last movie case
async toggleLike(movie: any) {
  if (!this.currentUserId) return;
  
  // Get current state before toggling
  const wasLiked = this.isLiked(movie.id);
  
  // 1. Update storage
  await this.repoService.toggleLikedItem(this.currentUserId, movie.id.toString());
  
  // 2. Update UI
  if (this.listType === 'liked') {
    if (wasLiked) {
      // Remove from view
      this.movies = this.movies.filter(m => m.id !== movie.id);
      
      // Clear completely if it was the last movie
      if (this.movies.length === 0) {
        this.movies = [];
      }
    }
  } else {
    this.checkMoviesStatus();
  }
}

async toggleFavorite(movie: any) {
  if (!this.currentUserId) return;
  
  const wasFavorite = this.isFavorite(movie.id);
  await this.repoService.toggleFavouriteItem(this.currentUserId, movie.id.toString());
  
  if (this.listType === 'favorites') {
    if (wasFavorite) {
      this.movies = this.movies.filter(m => m.id !== movie.id);
      
      // Clear completely if it was the last movie
      if (this.movies.length === 0) {
        this.movies = [];
      }
    }
  } else {
    this.checkMoviesStatus();
  }
}

async toggleWatchLater(movie: any) {
  if (!this.currentUserId) return;
  
  const wasWatchLater = this.isWatchLater(movie.id);
  await this.repoService.toggleWatchLaterItem(this.currentUserId, movie.id.toString());
  
  if (this.listType === 'watch-later') {
    if (wasWatchLater) {
      this.movies = this.movies.filter(m => m.id !== movie.id);
      
      // Clear completely if it was the last movie
      if (this.movies.length === 0) {
        this.movies = [];
      }
    }
  } else {
    this.checkMoviesStatus();
  }
}

// Force UI update
checkMoviesStatus() {
  this.movies = [...this.movies];
}

  // Utility functions
  formatTitle(str: string): string {
    return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
  }

  formatYear(dateStr: string): string {
    return dateStr ? new Date(dateStr).getFullYear().toString() : '';
  }

  handleImageError(event: any) {
    event.target.src = 'assets/images/no-poster.jpg';
  }
  //Func para redirecionar para pagina do filme
  openMovieInfo(movieId: number) {
    this.router.navigate(['/movieinfo', movieId]);
  }
}