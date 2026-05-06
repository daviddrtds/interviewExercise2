export interface Artist {
  id: number;
  name: string;
  picture_medium: string;
  picture_xl: string;
  position: number;
  tracklist: string;
}

export interface DeezerResponse {
  data: Artist[];
  total: number;
}

export interface Track {
  id: number;
  title: string;
  preview: string;
}

export interface TracklistResponse {
  data: Track[];
}
