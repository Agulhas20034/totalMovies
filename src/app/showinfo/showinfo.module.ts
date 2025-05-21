import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShowinfoPageRoutingModule } from './showinfo-routing.module';

import { ShowinfoPage } from './showinfo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShowinfoPageRoutingModule
  ],
  declarations: [ShowinfoPage]
})
export class ShowinfoPageModule {}
