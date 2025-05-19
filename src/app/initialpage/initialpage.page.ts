import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';

@Component({
  standalone: false,
  selector: 'app-initialpage',
  templateUrl: './initialpage.page.html',
  styleUrls: ['./initialpage.page.scss'],
})
export class InitialpagePage implements OnInit {
  constructor(private router: Router,private menu: MenuController) {}

  ngOnInit() {
    this.ionViewWillEnter();
    this.redirectAfterDelay();
  }
  //Desabilita sidemenu
  ionViewWillEnter() {
    this.menu.enable(false);
  }
  redirectAfterDelay() {
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 2000);
  }
}
