import { IProfile, NewProfile } from './profile.model';

export const sampleWithRequiredData: IProfile = {
  id: 11865,
};

export const sampleWithPartialData: IProfile = {
  id: 79505,
  aboutMe: '../fake-data/blob/hipster.txt',
  favoriteSong: 'hub Gorgeous visionary',
  favoriteArtist: 'solution-oriented Accountability Surinam',
  favoriteAlbum: 'Customer',
};

export const sampleWithFullData: IProfile = {
  id: 4974,
  aboutMe: '../fake-data/blob/hipster.txt',
  favoriteSong: 'technologies disintermediate quantify',
  favoriteArtist: 'synthesizing',
  favoriteAlbum: 'Bolivar',
};

export const sampleWithNewData: NewProfile = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
