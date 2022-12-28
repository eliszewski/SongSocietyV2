import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ProfileFormService, ProfileFormGroup } from './profile-form.service';
import { IProfile } from '../profile.model';
import { ProfileService } from '../service/profile.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { IPoster } from 'app/entities/poster/poster.model';
import { PosterService } from 'app/entities/poster/service/poster.service';

@Component({
  selector: 'jhi-profile-update',
  templateUrl: './profile-update.component.html',
})
export class ProfileUpdateComponent implements OnInit {
  isSaving = false;
  profile: IProfile | null = null;

  postersCollection: IPoster[] = [];

  editForm: ProfileFormGroup = this.profileFormService.createProfileFormGroup();

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected profileService: ProfileService,
    protected profileFormService: ProfileFormService,
    protected posterService: PosterService,
    protected activatedRoute: ActivatedRoute
  ) {}

  comparePoster = (o1: IPoster | null, o2: IPoster | null): boolean => this.posterService.comparePoster(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ profile }) => {
      this.profile = profile;
      if (profile) {
        this.updateForm(profile);
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

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const profile = this.profileFormService.getProfile(this.editForm);
    if (profile.id !== null) {
      this.subscribeToSaveResponse(this.profileService.update(profile));
    } else {
      this.subscribeToSaveResponse(this.profileService.create(profile));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IProfile>>): void {
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

  protected updateForm(profile: IProfile): void {
    this.profile = profile;
    this.profileFormService.resetForm(this.editForm, profile);

    this.postersCollection = this.posterService.addPosterToCollectionIfMissing<IPoster>(this.postersCollection, profile.poster);
  }

  protected loadRelationshipsOptions(): void {
    this.posterService
      .query({ filter: 'profile-is-null' })
      .pipe(map((res: HttpResponse<IPoster[]>) => res.body ?? []))
      .pipe(map((posters: IPoster[]) => this.posterService.addPosterToCollectionIfMissing<IPoster>(posters, this.profile?.poster)))
      .subscribe((posters: IPoster[]) => (this.postersCollection = posters));
  }
}
