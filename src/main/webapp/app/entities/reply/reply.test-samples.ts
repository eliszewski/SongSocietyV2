import { IReply, NewReply } from './reply.model';

export const sampleWithRequiredData: IReply = {
  id: 38791,
};

export const sampleWithPartialData: IReply = {
  id: 17938,
};

export const sampleWithFullData: IReply = {
  id: 47574,
  content: '../fake-data/blob/hipster.txt',
};

export const sampleWithNewData: NewReply = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
