import { Component, OnInit } from '@angular/core';
import { ApiTMDBService, Result } from '../services/API/api-tmdb.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { MenuController } from '@ionic/angular';
import { RepoService } from '../services/repositorio/repo.service';

@Component({
  standalone: false,
  selector: 'app-searchpage',
  templateUrl: './searchpage.page.html',
  styleUrls: ['./searchpage.page.scss'],
})
export class SearchpagePage implements OnInit {
  searchForm: FormGroup;
  movies: Result[] = [];
  searchResults: any[] = [];
  isLoading = false;
  // Add this property to your component
  currentYear = new Date().getFullYear();
  errorMessage = '';
  mediaType: 'movie' | 'tv' = 'movie'; // Default to movies
  filters = {
    year: '',
    genre: '',
    language: '',
    rating: ''
  };
  hasSearched = false;
  currentUserId: number | null = null;
  genres: any[] = [];

  constructor(
    private movieService: ApiTMDBService,
    private fb: FormBuilder,
    private router: Router,
    private repoService: RepoService,
    private menu: MenuController,
  ) {
    this.searchForm = this.fb.group({
      query: [''],
      year: [null],
      genre: [null],
      language: ['en'],
      rating: [null]
    });
  }

  async ngOnInit(): Promise<void> {
    const user = await firstValueFrom(this.repoService.getCurrentUser$());
    if(user == null){
      this.router.navigate(['/login']);
    }
    this.currentUserId = user?.id || null;
    await this.loadGenres();
    this.ionViewWillEnter();
  }

  ionViewWillEnter() {
    this.menu.enable(true);
  }

  async loadGenres() {
    try {
      const response: any = await this.movieService.getGenres(this.mediaType).toPromise();
      this.genres = response.genres;
    } catch (error) {
      console.error('Failed to load genres:', error);
    }
  }

  async search() {
    this.isLoading = true;
    this.hasSearched = true;
    
    try {
      let response: any;
      const formValue = this.searchForm.value;

      if (formValue.query) {
        response = await this.movieService.search(this.mediaType, formValue.query).toPromise();
      } else {
        response = await this.movieService.discover({
          mediaType: this.mediaType,
          year: formValue.year,
          genre: formValue.genre,
          rating: formValue.rating,
          language: formValue.language
        }).toPromise();
      }

      this.searchResults = response.results;
      
      if (this.searchResults.length === 0) {
        this.errorMessage = `No ${this.mediaType === 'movie' ? 'movies' : 'TV shows'} found. Try different filters.`;
      }
    } catch (error) {
      console.error('Search error:', error);
      this.errorMessage = 'Search failed. Please try again.';
    } finally {
      this.isLoading = false;
    }
  }

  clearFilters() {
    this.searchForm.reset({
      language: 'en',
      rating: null,
      genre: null,
      year: null,
      query: ''
    });
    this.hasSearched = false;
    this.searchResults = [];
    this.errorMessage = '';
  }

  getImagePath(posterPath: string | null): string {
    return this.movieService.getFullImagePath(posterPath);
  }

  handleImageError(event: any) {
    event.target.src = 'assets/images/no-poster.jpg';
    event.target.style.objectFit = 'contain'; 
  }

  openDetails(id: number) {
      if (this.mediaType === 'movie') {
        this.router.navigate(['/movieinfo', id]);
      } else {
        this.router.navigate(['/showinfo', id]);
      } 
   }

  async checkMoviesStatus() {
    this.searchResults = [...this.searchResults];
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

  async toggleLike(movieId: number) {
    if (!this.currentUserId) return;
    if(this.mediaType=="tv"){
      await this.repoService.toggleLikedItem(this.currentUserId, movieId.toString(),"tv");
    }else{
      await this.repoService.toggleLikedItem(this.currentUserId, movieId.toString(),"movie");
    }
    await this.checkMoviesStatus();
  }

  async toggleFavorite(movieId: number) {
    if (!this.currentUserId) return;    
    if(this.mediaType=="tv"){
      await this.repoService.toggleFavouriteItem(this.currentUserId, movieId.toString(),"tv");
    }else{
      await this.repoService.toggleFavouriteItem(this.currentUserId, movieId.toString(),"movie");
    }    
    await this.checkMoviesStatus();
  }

  async toggleWatchLater(movieId: number) {
    if (!this.currentUserId) return;
    if(this.mediaType=="tv"){
      await this.repoService.toggleWatchLaterItem(this.currentUserId, movieId.toString(),"tv");
    }else{
      await this.repoService.toggleWatchLaterItem(this.currentUserId, movieId.toString(),"movie");
    }    
    await this.checkMoviesStatus();
  }

  // Add this method to handle media type changes
  onMediaTypeChange() {
    this.clearFilters();
    this.loadGenres();
  }
 
}