import { Component, OnInit, signal, inject, computed, HostListener } from '@angular/core';
import { Artist } from '../../models/artist.model';
import { ArtistsService } from '../../services/artists';
import { ArtistCard } from '../../components/artist-card/artist-card';

@Component({
  selector: 'app-artists',
  standalone: true,
  imports: [ArtistCard],
  templateUrl: './artists.html',
  styleUrl: './artists.scss',
})
export class Artists implements OnInit {
  private artistsService = inject(ArtistsService);

  artists = signal<Artist[]>([]);
  isLoading = signal(true);
  isLoadingMore = signal(false);
  error = signal('');

  index = 0;
  step = 25;
  maxIndex = 100;

  ngOnInit(): void {
    this.loadMore();
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    const threshold = 300;

    const position = window.innerHeight + window.scrollY;
    const height = document.body.offsetHeight;

    if (height - position < threshold) {
      this.loadMore();
    }
  }

  loadMore(): void {
    if (this.isLoadingMore() || this.index >= this.maxIndex) {
      return;
    }

    this.isLoadingMore.set(true);

    this.artistsService.getArtists(this.index).subscribe({
      next: (data) => {
        this.artists.update((current) => [...current, ...data]);

        this.index += this.step;

        this.isLoading.set(false);
        this.isLoadingMore.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load artists.');
        this.isLoading.set(false);
        this.isLoadingMore.set(false);
        console.error(err);
      },
    });
  }

  // --------------------search----------------------------------

  filteredArtist = computed(() => {
    const artist = this.artistsService.searchArtist().toLowerCase().trim();
    if (!artist) {
      return this.artists();
    }
    return this.artists().filter((i) => i.name.toLowerCase().includes(artist));
  });
  // -------------------------------------------------------------

  onAdd(artist: Artist): void {
    this.artistsService.addToPlaylist(artist);
  }
  onRemove(artistId: number): void {
    this.artistsService.removeFromPlaylist(artistId);
  }
}
