import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { PostComponent } from './list/post.component';
import { PostDetailComponent } from './detail/post-detail.component';
import { PostUpdateComponent } from './update/post-update.component';
import { PostDeleteDialogComponent } from './delete/post-delete-dialog.component';
import { PostRoutingModule } from './route/post-routing.module';
import { LinkyModule } from 'ngx-linky';

@NgModule({
  imports: [SharedModule, PostRoutingModule, LinkyModule],
  declarations: [PostComponent, PostDetailComponent, PostUpdateComponent, PostDeleteDialogComponent],
})
export class PostModule {}
