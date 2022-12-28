import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPoster } from '../poster.model';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-poster-detail',
  templateUrl: './poster-detail.component.html',
})
export class PosterDetailComponent implements OnInit {
  poster: IPoster | null = null;

  constructor(protected dataUtils: DataUtils, protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ poster }) => {
      this.poster = poster;
    });
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
}
