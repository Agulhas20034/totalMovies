import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  standalone: false,
  selector: 'app-initialpage',
  templateUrl: './initialpage.page.html',
  styleUrls: ['./initialpage.page.scss'],
})
export class InitialpagePage implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {
    this.redirectAfterDelay();
  }
  redirectAfterDelay() {
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 2000);
  }
}
