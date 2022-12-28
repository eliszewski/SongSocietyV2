import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IPoster } from '../poster.model';
import { PosterService } from '../service/poster.service';

@Injectable({ providedIn: 'root' })
export class PosterRoutingResolveService implements Resolve<IPoster | null> {
  constructor(protected service: PosterService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPoster | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((poster: HttpResponse<IPoster>) => {
          if (poster.body) {
            return of(poster.body);
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
