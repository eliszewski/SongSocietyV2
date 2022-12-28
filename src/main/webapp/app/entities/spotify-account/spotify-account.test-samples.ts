import { ISpotifyAccount, NewSpotifyAccount } from './spotify-account.model';

export const sampleWithRequiredData: ISpotifyAccount = {
  id: 98891,
};

export const sampleWithPartialData: ISpotifyAccount = {
  id: 89000,
  spotifyId: 'virtual navigate incremental',
};

export const sampleWithFullData: ISpotifyAccount = {
  id: 88845,
  spotifyId: 'Liaison back Ways',
};

export const sampleWithNewData: NewSpotifyAccount = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
