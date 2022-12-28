import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IReply } from '../reply.model';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-reply-detail',
  templateUrl: './reply-detail.component.html',
})
export class ReplyDetailComponent implements OnInit {
  reply: IReply | null = null;

  constructor(protected dataUtils: DataUtils, protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ reply }) => {
      this.reply = reply;
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
