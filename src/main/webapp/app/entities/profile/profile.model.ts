import { IPoster } from 'app/entities/poster/poster.model';

export interface IProfile {
  id: number;
  aboutMe?: string | null;
  favoriteSong?: string | null;
  favoriteArtist?: string | null;
  favoriteAlbum?: string | null;
  poster?: Pick<IPoster, 'id'> | null;
}

export type NewProfile = Omit<IProfile, 'id'> & { id: null };
