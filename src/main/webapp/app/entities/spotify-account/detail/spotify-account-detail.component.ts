import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ISpotifyAccount } from '../spotify-account.model';

@Component({
  selector: 'jhi-spotify-account-detail',
  templateUrl: './spotify-account-detail.component.html',
})
export class SpotifyAccountDetailComponent implements OnInit {
  spotifyAccount: ISpotifyAccount | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ spotifyAccount }) => {
      this.spotifyAccount = spotifyAccount;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
