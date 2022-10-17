import { Playlist } from './models/playlist';
import { Media } from './models/media';

const BASE_URL = 'https://api.stg.testvip.ru/api/v1/';

const VISITOR_ID = '63de3b4c-b664-48fc-9717-6d5be98aa9d2';

export class Http {
  static get<T>(url: string): Promise<T> {
    return fetch(url).then(res => res.json() as Promise<T>);
  }
}

export const getMainPagePlaylists = (): Promise<Playlist[]> => {
  return Http.get<Playlist[]>(`${BASE_URL}/main_page`).then(playlists =>
    playlists.filter(playlist => !!playlist.content_moments_list)
  );
};

export const getMediaList = (): Promise<Media[]> => {
  return Http.get<Media[]>(
    `${BASE_URL}/contents/cold_recommendations?visitor_id=${VISITOR_ID}`
  );
};
