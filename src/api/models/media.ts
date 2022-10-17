export interface Media {
  id: string;
  slug: string;
  title: string;
  description: string;
  year: number;
  tagline: string;
  synopsis: any;
  imdb_rating: any;
  imdb_rating_vote_count: any;
  kinopoisk_rating: number;
  kinopoisk_rating_vote_count: number;
  release_date: string;
  summary: any;
  age_limit: number;
  duration: number;
  poster: string;
  background: string;
  license_locked_info?: string;
  image?: any;
  preview?: string;
}
