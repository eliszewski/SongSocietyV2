import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IReply, NewReply } from '../reply.model';

export type PartialUpdateReply = Partial<IReply> & Pick<IReply, 'id'>;

export type EntityResponseType = HttpResponse<IReply>;
export type EntityArrayResponseType = HttpResponse<IReply[]>;

@Injectable({ providedIn: 'root' })
export class ReplyService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/replies');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(reply: NewReply): Observable<EntityResponseType> {
    return this.http.post<IReply>(this.resourceUrl, reply, { observe: 'response' });
  }

  update(reply: IReply): Observable<EntityResponseType> {
    return this.http.put<IReply>(`${this.resourceUrl}/${this.getReplyIdentifier(reply)}`, reply, { observe: 'response' });
  }

  partialUpdate(reply: PartialUpdateReply): Observable<EntityResponseType> {
    return this.http.patch<IReply>(`${this.resourceUrl}/${this.getReplyIdentifier(reply)}`, reply, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IReply>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IReply[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getReplyIdentifier(reply: Pick<IReply, 'id'>): number {
    return reply.id;
  }

  compareReply(o1: Pick<IReply, 'id'> | null, o2: Pick<IReply, 'id'> | null): boolean {
    return o1 && o2 ? this.getReplyIdentifier(o1) === this.getReplyIdentifier(o2) : o1 === o2;
  }

  addReplyToCollectionIfMissing<Type extends Pick<IReply, 'id'>>(
    replyCollection: Type[],
    ...repliesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const replies: Type[] = repliesToCheck.filter(isPresent);
    if (replies.length > 0) {
      const replyCollectionIdentifiers = replyCollection.map(replyItem => this.getReplyIdentifier(replyItem)!);
      const repliesToAdd = replies.filter(replyItem => {
        const replyIdentifier = this.getReplyIdentifier(replyItem);
        if (replyCollectionIdentifiers.includes(replyIdentifier)) {
          return false;
        }
        replyCollectionIdentifiers.push(replyIdentifier);
        return true;
      });
      return [...repliesToAdd, ...replyCollection];
    }
    return replyCollection;
  }
}
