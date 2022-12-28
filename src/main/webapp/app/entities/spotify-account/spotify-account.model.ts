export interface ISpotifyAccount {
  id: number;
  spotifyId?: string | null;
}

export type NewSpotifyAccount = Omit<ISpotifyAccount, 'id'> & { id: null };
