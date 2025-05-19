import { Component } from '@angular/core';
import { ApiTMDBService } from 'src/app/services/API/api-tmdb.service';
import { RepoService, UserInfo } from 'src/app/services/repositorio/repo.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  currentUser$ = this.repoService.getCurrentUser$();
  isUserDataLoaded = false;

  constructor(private repoService: RepoService) {
    this.initializeUserData();
  }

  private async initializeUserData() {
    try {
      this.isUserDataLoaded = true;
    } catch (error) {
      console.error('Error initializing:', error);
      this.isUserDataLoaded = true;
    }
  }

  // Rest of your existing code...
  public appPages = [
    { title: 'Main Page', url: '/mainpage', icon: 'mail' },
    { title: 'Liked', url: '', icon: 'heart' },
    { title: 'Favorites', url: '', icon: 'star' },
    { title: 'Watch Later', url: '', icon: 'archive' },
  ];
}