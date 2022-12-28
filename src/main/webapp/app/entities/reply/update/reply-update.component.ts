import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ReplyFormService, ReplyFormGroup } from './reply-form.service';
import { IReply } from '../reply.model';
import { ReplyService } from '../service/reply.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { IPoster } from 'app/entities/poster/poster.model';
import { PosterService } from 'app/entities/poster/service/poster.service';
import { IPost } from 'app/entities/post/post.model';
import { PostService } from 'app/entities/post/service/post.service';

@Component({
  selector: 'jhi-reply-update',
  templateUrl: './reply-update.component.html',
})
export class ReplyUpdateComponent implements OnInit {
  isSaving = false;
  reply: IReply | null = null;

  postersSharedCollection: IPoster[] = [];
  postsSharedCollection: IPost[] = [];

  editForm: ReplyFormGroup = this.replyFormService.createReplyFormGroup();

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected replyService: ReplyService,
    protected replyFormService: ReplyFormService,
    protected posterService: PosterService,
    protected postService: PostService,
    protected activatedRoute: ActivatedRoute
  ) {}

  comparePoster = (o1: IPoster | null, o2: IPoster | null): boolean => this.posterService.comparePoster(o1, o2);

  comparePost = (o1: IPost | null, o2: IPost | null): boolean => this.postService.comparePost(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ reply }) => {
      this.reply = reply;
      if (reply) {
        this.updateForm(reply);
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
    const reply = this.replyFormService.getReply(this.editForm);
    if (reply.id !== null) {
      this.subscribeToSaveResponse(this.replyService.update(reply));
    } else {
      this.subscribeToSaveResponse(this.replyService.create(reply));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IReply>>): void {
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

  protected updateForm(reply: IReply): void {
    this.reply = reply;
    this.replyFormService.resetForm(this.editForm, reply);

    this.postersSharedCollection = this.posterService.addPosterToCollectionIfMissing<IPoster>(this.postersSharedCollection, reply.author);
    this.postsSharedCollection = this.postService.addPostToCollectionIfMissing<IPost>(this.postsSharedCollection, reply.post);
  }

  protected loadRelationshipsOptions(): void {
    this.posterService
      .query()
      .pipe(map((res: HttpResponse<IPoster[]>) => res.body ?? []))
      .pipe(map((posters: IPoster[]) => this.posterService.addPosterToCollectionIfMissing<IPoster>(posters, this.reply?.author)))
      .subscribe((posters: IPoster[]) => (this.postersSharedCollection = posters));

    this.postService
      .query()
      .pipe(map((res: HttpResponse<IPost[]>) => res.body ?? []))
      .pipe(map((posts: IPost[]) => this.postService.addPostToCollectionIfMissing<IPost>(posts, this.reply?.post)))
      .subscribe((posts: IPost[]) => (this.postsSharedCollection = posts));
  }
}
