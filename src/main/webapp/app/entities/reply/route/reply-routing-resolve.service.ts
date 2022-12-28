import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IReply } from '../reply.model';
import { ReplyService } from '../service/reply.service';

@Injectable({ providedIn: 'root' })
export class ReplyRoutingResolveService implements Resolve<IReply | null> {
  constructor(protected service: ReplyService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IReply | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((reply: HttpResponse<IReply>) => {
          if (reply.body) {
            return of(reply.body);
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
