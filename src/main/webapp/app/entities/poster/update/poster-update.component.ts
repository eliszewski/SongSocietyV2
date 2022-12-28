import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { PosterFormService, PosterFormGroup } from './poster-form.service';
import { IPoster } from '../poster.model';
import { PosterService } from '../service/poster.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { ISpotifyAccount } from 'app/entities/spotify-account/spotify-account.model';
import { SpotifyAccountService } from 'app/entities/spotify-account/service/spotify-account.service';

@Component({
  selector: 'jhi-poster-update',
  templateUrl: './poster-update.component.html',
})
export class PosterUpdateComponent implements OnInit {
  isSaving = false;
  poster: IPoster | null = null;

  usersSharedCollection: IUser[] = [];
  spotifyAccountsCollection: ISpotifyAccount[] = [];

  editForm: PosterFormGroup = this.posterFormService.createPosterFormGroup();

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected posterService: PosterService,
    protected posterFormService: PosterFormService,
    protected userService: UserService,
    protected spotifyAccountService: SpotifyAccountService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  compareSpotifyAccount = (o1: ISpotifyAccount | null, o2: ISpotifyAccount | null): boolean =>
    this.spotifyAccountService.compareSpotifyAccount(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ poster }) => {
      this.poster = poster;
      if (poster) {
        this.updateForm(poster);
      }

      this.loadRelationshipsOptions();
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(new EventWithContent<AlertError>('songSocietyApp.error', { ...err, key: 'error.file.' + err.key })),
    });
  }

  clearInputImage(field: string, fieldContentType: string, idInput: string): void {
    this.editForm.patchValue({
      [field]: null,
      [fieldContentType]: null,
    });
    if (idInput && this.elementRef.nativeElement.querySelector('#' + idInput)) {
      this.elementRef.nativeElement.querySelector('#' + idInput).value = null;
    }
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const poster = this.posterFormService.getPoster(this.editForm);
    if (poster.id !== null) {
      this.subscribeToSaveResponse(this.posterService.update(poster));
    } else {
      this.subscribeToSaveResponse(this.posterService.create(poster));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPoster>>): void {
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

  protected updateForm(poster: IPoster): void {
    this.poster = poster;
    this.posterFormService.resetForm(this.editForm, poster);

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing<IUser>(this.usersSharedCollection, poster.user);
    this.spotifyAccountsCollection = this.spotifyAccountService.addSpotifyAccountToCollectionIfMissing<ISpotifyAccount>(
      this.spotifyAccountsCollection,
      poster.spotifyAccount
    );
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, this.poster?.user)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));

    this.spotifyAccountService
      .query({ filter: 'poster-is-null' })
      .pipe(map((res: HttpResponse<ISpotifyAccount[]>) => res.body ?? []))
      .pipe(
        map((spotifyAccounts: ISpotifyAccount[]) =>
          this.spotifyAccountService.addSpotifyAccountToCollectionIfMissing<ISpotifyAccount>(spotifyAccounts, this.poster?.spotifyAccount)
        )
      )
      .subscribe((spotifyAccounts: ISpotifyAccount[]) => (this.spotifyAccountsCollection = spotifyAccounts));
  }
}
