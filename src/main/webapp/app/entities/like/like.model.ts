import { IPoster } from 'app/entities/poster/poster.model';
import { IPost } from 'app/entities/post/post.model';

export interface ILike {
  id: number;
  poster?: Pick<IPoster, 'id' | 'societyTag'> | null;
  post?: Pick<IPost, 'id'> | null;
}

export type NewLike = Omit<ILike, 'id'> & { id: null };
