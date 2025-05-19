import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { MovieinfoPage } from './movieinfo.page';
import { MovieinfoPageRoutingModule } from './movieinfo-routing.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    MovieinfoPageRoutingModule
  ],
  declarations: [MovieinfoPage]
})
export class MovieinfoPageModule {}