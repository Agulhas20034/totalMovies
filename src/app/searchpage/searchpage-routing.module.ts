import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SearchpagePage } from './searchpage.page';

const routes: Routes = [
  {
    path: '',
    component: SearchpagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SearchpagePageRoutingModule {}
