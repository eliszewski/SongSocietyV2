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
  selector: 'jhi-post',
  templateUrl: './post.component.html',
})
export class PostComponent implements OnInit {
  posts?: IPost[];
  isLoading = false;
  predicate = 'id';
  ascending = true;
  itemsPerPage = ITEMS_PER_PAGE;
  links: { [key: string]: number } = {
    last: 0,
  };
  page = 1;

  constructor(
    protected postService: PostService,
    protected activatedRoute: ActivatedRoute,
    public router: Router,
    protected parseLinks: ParseLinks,
    protected dataUtils: DataUtils,
    protected modalService: NgbModal,
    private http: HttpClient,
    protected sanitizer: DomSanitizer
  ) {}

  reset(): void {
    this.page = 1;
    this.posts = [];
    this.load();
  }

  loadPage(page: number): void {
    this.page = page;
    this.load();
  }

  trackId = (_index: number, item: IPost): number => this.postService.getPostIdentifier(item);

  ngOnInit(): void {
    //  // Get the list of posts from the API
    //  this.postService.query().subscribe((res: any) => {
    //   // Store the list of posts in a local variable
    //   this.posts = res.body || [];

    //   // For each post in the list, retrieve the societyTag value and store it in the societyTag field
    //   if(this.posts)
    //   this.posts.forEach(async (post) => {
    //     if (post.postAuthor && post.postAuthor.id) {
    //       post.societyTag = await this.getSocietyTag(post.postAuthor.id);
    //     }
    //   });
    // });
    this.load();
  }
  // getPostAuthorSocietyTag(posterId: number): Observable<Object> {
  //   let tag = this.http.get(`/api/posters/${posterId}`, { responseType: 'json' });
  //   console.log(tag.);
  //   return tag;
  //

  // async getSocietyTag(posterId: number): Promise<string> {
  //   return await this.postService.getSocietyTag(posterId);
  // }
  // getSocietyTag(id: number): string {
  //   return this.societyTags[id] || '';
  // }

  // async getSocietyTag(id: number): Promise<string> {
  //   if (!this.societyTags[id]) {
  //     this.societyTags[id] = await this.postService.getSocietyTag(id);
  //   }
  //   return this.societyTags[id];
  // }
  async getSocietyTag(posterId: number): Promise<string> {
    try {
      // Make a GET request to the API endpoint to retrieve the poster object for the given poster ID
      const response = await this.http.get<any>(`/api/posters/${posterId}`).toPromise();
      // Return the societyTag value from the response
      return response.societyTag;
    } catch (error) {
      console.error(error);
      return '';
    }
  }

  populateSocietyTags(posts: IPost[]): void {
    posts.forEach(async post => {
      if (post.postAuthor && post.postAuthor.id) {
        post.societyTag = await this.getSocietyTag(post.postAuthor.id);
      }
    });
  }

  getContentAsHtml(content: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(content);
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    return this.dataUtils.openFile(base64String, contentType);
  }

  delete(post: IPost): void {
    const modalRef = this.modalService.open(PostDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.post = post;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed
      .pipe(
        filter(reason => reason === ITEM_DELETED_EVENT),
        switchMap(() => this.loadFromBackendWithRouteInformations())
      )
      .subscribe({
        next: (res: EntityArrayResponseType) => {
          this.onResponseSuccess(res);
        },
      });
  }

  load(): void {
    this.loadFromBackendWithRouteInformations().subscribe({
      next: (res: EntityArrayResponseType) => {
        this.onResponseSuccess(res);
      },
    });
  }

  navigateToWithComponentValues(): void {
    this.handleNavigation(this.page, this.predicate, this.ascending);
  }

  navigateToPage(page = this.page): void {
    this.handleNavigation(page, this.predicate, this.ascending);
  }

  protected loadFromBackendWithRouteInformations(): Observable<EntityArrayResponseType> {
    return combineLatest([this.activatedRoute.queryParamMap, this.activatedRoute.data]).pipe(
      tap(([params, data]) => this.fillComponentAttributeFromRoute(params, data)),
      switchMap(() => this.queryBackend(this.page, this.predicate, this.ascending))
    );
  }

  protected fillComponentAttributeFromRoute(params: ParamMap, data: Data): void {
    const sort = (params.get(SORT) ?? data[DEFAULT_SORT_DATA]).split(',');
    this.predicate = sort[0];
    this.ascending = sort[1] === ASC;
  }

  protected onResponseSuccess(response: EntityArrayResponseType): void {
    this.fillComponentAttributesFromResponseHeader(response.headers);
    const dataFromBody = this.fillComponentAttributesFromResponseBody(response.body);
    this.posts = dataFromBody;
    this.populateSocietyTags(this.posts);
  }

  protected fillComponentAttributesFromResponseBody(data: IPost[] | null): IPost[] {
    const postsNew = this.posts ?? [];
    if (data) {
      for (const d of data) {
        if (postsNew.map(op => op.id).indexOf(d.id) === -1) {
          postsNew.push(d);
        }
      }
    }
    return postsNew;
  }

  protected fillComponentAttributesFromResponseHeader(headers: HttpHeaders): void {
    const linkHeader = headers.get('link');
    if (linkHeader) {
      this.links = this.parseLinks.parse(linkHeader);
    } else {
      this.links = {
        last: 0,
      };
    }
  }

  protected queryBackend(page?: number, predicate?: string, ascending?: boolean): Observable<EntityArrayResponseType> {
    this.isLoading = true;
    const pageToLoad: number = page ?? 1;
    const queryObject = {
      page: pageToLoad - 1,
      size: this.itemsPerPage,
      sort: this.getSortQueryParam(predicate, ascending),
    };
    return this.postService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
  }

  protected handleNavigation(page = this.page, predicate?: string, ascending?: boolean): void {
    const queryParamsObj = {
      page,
      size: this.itemsPerPage,
      sort: this.getSortQueryParam(predicate, ascending),
    };

    this.router.navigate(['./'], {
      relativeTo: this.activatedRoute,
      queryParams: queryParamsObj,
    });
  }

  protected getSortQueryParam(predicate = this.predicate, ascending = this.ascending): string[] {
    const ascendingQueryParam = ascending ? ASC : DESC;
    if (predicate === '') {
      return [];
    } else {
      return [predicate + ',' + ascendingQueryParam];
    }
  }
}
