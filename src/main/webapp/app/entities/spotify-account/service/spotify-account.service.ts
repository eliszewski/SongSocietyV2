import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ISpotifyAccount, NewSpotifyAccount } from '../spotify-account.model';

export type PartialUpdateSpotifyAccount = Partial<ISpotifyAccount> & Pick<ISpotifyAccount, 'id'>;

export type EntityResponseType = HttpResponse<ISpotifyAccount>;
export type EntityArrayResponseType = HttpResponse<ISpotifyAccount[]>;

@Injectable({ providedIn: 'root' })
export class SpotifyAccountService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/spotify-accounts');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(spotifyAccount: NewSpotifyAccount): Observable<EntityResponseType> {
    return this.http.post<ISpotifyAccount>(this.resourceUrl, spotifyAccount, { observe: 'response' });
  }

  update(spotifyAccount: ISpotifyAccount): Observable<EntityResponseType> {
    return this.http.put<ISpotifyAccount>(`${this.resourceUrl}/${this.getSpotifyAccountIdentifier(spotifyAccount)}`, spotifyAccount, {
      observe: 'response',
    });
  }

  partialUpdate(spotifyAccount: PartialUpdateSpotifyAccount): Observable<EntityResponseType> {
    return this.http.patch<ISpotifyAccount>(`${this.resourceUrl}/${this.getSpotifyAccountIdentifier(spotifyAccount)}`, spotifyAccount, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ISpotifyAccount>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ISpotifyAccount[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getSpotifyAccountIdentifier(spotifyAccount: Pick<ISpotifyAccount, 'id'>): number {
    return spotifyAccount.id;
  }

  compareSpotifyAccount(o1: Pick<ISpotifyAccount, 'id'> | null, o2: Pick<ISpotifyAccount, 'id'> | null): boolean {
    return o1 && o2 ? this.getSpotifyAccountIdentifier(o1) === this.getSpotifyAccountIdentifier(o2) : o1 === o2;
  }

  addSpotifyAccountToCollectionIfMissing<Type extends Pick<ISpotifyAccount, 'id'>>(
    spotifyAccountCollection: Type[],
    ...spotifyAccountsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const spotifyAccounts: Type[] = spotifyAccountsToCheck.filter(isPresent);
    if (spotifyAccounts.length > 0) {
      const spotifyAccountCollectionIdentifiers = spotifyAccountCollection.map(
        spotifyAccountItem => this.getSpotifyAccountIdentifier(spotifyAccountItem)!
      );
      const spotifyAccountsToAdd = spotifyAccounts.filter(spotifyAccountItem => {
        const spotifyAccountIdentifier = this.getSpotifyAccountIdentifier(spotifyAccountItem);
        if (spotifyAccountCollectionIdentifiers.includes(spotifyAccountIdentifier)) {
          return false;
        }
        spotifyAccountCollectionIdentifiers.push(spotifyAccountIdentifier);
        return true;
      });
      return [...spotifyAccountsToAdd, ...spotifyAccountCollection];
    }
    return spotifyAccountCollection;
  }
}
