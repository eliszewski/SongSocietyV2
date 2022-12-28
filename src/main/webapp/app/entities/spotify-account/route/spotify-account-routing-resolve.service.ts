import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ISpotifyAccount } from '../spotify-account.model';
import { SpotifyAccountService } from '../service/spotify-account.service';

@Injectable({ providedIn: 'root' })
export class SpotifyAccountRoutingResolveService implements Resolve<ISpotifyAccount | null> {
  constructor(protected service: SpotifyAccountService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ISpotifyAccount | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((spotifyAccount: HttpResponse<ISpotifyAccount>) => {
          if (spotifyAccount.body) {
            return of(spotifyAccount.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
