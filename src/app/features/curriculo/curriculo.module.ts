import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { CurriculoRoutingModule } from './curriculo-routing.module';
import { ListCurriculoComponent } from './components/list-curriculo/list-curriculo.component';
import { ViewCurriculoComponent } from './components/view-curriculo/view-curriculo.component';
import { FiltrosBuscaComponent } from './components/filtros-busca/filtros-busca.component';
import { CurriculoService } from './services/curriculo.service';

@NgModule({
  declarations: [
    ListCurriculoComponent,
    ViewCurriculoComponent,
    FiltrosBuscaComponent
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