import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SearchpagePageRoutingModule } from './searchpage-routing.module';

import { SearchpagePage } from './searchpage.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
     FormsModule,
    ReactiveFormsModule,
    SearchpagePageRoutingModule,
    
  ],
  declarations: [SearchpagePage]
})
export class SearchpagePageModule {}
