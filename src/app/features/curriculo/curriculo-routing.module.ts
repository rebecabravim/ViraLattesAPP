import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListCurriculoComponent } from './components/list-curriculo/list-curriculo.component';
import { ViewCurriculoComponent } from './components/view-curriculo/view-curriculo.component';
import { FavoritosComponent } from './components/favoritos/favoritos.component';
import { HistoricoComponent } from './components/historico/historico.component';
import { MeuCurriculoComponent } from './components/meu-curriculo/meu-curriculo.component';

const routes: Routes = [
  {
    path: '',
    component: ListCurriculoComponent
  },
  {
    path: 'favoritos',
    component: FavoritosComponent
  },
  {
    path: 'historico',
    component: HistoricoComponent
  },
  {
    path: 'meu-curriculo',
    component: MeuCurriculoComponent
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