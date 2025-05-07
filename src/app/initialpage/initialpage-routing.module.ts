import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InitialpagePage } from './initialpage.page';

const routes: Routes = [
  {
    path: '',
    component: InitialpagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InitialpagePageRoutingModule {}
