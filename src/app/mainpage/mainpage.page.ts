import { Component, OnInit } from '@angular/core';
import { InfiniteScrollCustomEvent, LoadingController } from '@ionic/angular';
import { ApiTMDBService, Result } from 'src/app/services/API/api-tmdb.service';
import { environment } from 'src/environments/environment';
import { RepoService } from 'src/app/services/repositorio/repo.service';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
@Component({
  standalone:false,
  selector: 'app-mainpage',
  templateUrl: './mainpage.page.html',
  styleUrls: ['./mainpage.page.scss'],
})
export class MainpagePage implements OnInit {
  movies: Result[] = [];
  currentPage = 1;
  currentUserId: number | null = null;

  constructor(
    //Variavel do injetavel do serviço da api
    private movieService: ApiTMDBService, 
    //Variavel do import para loading infinito
    private loadingCtrl: LoadingController,
    //Variavel do injetavel do serviço do repo
    private repoService: RepoService,
    //Variavel do import do redirecionamento
    private router: Router,
    private menu: MenuController,
  ) { }
  
  async ngOnInit() {
    const user = await firstValueFrom(this.repoService.getCurrentUser$());
    if(user == null){
      this.router.navigate(['/login']);
    }
    this.currentUserId = user?.id || null;
    this.ionViewWillEnter();
    this.currentUserId = user?.id || null;
    await this.loadMovies();
  }
  //Habilita sidemenu
  ionViewWillEnter() {
    this.menu.enable(true);
  }
  async loadMovies(event?: InfiniteScrollCustomEvent) {
    //Cria um pequeno loading enquanto carrega
    const loading = await this.loadingCtrl.create({
      message: 'Loading...',
      spinner: 'bubbles',
    });
    await loading.present();

    this.movieService.getTopRatedMovies(this.currentPage).subscribe(async (res) => {
      //Para o loading
      loading.dismiss();
      
      //Para caso de carregar mais filmes no ecra, adiciona os gerados á lista existente
      const newMovies = res.results.filter(newMovie => 
        !this.movies.some(existingMovie => existingMovie.id === newMovie.id)
      );
      this.movies = [...this.movies, ...newMovies];
      
      // Verifica o status
      await this.checkMoviesStatus();
      //Da evento como completo
      event?.target.complete();
    });
  }
  //Força deteccao de mudanças nos dados para o angular atualizar quaze instantaneamente
  async checkMoviesStatus() {
    //Atribui ao array existente um array com exatamente os mesmos dados para forçar update
    this.movies = [...this.movies];
  }

  // Verifica se o filme/série está na lista de liked do user
  isLiked(movieId: number, mediaType: 'movie' | 'tv' = 'movie'): boolean {
    if (!this.currentUserId) return false;
    const list = this.repoService.getLikedList(this.currentUserId);
    return list?.items.some(item => 
      item.id === movieId.toString() && item.mediaType === mediaType
    ) || false;
  }

  // Verifica se o filme/série está na lista de favourite do user
  isFavorite(movieId: number, mediaType: 'movie' | 'tv' = 'movie'): boolean {
    if (!this.currentUserId) return false;
    const list = this.repoService.getFavouritesList(this.currentUserId);
    return list?.items.some(item => 
      item.id === movieId.toString() && item.mediaType === mediaType
    ) || false;
  }

  // Verifica se o filme/série está na lista de watchlater do user
  isWatchLater(movieId: number, mediaType: 'movie' | 'tv' = 'movie'): boolean {
    if (!this.currentUserId) return false;
    const list = this.repoService.getWatchLaterList(this.currentUserId);
    return list?.items.some(item => 
      item.id === movieId.toString() && item.mediaType === mediaType
    ) || false;
  }

  // Da toggle individual ao icone de favourites do filme indicado se estiver na lista
  async toggleLike(movieId: number) {
    console.log("clicked");
    //Verifica se ha user loggado
    if (!this.currentUserId) return;
    console.log("past here");
    //Se ja estiver na lista retira, senao adiciona
    await this.repoService.toggleLikedItem(this.currentUserId, movieId.toString(), "movie");
    //Força update
    await this.checkMoviesStatus();
  }

  // Da toggle individual ao icone de favourites do filme indicado se estiver na lista
  async toggleFavorite(movieId: number) {
    //Verifica se ha user loggado
    if (!this.currentUserId) return;    
    //Se ja estiver na lista retira, senao adiciona 
    await this.repoService.toggleFavouriteItem(this.currentUserId, movieId.toString(), "movie");
    //Força update
    await this.checkMoviesStatus();
  }

  // Da toggle individual ao icone de watch later do filme indicado se estiver na lista
  async toggleWatchLater(movieId: number) {
    //Verifica se ha user loggado
    if (!this.currentUserId) return;
    //Se ja estiver na lista retira, senao adiciona
    await this.repoService.toggleWatchLaterItem(this.currentUserId, movieId.toString(), "movie");
    //Força update
    await this.checkMoviesStatus();
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
  //Func para carregar mais filmes quando der trigger ao evento
  loadMore(event: InfiniteScrollCustomEvent) {
    //Incrementa pagina atual
    this.currentPage++;
    //Carrega filmes
    this.loadMovies(event);
  }
  //Func para redirecionar para pagina do filme
  openMovieInfo(movieId: number) {
    this.router.navigate(['/movieinfo', movieId]);
  }
}