import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { SpotifyAccountComponent } from '../list/spotify-account.component';
import { SpotifyAccountDetailComponent } from '../detail/spotify-account-detail.component';
import { SpotifyAccountUpdateComponent } from '../update/spotify-account-update.component';
import { SpotifyAccountRoutingResolveService } from './spotify-account-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const spotifyAccountRoute: Routes = [
  {
    path: '',
    component: SpotifyAccountComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: SpotifyAccountDetailComponent,
    resolve: {
      spotifyAccount: SpotifyAccountRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: SpotifyAccountUpdateComponent,
    resolve: {
      spotifyAccount: SpotifyAccountRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: SpotifyAccountUpdateComponent,
    resolve: {
      spotifyAccount: SpotifyAccountRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(spotifyAccountRoute)],
  exports: [RouterModule],
})
export class SpotifyAccountRoutingModule {}
