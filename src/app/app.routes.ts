import { Routes } from '@angular/router';
import { Artists } from './pages/artists/artists';
import { Playlist } from './pages/playlist/playlist';
import { Algoritmo } from './pages/algoritmo/algoritmo';

export const routes: Routes = [
  { path: '', component: Artists },
  { path: 'playlist', component: Playlist },
  { path: 'algoritmo', component: Algoritmo },
];
