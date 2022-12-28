import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { SpotifyAccountFormService, SpotifyAccountFormGroup } from './spotify-account-form.service';
import { ISpotifyAccount } from '../spotify-account.model';
import { SpotifyAccountService } from '../service/spotify-account.service';

@Component({
  selector: 'jhi-spotify-account-update',
  templateUrl: './spotify-account-update.component.html',
})
export class SpotifyAccountUpdateComponent implements OnInit {
  isSaving = false;
  spotifyAccount: ISpotifyAccount | null = null;

  editForm: SpotifyAccountFormGroup = this.spotifyAccountFormService.createSpotifyAccountFormGroup();

  constructor(
    protected spotifyAccountService: SpotifyAccountService,
    protected spotifyAccountFormService: SpotifyAccountFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ spotifyAccount }) => {
      this.spotifyAccount = spotifyAccount;
      if (spotifyAccount) {
        this.updateForm(spotifyAccount);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const spotifyAccount = this.spotifyAccountFormService.getSpotifyAccount(this.editForm);
    if (spotifyAccount.id !== null) {
      this.subscribeToSaveResponse(this.spotifyAccountService.update(spotifyAccount));
    } else {
      this.subscribeToSaveResponse(this.spotifyAccountService.create(spotifyAccount));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISpotifyAccount>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(spotifyAccount: ISpotifyAccount): void {
    this.spotifyAccount = spotifyAccount;
    this.spotifyAccountFormService.resetForm(this.editForm, spotifyAccount);
  }
}
