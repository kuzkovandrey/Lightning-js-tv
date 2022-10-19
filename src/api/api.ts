import { Playlist } from './models/playlist';
import { Media } from './models/media';
import { environment } from '../../env';

export class Http {
  static get<T>(url: string): Promise<T> {
    return fetch(url).then(res => res.json() as Promise<T>);
  }
}

export const getMainPagePlaylists = (): Promise<Playlist[]> => {
  return Http.get<Playlist[]>(
    `${environment.baseUrl}/main_page`
  ).then(playlists =>
    playlists.filter(playlist => !!playlist.content_moments_list)
  );
};

export const getMediaList = (): Promise<Media[]> => {
  return Http.get<Media[]>(
    `${environment.baseUrl}/contents/cold_recommendations?visitor_id=${environment.visitorId}`
  );
};
