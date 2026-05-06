import { Component, signal, inject } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import { Toast } from './components/toast/toast';
import { MobileNav } from './components/mobile-nav/mobile-nav';
import { ArtistsService } from './services/artists';
import { LayoutService } from './services/layout';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, Toast, MobileNav],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private router = inject(Router);
  private artistsService = inject(ArtistsService);
  private layoutService = inject(LayoutService);

  isMobile = this.layoutService.isMobile;
  isMobileNavOpen = signal(false);

  pageTitle = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => {
        const url = this.router.url;
        switch (url) {
          case '/playlist':
            return 'Playlist';

          case '/artists':
            return 'Artists';

          case '/algoritmo':
            return 'Algoritmo';
        }
        return 'Artists';
      }),
    ),
    { initialValue: 'Artists' },
  );

  onNavToggle(isOpen: boolean): void {
    this.isMobileNavOpen.set(isOpen);
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.artistsService.setSearchArtist(input.value);
  }
}
