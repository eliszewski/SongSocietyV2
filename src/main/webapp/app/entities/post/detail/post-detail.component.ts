import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPost } from '../post.model';
import { DataUtils } from 'app/core/util/data-util.service';
import { NewLike } from 'app/entities/like/like.model';
import { LikeService } from 'app/entities/like/service/like.service';
import { PostService } from '../service/post.service';

@Component({
  selector: 'jhi-post-detail',
  templateUrl: './post-detail.component.html',
})
export class PostDetailComponent implements OnInit {
  post: IPost | null = null;

  constructor(
    protected dataUtils: DataUtils,
    protected activatedRoute: ActivatedRoute,
    protected likeService: LikeService,
    protected postService: PostService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ post }) => {
      this.post = post;
    });
    this.findPostSocietyTag();
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  previousState(): void {
    window.history.back();
  }
  createLike(postId: number) {
    const like: NewLike = {
      id: null,
      poster: null,
      post: { id: postId },
    };

    this.likeService.createLikeForPost(like).subscribe(
      response => {
        console.log(response);
      },
      error => {
        console.log(error);
      }
    );
  }
  async findPostSocietyTag() {
    if (this.post && this.post.postAuthor) this.post.societyTag = await this.postService.getSocietyTag(this.post.postAuthor.id);
  }
}
