import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ReplyComponent } from '../list/reply.component';
import { ReplyDetailComponent } from '../detail/reply-detail.component';
import { ReplyUpdateComponent } from '../update/reply-update.component';
import { ReplyRoutingResolveService } from './reply-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const replyRoute: Routes = [
  {
    path: '',
    component: ReplyComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ReplyDetailComponent,
    resolve: {
      reply: ReplyRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ReplyUpdateComponent,
    resolve: {
      reply: ReplyRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ReplyUpdateComponent,
    resolve: {
      reply: ReplyRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(replyRoute)],
  exports: [RouterModule],
})
export class ReplyRoutingModule {}
