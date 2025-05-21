import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiTMDBService } from '../services/API/api-tmdb.service';
import { environment } from '../../environments/environment';
import { firstValueFrom } from 'rxjs';
import { RepoService } from 'src/app/services/repositorio/repo.service';
import { MenuController } from '@ionic/angular';

@Component({
  standalone: false,
  selector: 'app-showinfo',
  templateUrl: './showinfo.page.html',
  styleUrls: ['./showinfo.page.scss'],
})
export class ShowinfoPage implements OnInit {
  show: any;
  showId: number = 0;  // Initialize with default value
  imageBaseUrl = environment.images;
  isLoading = true;
  currentUserId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private movieService: ApiTMDBService,
    private repoService: RepoService,
    private menu: MenuController,
    private router: Router,
  ) { }

  async ngOnInit() {
    const user = await firstValueFrom(this.repoService.getCurrentUser$());
    if(user == null){
      this.router.navigate(['/login']);
    }
    this.currentUserId = user?.id || null;
    this.ionViewWillEnter();
    const idParam = this.route.snapshot.paramMap.get('id');
    this.showId = idParam ? +idParam : 0;  // Handle possible null
    this.loadShowDetails();
  }

  loadShowDetails() {
    this.isLoading = true;
    this.movieService.getTvShowDetails(this.showId.toString()).subscribe({
      next: (data) => {
        this.show = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching show details:', error);
        this.isLoading = false;
      }
    });
  }

  getBackdropImage(): string {
    return this.show?.backdrop_path 
      ? `${this.imageBaseUrl}/original${this.show.backdrop_path}`
      : 'assets/images/no-backdrop.jpg';
  }

  getImagePath(posterPath: string | null): string {
    return this.movieService.getFullImagePath(posterPath);
  }

  getGenres(): string {
    return this.show?.genres?.map((g: { name: string }) => g.name).join(', ') 
      || 'No genres available';
  }

  getSeasonsCount(): string {
    return this.show?.number_of_seasons 
      ? `${this.show.number_of_seasons} season${this.show.number_of_seasons !== 1 ? 's' : ''}`
      : 'No seasons info';
  }

  //Habilita sidemenu
  ionViewWillEnter() {
    this.menu.enable(true);
  }

  //Fallback pra caso show nao tenha imagem valida
  handleImageError(event: any) {
    event.target.src = 'assets/images/no-poster.jpg';
    event.target.style.objectFit = 'contain'; 
  }

  // Verifica se o show está na lista de liked do user
  isLiked(showId: number, mediaType: 'movie' | 'tv' = 'tv'): boolean {
    if (!this.currentUserId) return false;
    const list = this.repoService.getLikedList(this.currentUserId);
    return list?.items.some(item => 
      item.id === showId.toString() && item.mediaType === mediaType
    ) || false;
  }

  // Verifica se o show está na lista de favourite do user
  isFavorite(showId: number, mediaType: 'movie' | 'tv' = 'tv'): boolean {
    if (!this.currentUserId) return false;
    const list = this.repoService.getFavouritesList(this.currentUserId);
    return list?.items.some(item => 
      item.id === showId.toString() && item.mediaType === mediaType
    ) || false;
  }

  // Verifica se o show está na lista de watchlater do user
  isWatchLater(showId: number, mediaType: 'movie' | 'tv' = 'tv'): boolean {
    if (!this.currentUserId) return false;
    const list = this.repoService.getWatchLaterList(this.currentUserId);
    return list?.items.some(item => 
      item.id === showId.toString() && item.mediaType === mediaType
    ) || false;
  }

  // Da toggle individual ao icone de liked do show indicado
  async toggleLike(showId: number) {
    if (!this.currentUserId) return;
    await this.repoService.toggleLikedItem(this.currentUserId, showId.toString(), "tv");
  }

  // Da toggle individual ao icone de favourites do show indicado
  async toggleFavorite(showId: number) {
    if (!this.currentUserId) return;
    await this.repoService.toggleFavouriteItem(this.currentUserId, showId.toString(), "tv");
  }

  // Da toggle individual ao icone de watch later do show indicado
  async toggleWatchLater(showId: number) {
    if (!this.currentUserId) return;
    await this.repoService.toggleWatchLaterItem(this.currentUserId, showId.toString(), "tv");
  }
}