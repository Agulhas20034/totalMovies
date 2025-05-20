import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ListsPage } from './lists.page';
import { CommonModule as AngularCommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AngularCommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: ListsPage
      }
    ])
  ],
  declarations: [ListsPage],
  exports: [ListsPage]  // Add this export
})
export class ListsPageModule {}