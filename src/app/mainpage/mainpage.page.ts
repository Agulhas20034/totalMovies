import { Component, OnInit,Input, Output,EventEmitter } from '@angular/core';
import { InfiniteScrollCustomEvent, IonInfiniteScroll, LoadingController } from '@ionic/angular';
import { ApiTMDBService, Result } from 'src/app/services/API/api-tmdb.service';
import { environment } from 'src/environments/environment';
@Component({
  standalone: false,
  selector: 'app-mainpage',
  templateUrl: './mainpage.page.html',
  styleUrls: ['./mainpage.page.scss'],
})
export class MainpagePage implements OnInit {
  movies: Result[] = [];
  currentPage = 1;
  imagebaseurl = environment.images;
  constructor(private movieService: ApiTMDBService, private loadingCtrl: LoadingController) { }
  @Input() isLiked: boolean = false;
  @Output() liked = new EventEmitter<boolean>();
  @Input() isFavorite: boolean = false;
  @Output() favorited = new EventEmitter<boolean>();
  @Input() isWatchLater: boolean = false;
  @Output() watchLater = new EventEmitter<boolean>();
  ngOnInit() {
    this.loadMovies();
  }

  async loadMovies(event?: InfiniteScrollCustomEvent){
  //Função para dar um pequeno efeito de load enquanto carrega items para o ecra
    const loading = await this.loadingCtrl.create({
      message:'Loading ..',
      spinner: 'bubbles',
   });
   await loading.present();
    this.movieService.getTopRatedMovies(this.currentPage).subscribe((res) =>{
      //Para o loading quando os dados ja estiverem prontos a ser editados e mostrados  
      loading.dismiss();
      //Adiciona todos os elementos do array results ao array movies(para caso de ja la existirem items,
      //assim evita conflitos)
      this.movies = [...this.movies, ...res.results];
      console.log(res);
      event?.target.complete();
    });
  }

  getImagePath(posterPath: string | null): string {
    return this.movieService.getFullImagePath(posterPath);
  }

  handleImageError(event: any) {
    event.target.src = 'assets/images/no-poster.jpg';
    event.target.style.objectFit = 'contain'; 
  }

  loadMore(event: InfiniteScrollCustomEvent){
    this.currentPage++;
    this.loadMovies();
  }

  

  toggleLike() {
    this.isLiked = !this.isLiked;
    this.liked.emit(this.isLiked);
  }
   

  toggleFavorite() {
    this.isFavorite = !this.isFavorite;
    this.favorited.emit(this.isFavorite);
  }
  

  toggleWatchLater() {
    this.isWatchLater = !this.isWatchLater;
    this.watchLater.emit(this.isWatchLater);
  }
}
