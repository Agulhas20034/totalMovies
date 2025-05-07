import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InitialpagePageRoutingModule } from './initialpage-routing.module';

import { InitialpagePage } from './initialpage.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InitialpagePageRoutingModule
  ],
  declarations: [InitialpagePage]
})
export class InitialpagePageModule {}
