import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ISpotifyAccount } from '../spotify-account.model';
import { SpotifyAccountService } from '../service/spotify-account.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './spotify-account-delete-dialog.component.html',
})
export class SpotifyAccountDeleteDialogComponent {
  spotifyAccount?: ISpotifyAccount;

  constructor(protected spotifyAccountService: SpotifyAccountService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.spotifyAccountService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
