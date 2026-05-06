import { Component, inject, computed } from '@angular/core';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { Artist } from '../../models/artist.model';
import { ArtistsService } from '../../services/artists';
import { ArtistCard } from '../../components/artist-card/artist-card';

@Component({
  selector: 'app-playlist',
  standalone: true,
  imports: [DragDropModule, ArtistCard],
  templateUrl: './playlist.html',
  styleUrl: './playlist.scss',
})
export class Playlist {
  private artistService = inject(ArtistsService);
  playlist = this.artistService.playlist;

  filteredPlaylist = computed(() => {
    const artist = this.artistService.searchArtist().toLowerCase().trim();
    if (!artist) {
      return this.playlist();
    } else {
      return this.playlist().filter((a) => a.name.toLowerCase().includes(artist));
    }
  });

  favourites = computed(() =>
    this.filteredPlaylist().filter((a) => this.artistService.isFavourite(a.id)),
  );

  queue = computed(() =>
    this.filteredPlaylist().filter((a) => !this.artistService.isFavourite(a.id)),
  );

  dropFavourites(event: CdkDragDrop<Artist[]>): void {
    const favIds = this.favourites().map((a) => a.id);
    const fullPlaylist = [...this.playlist()];

    const fromIndex = fullPlaylist.findIndex((a) => a.id === favIds[event.previousIndex]);
    const toIndex = fullPlaylist.findIndex((a) => a.id === favIds[event.currentIndex]);

    this.artistService.manualOrder(fromIndex, toIndex);
  }

  dropQueue(event: CdkDragDrop<Artist[]>): void {
    const queueIds = this.queue().map((a) => a.id);
    const fullPlaylist = [...this.playlist()];

    const fromIndex = fullPlaylist.findIndex((a) => a.id === queueIds[event.previousIndex]);
    const toIndex = fullPlaylist.findIndex((a) => a.id === queueIds[event.currentIndex]);

    this.artistService.manualOrder(fromIndex, toIndex);
  }

  remove(artistId: number): void {
    this.artistService.removeFromPlaylist(artistId);
  }
}
