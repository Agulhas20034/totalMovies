import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RepoService, MediaItem } from 'src/app/services/repositorio/repo.service';
import { ApiTMDBService, Result, Shows } from 'src/app/services/API/api-tmdb.service';
import { firstValueFrom, forkJoin } from 'rxjs';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';

// Define media type if not imported from repo.service
type MediaType = 'movie' | 'tv';

type MediaListItem = Result | Shows;

@Component({
  standalone:false,
  selector: 'app-lists',
  templateUrl: './lists.page.html'
})
export class ListsPage implements OnInit {
  listType: string = '';
  items: MediaListItem[] = [];
  isLoading: boolean = true;
  currentUserId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private repoService: RepoService,
    private movieService: ApiTMDBService,
    private router: Router,
    private menu: MenuController,
  ) {}

  async ngOnInit() {
    const user = await firstValueFrom(this.repoService.getCurrentUser$());
    if(user == null){
      this.router.navigate(['/login']);
    }
    this.route.paramMap.subscribe(async params => {
      this.listType = params.get('listType') || '';
      await this.loadItems();
    });
    this.ionViewWillEnter();
  }

  ionViewWillEnter() {
    this.menu.enable(true);
  }

  private async loadItems() {
    try {
      const user = await firstValueFrom(this.repoService.getCurrentUser$());
      this.currentUserId = user?.id || null;
      
      if (!this.currentUserId) return;

      const list = this.getCurrentList();
      if (!list?.items?.length) {
        this.items = [];
        return;
      }

      // Convert items to proper MediaItem format
      const mediaItems: MediaItem[] = list.items.map(item => {
        if (typeof item === 'string') {
          return { id: item, mediaType: 'movie' }; // Using mediaType instead of type
        }
        return item;
      });

      // Fetch details for all items
      this.items = await firstValueFrom<any>(
        forkJoin(
          mediaItems.map(item => {
            if (item.mediaType === 'movie') {
              return this.movieService.getMovieDetails(item.id);
            } else {
              // Handle TV show case - ensure your service has this method
              if (typeof this.movieService.getTvShowDetails === 'function') {
                return this.movieService.getTvShowDetails(item.id);
              }
              throw new Error('TV show details method not available');
            }
          })
        )
      );
    } catch (error) {
      console.error('Error loading items:', error);
    } finally {
      this.isLoading = false;
    }
  }

  private getCurrentList() {
    if (!this.currentUserId) return null;
    
    switch(this.listType.toLowerCase()) {
      case 'liked': 
        return this.repoService.getLikedList(this.currentUserId);
      case 'favorites':
        return this.repoService.getFavouritesList(this.currentUserId);
      case 'watch-later':
        return this.repoService.getWatchLaterList(this.currentUserId);
      default:
        return null;
    }
  }

  getMediaType(item: MediaListItem): MediaType {
    return 'title' in item ? 'movie' : 'tv';
  }

  isLiked(itemId: number, mediaType: MediaType): boolean {
    if (!this.currentUserId) return false;
    const list = this.repoService.getLikedList(this.currentUserId);
    return list?.items.some(item => 
      item.id === itemId.toString() && 
      (typeof item === 'string' ? 'movie' : (item as MediaItem).mediaType) === mediaType
    ) || false;
  }

  isFavorite(itemId: number, mediaType: MediaType): boolean {
    if (!this.currentUserId) return false;
    const list = this.repoService.getFavouritesList(this.currentUserId);
    return list?.items.some(item => 
      item.id === itemId.toString() && 
      (typeof item === 'string' ? 'movie' : (item as MediaItem).mediaType) === mediaType
    ) || false;
  }

  isWatchLater(itemId: number, mediaType: MediaType): boolean {
    if (!this.currentUserId) return false;
    const list = this.repoService.getWatchLaterList(this.currentUserId);
    return list?.items.some(item => 
      item.id === itemId.toString() && 
      (typeof item === 'string' ? 'movie' : (item as MediaItem).mediaType) === mediaType
    ) || false;
  }

  async toggleLike(item: MediaListItem) {
    if (!this.currentUserId) return;
    
    const mediaType = this.getMediaType(item);
    await this.repoService.toggleLikedItem(
      this.currentUserId, 
      item.id.toString(),
      mediaType
    );
    
    if (this.listType === 'liked') {
      this.items = this.items.filter(i => i.id !== item.id);
    }
    this.checkItemsStatus();
  }

  async toggleFavorite(item: MediaListItem) {
    if (!this.currentUserId) return;
    
    const mediaType = this.getMediaType(item);
    await this.repoService.toggleFavouriteItem(
      this.currentUserId, 
      item.id.toString(),
      mediaType
    );
    
    if (this.listType === 'favorites') {
      this.items = this.items.filter(i => i.id !== item.id);
    }
    this.checkItemsStatus();
  }

  async toggleWatchLater(item: MediaListItem) {
    if (!this.currentUserId) return;
    
    const mediaType = this.getMediaType(item);
    await this.repoService.toggleWatchLaterItem(
      this.currentUserId, 
      item.id.toString(),
      mediaType
    );
    
    if (this.listType === 'watch-later') {
      this.items = this.items.filter(i => i.id !== item.id);
    }
    this.checkItemsStatus();
  }

  checkItemsStatus() {
    this.items = [...this.items];
  }

  getItemTitle(item: MediaListItem): string {
    return 'title' in item ? item.title : item.name;
  }

  getItemYear(item: MediaListItem): string {
    const dateStr = 'release_date' in item ? item.release_date : item.first_air_date;
    return dateStr ? new Date(dateStr).getFullYear().toString() : '';
  }

  getItemPoster(item: MediaListItem): string | undefined {
    return item.poster_path 
      ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
      : 'assets/images/no-poster.jpg';
  }

  handleImageError(event: any) {
    event.target.src = 'assets/images/no-poster.jpg';
  }

  openDetails(item: MediaListItem) {
    const route = this.getMediaType(item) === 'movie' ? '/movieinfo' : '/showinfo';
    this.router.navigate([route, item.id]);
  }
}