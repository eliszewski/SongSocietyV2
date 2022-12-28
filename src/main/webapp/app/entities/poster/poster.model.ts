import { IUser } from 'app/entities/user/user.model';
import { ISpotifyAccount } from 'app/entities/spotify-account/spotify-account.model';

export interface IPoster {
  id: number;
  name?: string | null;
  societyTag?: string | null;
  profilePicture?: string | null;
  profilePictureContentType?: string | null;
  user?: Pick<IUser, 'id'> | null;
  spotifyAccount?: Pick<ISpotifyAccount, 'id'> | null;
}

export type NewPoster = Omit<IPoster, 'id'> & { id: null };
