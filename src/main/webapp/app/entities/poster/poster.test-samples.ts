import { IPoster, NewPoster } from './poster.model';

export const sampleWithRequiredData: IPoster = {
  id: 53201,
  name: 'Coordinator Regional',
  societyTag: 'overriding SDD',
};

export const sampleWithPartialData: IPoster = {
  id: 51240,
  name: 'Bacon Home Loan',
  societyTag: 'SMTP teal withdrawal',
  profilePicture: '../fake-data/blob/hipster.png',
  profilePictureContentType: 'unknown',
};

export const sampleWithFullData: IPoster = {
  id: 84391,
  name: 'Lodge proactive',
  societyTag: 'channels',
  profilePicture: '../fake-data/blob/hipster.png',
  profilePictureContentType: 'unknown',
};

export const sampleWithNewData: NewPoster = {
  name: 'transmitting Sleek',
  societyTag: 'compelling',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
