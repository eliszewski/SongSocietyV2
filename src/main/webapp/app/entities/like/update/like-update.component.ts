import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { LikeFormService, LikeFormGroup } from './like-form.service';
import { ILike } from '../like.model';
import { LikeService } from '../service/like.service';
import { IPoster } from 'app/entities/poster/poster.model';
import { PosterService } from 'app/entities/poster/service/poster.service';
import { IPost } from 'app/entities/post/post.model';
import { PostService } from 'app/entities/post/service/post.service';

@Component({
  selector: 'jhi-like-update',
  templateUrl: './like-update.component.html',
})
export class LikeUpdateComponent implements OnInit {
  isSaving = false;
  like: ILike | null = null;

  postersCollection: IPoster[] = [];
  postsSharedCollection: IPost[] = [];

  editForm: LikeFormGroup = this.likeFormService.createLikeFormGroup();

  constructor(
    protected likeService: LikeService,
    protected likeFormService: LikeFormService,
    protected posterService: PosterService,
    protected postService: PostService,
    protected activatedRoute: ActivatedRoute
  ) {}

  comparePoster = (o1: IPoster | null, o2: IPoster | null): boolean => this.posterService.comparePoster(o1, o2);

  comparePost = (o1: IPost | null, o2: IPost | null): boolean => this.postService.comparePost(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ like }) => {
      this.like = like;
      if (like) {
        this.updateForm(like);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const like = this.likeFormService.getLike(this.editForm);
    if (like.id !== null) {
      this.subscribeToSaveResponse(this.likeService.update(like));
    } else {
      this.subscribeToSaveResponse(this.likeService.create(like));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ILike>>): void {
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

  protected updateForm(like: ILike): void {
    this.like = like;
    this.likeFormService.resetForm(this.editForm, like);

    this.postersCollection = this.posterService.addPosterToCollectionIfMissing<IPoster>(this.postersCollection, like.poster);
    this.postsSharedCollection = this.postService.addPostToCollectionIfMissing<IPost>(this.postsSharedCollection, like.post);
  }

  protected loadRelationshipsOptions(): void {
    this.posterService
      .query({ filter: 'like-is-null' })
      .pipe(map((res: HttpResponse<IPoster[]>) => res.body ?? []))
      .pipe(map((posters: IPoster[]) => this.posterService.addPosterToCollectionIfMissing<IPoster>(posters, this.like?.poster)))
      .subscribe((posters: IPoster[]) => (this.postersCollection = posters));

    this.postService
      .query()
      .pipe(map((res: HttpResponse<IPost[]>) => res.body ?? []))
      .pipe(map((posts: IPost[]) => this.postService.addPostToCollectionIfMissing<IPost>(posts, this.like?.post)))
      .subscribe((posts: IPost[]) => (this.postsSharedCollection = posts));
  }
}
