import { IPoster } from 'app/entities/poster/poster.model';
import { IPost } from 'app/entities/post/post.model';

export interface IReply {
  id: number;
  content?: string | null;
  author?: Pick<IPoster, 'id'> | null;
  post?: Pick<IPost, 'id'> | null;
}

export type NewReply = Omit<IReply, 'id'> & { id: null };
