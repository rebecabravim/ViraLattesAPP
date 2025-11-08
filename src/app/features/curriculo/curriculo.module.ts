import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { CurriculoRoutingModule } from './curriculo-routing.module';
import { ListCurriculoComponent } from './components/list-curriculo/list-curriculo.component';
import { ViewCurriculoComponent } from './components/view-curriculo/view-curriculo.component';
import { FiltrosBuscaComponent } from './components/filtros-busca/filtros-busca.component';
import { CurriculoListSimpleComponent } from './components/curriculo-list-simple/curriculo-list-simple.component';
import { FavoritosComponent } from './components/favoritos/favoritos.component';
import { HistoricoComponent } from './components/historico/historico.component';
import { MeuCurriculoComponent } from './components/meu-curriculo/meu-curriculo.component';
import { CurriculoService } from './services/curriculo.service';

@NgModule({
  declarations: [
    ListCurriculoComponent,
    ViewCurriculoComponent,
    FiltrosBuscaComponent,
    CurriculoListSimpleComponent,
    FavoritosComponent,
    HistoricoComponent,
    MeuCurriculoComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    CurriculoRoutingModule
  ],
  providers: [
    CurriculoService
  ]
})
export class CurriculoModule { }