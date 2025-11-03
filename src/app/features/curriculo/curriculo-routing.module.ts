import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListCurriculoComponent } from './components/list-curriculo/list-curriculo.component';
import { ViewCurriculoComponent } from './components/view-curriculo/view-curriculo.component';

const routes: Routes = [
  {
    path: '',
    component: ListCurriculoComponent
  },
  {
    path: 'view/:id',
    component: ViewCurriculoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CurriculoRoutingModule { }