export enum DisplayType {
  PROMO_BLOCK = 'promo_block',
  CONTINUE_WATCH = 'continue_watch',
  CONTENT_MOMENTS_LIST = 'content_moments_list',
  MOMENTS_LIST = 'moments_list',
  PLAYLISTS_LIST = 'playlists_list',
  DEFAULT = 'default',
  DSML_RECOMMENDATIONS = 'dsml_recommendations',
  GENRES_BELT = 'belt',
}

export enum MediaContentType {
  MOVIE = 'movie',
  SERIAL = 'serial',
  SEASON = 'season',
  EPISODE = 'episode',
  ALL = 'all',
}

export interface Country {
  code: string;
  title: string;
  seo_title: string;
  seo_slug: string;
}


export interface PrimaryContent {
  age_limit: number;
  background: string;
  content_type: MediaContentType;
  countries: Country[];
  description: string;
  duration: number;
  genre_ids: string[];
  id: string;
  imdb_rating: number;
  imdb_rating_vote_count: number;
  kinopoisk_rating: number;
  kinopoisk_rating_vote_count: number;
  poster: string;
  release_date: string;
  slug: string;
  summary: string;
  synopsis: string;
  tagline: string;
  title: string;
  title_en: string;
  seasons_count?: number;
  year: number;
}


export interface Metadata {
  'offset_480': number;
  'offset_720': number;
  'offset_1080': number;
}

export interface PlaylistItem {
  id: string;
  content_id?: string;
  content_type: any;
  content_title?: string;
  start_offset?: number;
  end_offset?: number;
  duration: number;
  title: string;
  description: string;
  content_poster: string;
  hls?: string;
  preview?: string;
  metadata?: Partial<Metadata>;
  primary_content: PrimaryContent;
}

export interface Playlist {
  id?: string;
  color?: string;
  title?: string;
  display_type?: DisplayType;
  content_moments_list?: PlaylistItem[];
  position?: number;
}
