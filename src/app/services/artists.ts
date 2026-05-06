import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, switchMap, of } from 'rxjs';
import { Artist, DeezerResponse, Track, TracklistResponse } from '../models/artist.model';
import { environment } from '../../environments/env';

@Injectable({
  providedIn: 'root',
})
export class ArtistsService {
  playlist = signal<Artist[]>([]);
  favourites = signal<number[]>([]);
  currentlyPlayingId = signal<number | null>(null);
  searchArtist = signal('');
  private deezerUrl = environment.deezerUrl;

  constructor(private http: HttpClient) {}

  // -------------------search--------------------

  setSearchArtist(name: string): void {
    this.searchArtist.set(name);
  }
  // ----------------------------------------------

  private getLocalArtists(): Observable<Artist[]> {
    return this.http.get<DeezerResponse>('assets/data/artists.json').pipe(map((res) => res.data));
  }

  getArtists(index: number = 0): Observable<Artist[]> {
    return this.http
      .get<DeezerResponse>(`${this.deezerUrl}/chart/0/artists?limit=25&index=${index}`)
      .pipe(
        switchMap((response) =>
          response?.data?.length ? of(response.data) : this.getLocalArtists(),
        ),
        catchError(() => this.getLocalArtists()),
      );
  }

  addToPlaylist(artist: Artist): void {
    const alreadyAdded = this.playlist().some((a) => a.id === artist.id);
    if (alreadyAdded) {
      return;
    } else {
      this.playlist.update((current) => [...current, artist]);
    }
  }

  removeFromPlaylist(artistId: number): void {
    this.playlist.update((current) => current.filter((a) => a.id !== artistId));
  }

  // -----------------------favoritos------------------------

  toggleFavourite(artistId: number): void {
    const isFav = this.favourites().includes(artistId);
    if (isFav) {
      this.favourites.update((current) => current.filter((id) => id !== artistId));
    } else {
      this.favourites.update((current) => [artistId, ...current]);
    }
  }

  isFavourite(artistId: number): boolean {
    return this.favourites().includes(artistId);
  }
  //  ---------------------------------------------------------

  manualOrder(from: number, to: number): void {
    this.playlist.update((current) => {
      const updated = [...current];
      const [moved] = updated.splice(from, 1);
      updated.splice(to, 0, moved);
      return updated;
    });
  }

  // --------------------sample musica--------------------

  getTracklist(artist: Artist): Observable<Track[]> {
    const deezerTracklist = artist.tracklist.replace('https://api.deezer.com', this.deezerUrl);
    return this.http.get<TracklistResponse>(deezerTracklist).pipe(map((response) => response.data));
  }

  setCurrentlyPlaying(artistId: number | null): void {
    this.currentlyPlayingId.set(artistId);
  }
  // ------------------------------------------------------
}
