import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RepoService } from 'src/app/services/repositorio/repo.service';

@Component({
  standalone:false,
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  currentUser$ = this.repoService.getCurrentUser$();

  constructor(
    private repoService: RepoService,
    private router: Router
  ) {}

  public appPages = [
    { title: 'Main Page', url: '/mainpage', icon: 'home' },
    { title: 'Liked', url: '/lists/liked', icon: 'heart' },
    { title: 'Favorites', url: '/lists/favorites', icon: 'star' },
    { title: 'Watch Later', url: '/lists/watch-later', icon: 'time' },
  ];

  handleNavigation(url: string) {
    this.router.navigateByUrl(url);
  }
}