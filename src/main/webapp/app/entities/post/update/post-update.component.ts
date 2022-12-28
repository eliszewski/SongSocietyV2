import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { PostFormService, PostFormGroup } from './post-form.service';
import { IPost } from '../post.model';
import { PostService } from '../service/post.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { IPoster } from 'app/entities/poster/poster.model';
import { PosterService } from 'app/entities/poster/service/poster.service';

@Component({
  selector: 'jhi-post-update',
  templateUrl: './post-update.component.html',
})
export class PostUpdateComponent implements OnInit {
  isSaving = false;
  post: IPost | null = null;

  postersSharedCollection: IPoster[] = [];

  editForm: PostFormGroup = this.postFormService.createPostFormGroup();

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected postService: PostService,
    protected postFormService: PostFormService,
    protected posterService: PosterService,
    protected activatedRoute: ActivatedRoute
  ) {}

  comparePoster = (o1: IPoster | null, o2: IPoster | null): boolean => this.posterService.comparePoster(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ post }) => {
      this.post = post;
      if (post) {
        this.updateForm(post);
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
    const post = this.postFormService.getPost(this.editForm);
    if (post.id !== null) {
      this.subscribeToSaveResponse(this.postService.update(post));
    } else {
      this.subscribeToSaveResponse(this.postService.create(post));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPost>>): void {
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

  protected updateForm(post: IPost): void {
    this.post = post;
    this.postFormService.resetForm(this.editForm, post);

    this.postersSharedCollection = this.posterService.addPosterToCollectionIfMissing<IPoster>(
      this.postersSharedCollection,
      post.postAuthor
    );
  }

  protected loadRelationshipsOptions(): void {
    this.posterService
      .query()
      .pipe(map((res: HttpResponse<IPoster[]>) => res.body ?? []))
      .pipe(map((posters: IPoster[]) => this.posterService.addPosterToCollectionIfMissing<IPoster>(posters, this.post?.postAuthor)))
      .subscribe((posters: IPoster[]) => (this.postersSharedCollection = posters));
  }
}
