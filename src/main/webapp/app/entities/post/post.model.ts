import dayjs from 'dayjs/esm';
import { IPoster } from 'app/entities/poster/poster.model';

export interface IPost {
  id: number;
  date?: dayjs.Dayjs | null;
  content?: string | null;
  postAuthor?: Pick<IPoster, 'id'> | null;
  postAuthorTag?: Pick<IPoster, 'societyTag'> | null;
}
export type NewPost = Omit<IPost, 'id'> & { id: null };
