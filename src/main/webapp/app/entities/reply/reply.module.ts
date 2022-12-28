import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ReplyComponent } from './list/reply.component';
import { ReplyDetailComponent } from './detail/reply-detail.component';
import { ReplyUpdateComponent } from './update/reply-update.component';
import { ReplyDeleteDialogComponent } from './delete/reply-delete-dialog.component';
import { ReplyRoutingModule } from './route/reply-routing.module';

@NgModule({
  imports: [SharedModule, ReplyRoutingModule],
  declarations: [ReplyComponent, ReplyDetailComponent, ReplyUpdateComponent, ReplyDeleteDialogComponent],
})
export class ReplyModule {}
