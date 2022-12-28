import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { SpotifyAccountComponent } from './list/spotify-account.component';
import { SpotifyAccountDetailComponent } from './detail/spotify-account-detail.component';
import { SpotifyAccountUpdateComponent } from './update/spotify-account-update.component';
import { SpotifyAccountDeleteDialogComponent } from './delete/spotify-account-delete-dialog.component';
import { SpotifyAccountRoutingModule } from './route/spotify-account-routing.module';

@NgModule({
  imports: [SharedModule, SpotifyAccountRoutingModule],
  declarations: [
    SpotifyAccountComponent,
    SpotifyAccountDetailComponent,
    SpotifyAccountUpdateComponent,
    SpotifyAccountDeleteDialogComponent,
  ],
})
export class SpotifyAccountModule {}
