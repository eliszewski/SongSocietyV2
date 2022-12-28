import dayjs from 'dayjs/esm';

import { IPost, NewPost } from './post.model';

export const sampleWithRequiredData: IPost = {
  id: 35989,
  date: dayjs('2022-12-27T12:32'),
  content: '../fake-data/blob/hipster.txt',
};

export const sampleWithPartialData: IPost = {
  id: 8512,
  date: dayjs('2022-12-27T07:32'),
  content: '../fake-data/blob/hipster.txt',
};

export const sampleWithFullData: IPost = {
  id: 25947,
  date: dayjs('2022-12-27T02:03'),
  content: '../fake-data/blob/hipster.txt',
};

export const sampleWithNewData: NewPost = {
  date: dayjs('2022-12-26T18:04'),
  content: '../fake-data/blob/hipster.txt',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
