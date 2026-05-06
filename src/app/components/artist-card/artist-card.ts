import {
  Component,
  Input,
  Output,
  EventEmitter,
  signal,
  inject,
  OnDestroy,
  computed,
  effect,
} from '@angular/core';
import { Artist, Track } from '../../models/artist.model';
import { ArtistsService } from '../../services/artists';
import { ToastService } from '../../services/toast';

@Component({
  selector: 'app-artist-card',
  standalone: true,
  imports: [],
  templateUrl: './artist-card.html',
  styleUrl: './artist-card.scss',
})
export class ArtistCard implements OnDestroy {
  @Input() artist!: Artist;
  @Input() mode: 'grid' | 'playlist' = 'grid';
  @Output() add = new EventEmitter<Artist>();
  @Output() remove = new EventEmitter<number>();
  @Output() toggleFav = new EventEmitter<number>();

  private artistsService = inject(ArtistsService);
  private toastService = inject(ToastService);

  isPlaying = signal(false);
  isLoading = signal(false);
  currentTrack = signal<Track | null>(null);
  audio: HTMLAudioElement | null = null;
  isFavourite = computed(() => this.artistsService.isFavourite(this.artist.id));
  currentlyPlayingId = this.artistsService.currentlyPlayingId;

  constructor() {
    effect(() => {
      const playingId = this.currentlyPlayingId();
      if (playingId !== this.artist?.id && this.audio) {
        this.audio.pause();
        this.isPlaying.set(false);
      }
    });
  }

  onToggleFav(): void {
    this.toggleFav.emit(this.artist.id);
    this.artistsService.toggleFavourite(this.artist.id);
  }

  isInPlaylist = computed(() =>
    this.artistsService.playlist().some((a) => a.id === this.artist.id),
  );

  onAdd(): void {
    this.add.emit(this.artist);
    this.toastService.show(`${this.artist.name} added to the playlist`);
  }

  onRemove(): void {
    this.remove.emit(this.artist.id);
    this.toastService.show(`${this.artist.name} removed from the playlist`);
  }

  togglePlay(): void {
    const isThisPlaying = this.currentlyPlayingId() === this.artist.id;

    if (isThisPlaying) {
      this.pause();
      return;
    }

    this.artistsService.setCurrentlyPlaying(null);

    if (this.currentTrack()) {
      this.play();
      return;
    }

    this.isLoading.set(true);
    this.artistsService.getTracklist(this.artist).subscribe({
      next: (tracks) => {
        const randomIndex = Math.floor(Math.random() * tracks.length);
        const track = tracks[randomIndex];
        this.currentTrack.set(track);
        this.isLoading.set(false);
        this.play();
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }

  private play(): void {
    if (!this.currentTrack()) return;

    if (!this.audio) {
      this.audio = new Audio(this.currentTrack()!.preview);
      this.audio.addEventListener('ended', () => {
        this.isPlaying.set(false);
        this.artistsService.setCurrentlyPlaying(null);
      });
    }

    this.audio.play();
    this.isPlaying.set(true);
    this.artistsService.setCurrentlyPlaying(this.artist.id);
  }

  private pause(): void {
    this.audio?.pause();
    this.isPlaying.set(false);
    this.artistsService.setCurrentlyPlaying(null);
  }

  ngOnDestroy(): void {
    this.audio?.pause();
    this.audio = null;
  }
}
