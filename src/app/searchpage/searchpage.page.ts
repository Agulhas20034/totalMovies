import { Component, OnInit } from '@angular/core';
import { ApiTMDBService, Result } from '../services/API/api-tmdb.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { MenuController } from '@ionic/angular';
import { RepoService } from '../services/repositorio/repo.service';
@Component({
  standalone:false,
  selector: 'app-searchpage',
  templateUrl: './searchpage.page.html',
  styleUrls: ['./searchpage.page.scss'],
})
export class SearchpagePage implements OnInit{
  searchForm: FormGroup;
  movies: Result[] = [];
  searchResults: any[] = [];
  isLoading = false;
  errorMessage = '';

  // Available filters
  filters = {
    year: '',
    genre: '',
    language: '',
    rating: ''
  };
  hasSearched = false;
  currentUserId: number | null = null;
  // Example genres (you should get these from your API)
  genres = [
    { id: 28, name: 'Action' },
    { id: 12, name: 'Adventure' },
    { id: 16, name: 'Animation' },
    // Add more genres as needed
  ];

  constructor(
    private movieService: ApiTMDBService,
    private fb: FormBuilder,
    private router: Router,
    private repoService: RepoService,
    private menu: MenuController,
  ) {
    this.searchForm = this.fb.group({
      query: [''],
      year: [''],
      genre: [''],
      language: [''],
      rating: ['']
    });
  }
  async ngOnInit(): Promise<void> {
    const user = await firstValueFrom(this.repoService.getCurrentUser$());
    this.currentUserId = user?.id || null;
    this.ionViewWillEnter();
  }
  //Habilita sidemenu
  ionViewWillEnter() {
    this.menu.enable(true);
  }
  async searchMovies() {
  try {
    this.hasSearched = true;
    this.isLoading = true;
    this.errorMessage = '';
    
    const searchParams = this.searchForm.value;
    console.log('Searching with params:', searchParams);
    
    const response = await this.movieService.searchMovies(searchParams).toPromise();
    console.log('API Response:', response);
    
    if (response?.results) {
      this.movies = [...this.movies, ...this.searchResults];
      this.searchResults = response.results;
    } else {
      this.errorMessage = 'No results found';
      this.searchResults = [];
    }
  } catch (error) {
    console.error('Search error:', error);
    this.errorMessage = 'Failed to search movies. Please try again.';
    this.searchResults = [];
  } finally {
    this.isLoading = false;
  }
}

  clearFilters() {
    this.hasSearched = false;
    this.searchForm.reset({ query: this.searchForm.value.query });
    this.searchResults = [];
  }
  //Indica string com o caminho para ir buscar a imagem a api
  getImagePath(posterPath: string | null): string {
    return this.movieService.getFullImagePath(posterPath);
  }
  //Fallback pra caso filme nao tenha imagem valida
  handleImageError(event: any) {
    //Caminho para imagem default
    event.target.src = 'assets/images/no-poster.jpg';
    event.target.style.objectFit = 'contain'; 
  }
  //Func para redirecionar para pagina do filme
  openMovieInfo(movieId: number) {
    this.router.navigate(['/movieinfo', movieId]);
  }
  //Força deteccao de mudanças nos dados para o angular atualizar quaze instantaneamente
  async checkMoviesStatus() {
    //Atribui ao array existente um array com exatamente os mesmos dados para forçar update
    this.movies = [...this.movies];
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
    console.log("clicked");
    //Verifica se ha user loggado
    if (!this.currentUserId) return;
    console.log("past here");
    //Se ja estiver na lista retira, senao adiciona
    await this.repoService.toggleLikedItem(this.currentUserId, movieId.toString());
    //Força update
    await this.checkMoviesStatus();
  }

  // Da toggle individual ao icone de favourites do filme indicado se estiver na lista
  async toggleFavorite(movieId: number) {
    //Verifica se ha user loggado
    if (!this.currentUserId) return;    
    //Se ja estiver na lista retira, senao adiciona 
    await this.repoService.toggleFavouriteItem(this.currentUserId, movieId.toString());
    //Força update
    await this.checkMoviesStatus();
  }

  // Da toggle individual ao icone de watch later do filme indicado se estiver na lista
  async toggleWatchLater(movieId: number) {
    //Verifica se ha user loggado
    if (!this.currentUserId) return;
    //Se ja estiver na lista retira, senao adiciona
    await this.repoService.toggleWatchLaterItem(this.currentUserId, movieId.toString());
    //Força update
    await this.checkMoviesStatus();
  }
}