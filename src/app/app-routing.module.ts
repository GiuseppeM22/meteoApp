import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherComponent } from './components/weather/weather.component';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { NewsComponent } from './components/news/news.component';

const routes: Routes = [
  { path: 'Home', component: AppComponent },
  { path: 'meteo', component: WeatherComponent },
  { path: 'news', component: NewsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
