import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SearchpagePageRoutingModule } from './searchpage-routing.module';

import { SearchpagePage } from './searchpage.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SearchpagePageRoutingModule
  ],
  declarations: [SearchpagePage]
})
export class SearchpagePageModule {}
