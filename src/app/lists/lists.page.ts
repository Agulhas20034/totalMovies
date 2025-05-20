import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RepoService } from 'src/app/services/repositorio/repo.service';
import { ApiTMDBService } from 'src/app/services/API/api-tmdb.service';
import { firstValueFrom, forkJoin } from 'rxjs';

@Component({
  standalone:false,
  selector: 'app-lists',
  templateUrl: './lists.page.html'
})
export class ListsPage {
  listType: string = '';
  movies: any[] = [];
  isLoading: boolean = true;
  currentUserId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private repoService: RepoService,
    private movieService: ApiTMDBService
  ) {
    this.route.paramMap.subscribe(async params => {
      this.listType = params.get('listType') || '';
      await this.loadMovies();
    });
  }

  private async loadMovies() {
    try {
      const user = await firstValueFrom(this.repoService.getCurrentUser$());
      this.currentUserId = user?.id || null;
      
      if (!this.currentUserId) {
        console.warn('No user ID available');
        this.isLoading = false;
        return;
      }

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
        ));
      }
    } catch (error) {
      console.error('Error loading movies:', error);
    } finally {
      this.isLoading = false;
    }
  }

  formatTitle(str: string): string {
    return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
  }

  formatYear(dateStr: string): string {
    return dateStr ? new Date(dateStr).getFullYear().toString() : '';
  }
}