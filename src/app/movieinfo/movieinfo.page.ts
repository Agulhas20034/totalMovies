import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiTMDBService } from '../services/API/api-tmdb.service';
import { environment } from '../../environments/environment';
import { firstValueFrom } from 'rxjs';
import { RepoService } from 'src/app/services/repositorio/repo.service';
import { MenuController } from '@ionic/angular';

@Component({
  standalone:false,
  selector: 'app-movieinfo',
  templateUrl: './movieinfo.page.html',
  styleUrls: ['./movieinfo.page.scss'],
})
export class MovieinfoPage implements OnInit {
  movie: any;
  movieId: number = 0;  // Initialize with default value
  imageBaseUrl = environment.images;
  isLoading = true;
  currentUserId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private movieService: ApiTMDBService,
    private repoService: RepoService,
    private menu: MenuController,
  ) { }

  async ngOnInit() {
    const user = await firstValueFrom(this.repoService.getCurrentUser$());
    this.currentUserId = user?.id || null;
    this.ionViewWillEnter();
    const idParam = this.route.snapshot.paramMap.get('id');
    this.movieId = idParam ? +idParam : 0;  // Handle possible null
    this.loadMovieDetails();
  }

  loadMovieDetails() {
    this.isLoading = true;
    this.movieService.getMovieDetails(this.movieId.toString()).subscribe({
      next: (data) => {
        this.movie = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching movie details:', error);
        this.isLoading = false;
      }
    });
  }

  getBackdropImage(): string {
    return this.movie?.backdrop_path 
      ? `${this.imageBaseUrl}/original${this.movie.backdrop_path}`
      : 'assets/images/no-backdrop.jpg';
  }

  getPosterImage(): string {
    return this.movie?.poster_path
      ? `${this.imageBaseUrl}/w500${this.movie.poster_path}`
      : 'assets/images/no-poster.jpg';
  }

  getGenres(): string {
    return this.movie?.genres?.map((g: { name: string }) => g.name).join(', ') 
      || 'No genres available';
  }
  //Habilita sidemenu
  ionViewWillEnter() {
    this.menu.enable(true);
  }
  //Fallback pra caso filme nao tenha imagem valida
  handleImageError(event: any, imageType: 'backdrop' | 'poster') {
    if (imageType === 'backdrop') {
      event.target.src = 'assets/images/no-backdrop.jpg';
    } else {
      event.target.src = 'assets/images/no-poster.jpg';
    }
    event.target.style.objectFit = 'contain';
  }
  //Verifica se o filme esta na lista de liked do user
  isLiked(movieId: number): boolean {
    //Verifica se ha user loggado
    if (!this.currentUserId) return false;
    //Carrega a lista
    const list = this.repoService.getLikedList(this.currentUserId);
    //Verifica a lista
    return list?.items.includes(movieId.toString()) || false;
  }

  //Verifica se o filme esta na lista de favourite do user
  isFavorite(movieId: number): boolean {
    //Verifica se ha user loggado
    if (!this.currentUserId) return false;
    //Carrega a lista
    const list = this.repoService.getFavouritesList(this.currentUserId);
    //Verifica a lista
    return list?.items.includes(movieId.toString()) || false;
  }

  //Verifica se o filme esta na lista de watchlater do user
  isWatchLater(movieId: number): boolean {
    //Verifica se ha user loggado
    if (!this.currentUserId) return false;
    //Carrega a lista
    const list = this.repoService.getWatchLaterList(this.currentUserId);
    //Verifica a lista
    return list?.items.includes(movieId.toString()) || false;
  }

  // Da toggle individual ao icone de favourites do filme indicado se estiver na lista
  async toggleLike(movieId: number) {
    //Verifica se ha user loggado
    if (!this.currentUserId) return;
    //Se ja estiver na lista retira, senao adiciona
    await this.repoService.toggleLikedItem(this.currentUserId, movieId.toString());
    
  }

  // Da toggle individual ao icone de favourites do filme indicado se estiver na lista
  async toggleFavorite(movieId: number) {
    //Verifica se ha user loggado
    if (!this.currentUserId) return;    
    //Se ja estiver na lista retira, senao adiciona 
    await this.repoService.toggleFavouriteItem(this.currentUserId, movieId.toString());
  }

  // Da toggle individual ao icone de watch later do filme indicado se estiver na lista
  async toggleWatchLater(movieId: number) {
    //Verifica se ha user loggado
    if (!this.currentUserId) return;
    //Se ja estiver na lista retira, senao adiciona
    await this.repoService.toggleWatchLaterItem(this.currentUserId, movieId.toString());
  }
 
}