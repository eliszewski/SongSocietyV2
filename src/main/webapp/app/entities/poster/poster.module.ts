import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { PosterComponent } from './list/poster.component';
import { PosterDetailComponent } from './detail/poster-detail.component';
import { PosterUpdateComponent } from './update/poster-update.component';
import { PosterDeleteDialogComponent } from './delete/poster-delete-dialog.component';
import { PosterRoutingModule } from './route/poster-routing.module';

@NgModule({
  imports: [SharedModule, PosterRoutingModule],
  declarations: [PosterComponent, PosterDetailComponent, PosterUpdateComponent, PosterDeleteDialogComponent],
})
export class PosterModule {}
