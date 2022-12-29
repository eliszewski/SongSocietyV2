import { Component, OnInit } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Data, ParamMap, Router } from '@angular/router';
import { combineLatest, filter, Observable, switchMap, tap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IPost } from '../post.model';

import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { ASC, DESC, SORT, ITEM_DELETED_EVENT, DEFAULT_SORT_DATA } from 'app/config/navigation.constants';
import { EntityArrayResponseType, PostService } from '../service/post.service';
import { PostDeleteDialogComponent } from '../delete/post-delete-dialog.component';
import { DataUtils } from 'app/core/util/data-util.service';
import { ParseLinks } from 'app/core/util/parse-links.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Pipe, PipeTransform } from '@angular/core';
import { LinkyModule } from 'ngx-linky';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css'],
})
export class TwitterFeedComponent implements OnInit {
  posts?: IPost[];
  isLoading = false;

  constructor(private postService: PostService) {}

  ngOnInit() {
    this.loadPosts();
  }

  loadPosts() {
    this.isLoading = true;
    this.postService.query().subscribe(
      (res: any) => {
        this.posts = res.body;
        this.isLoading = false;
      },
      (error: any) => {
        console.error(error);
        this.isLoading = false;
      }
    );
  }
}
