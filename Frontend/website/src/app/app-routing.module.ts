import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { CanvasComponent } from './canvas/canvas.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {
    path: 'canvas',
    component: CanvasComponent
  },   
  {
    path: 'home',
    component: HomeComponent
  },     
  { 
    path: '',
    redirectTo:'home',
    pathMatch: 'full'
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
