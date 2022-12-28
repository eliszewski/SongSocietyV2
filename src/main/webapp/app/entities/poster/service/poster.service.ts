import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPoster, NewPoster } from '../poster.model';

export type PartialUpdatePoster = Partial<IPoster> & Pick<IPoster, 'id'>;

export type EntityResponseType = HttpResponse<IPoster>;
export type EntityArrayResponseType = HttpResponse<IPoster[]>;

@Injectable({ providedIn: 'root' })
export class PosterService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/posters');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(poster: NewPoster): Observable<EntityResponseType> {
    return this.http.post<IPoster>(this.resourceUrl, poster, { observe: 'response' });
  }

  update(poster: IPoster): Observable<EntityResponseType> {
    return this.http.put<IPoster>(`${this.resourceUrl}/${this.getPosterIdentifier(poster)}`, poster, { observe: 'response' });
  }

  partialUpdate(poster: PartialUpdatePoster): Observable<EntityResponseType> {
    return this.http.patch<IPoster>(`${this.resourceUrl}/${this.getPosterIdentifier(poster)}`, poster, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IPoster>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IPoster[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getPosterIdentifier(poster: Pick<IPoster, 'id'>): number {
    return poster.id;
  }

  comparePoster(o1: Pick<IPoster, 'id'> | null, o2: Pick<IPoster, 'id'> | null): boolean {
    return o1 && o2 ? this.getPosterIdentifier(o1) === this.getPosterIdentifier(o2) : o1 === o2;
  }

  addPosterToCollectionIfMissing<Type extends Pick<IPoster, 'id'>>(
    posterCollection: Type[],
    ...postersToCheck: (Type | null | undefined)[]
  ): Type[] {
    const posters: Type[] = postersToCheck.filter(isPresent);
    if (posters.length > 0) {
      const posterCollectionIdentifiers = posterCollection.map(posterItem => this.getPosterIdentifier(posterItem)!);
      const postersToAdd = posters.filter(posterItem => {
        const posterIdentifier = this.getPosterIdentifier(posterItem);
        if (posterCollectionIdentifiers.includes(posterIdentifier)) {
          return false;
        }
        posterCollectionIdentifiers.push(posterIdentifier);
        return true;
      });
      return [...postersToAdd, ...posterCollection];
    }
    return posterCollection;
  }
}
