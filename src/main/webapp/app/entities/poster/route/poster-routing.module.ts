import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { PosterComponent } from '../list/poster.component';
import { PosterDetailComponent } from '../detail/poster-detail.component';
import { PosterUpdateComponent } from '../update/poster-update.component';
import { PosterRoutingResolveService } from './poster-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const posterRoute: Routes = [
  {
    path: '',
    component: PosterComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PosterDetailComponent,
    resolve: {
      poster: PosterRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PosterUpdateComponent,
    resolve: {
      poster: PosterRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PosterUpdateComponent,
    resolve: {
      poster: PosterRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(posterRoute)],
  exports: [RouterModule],
})
export class PosterRoutingModule {}
