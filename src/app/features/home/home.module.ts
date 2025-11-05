 import { NgModule } from '@angular/core';
 import { CommonModule } from '@angular/common';
import { HomeComponent } from './components/home.component';
import { Component } from '@angular/core'; import { FormsModule } from '@angular/forms';
@NgModule({
  declarations: [HomeComponent],
  imports: [CommonModule, FormsModule],
  exports: [HomeComponent],
})
export class HomeModule {}
