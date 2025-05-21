import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShowinfoPage } from './showinfo.page';

const routes: Routes = [
  {
    path: ':id',
    component: ShowinfoPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShowinfoPageRoutingModule {}
