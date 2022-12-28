import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'poster',
        data: { pageTitle: 'songSocietyApp.poster.home.title' },
        loadChildren: () => import('./poster/poster.module').then(m => m.PosterModule),
      },
      {
        path: 'profile',
        data: { pageTitle: 'songSocietyApp.profile.home.title' },
        loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule),
      },
      {
        path: 'like',
        data: { pageTitle: 'songSocietyApp.like.home.title' },
        loadChildren: () => import('./like/like.module').then(m => m.LikeModule),
      },
      {
        path: 'spotify-account',
        data: { pageTitle: 'songSocietyApp.spotifyAccount.home.title' },
        loadChildren: () => import('./spotify-account/spotify-account.module').then(m => m.SpotifyAccountModule),
      },
      {
        path: 'post',
        data: { pageTitle: 'songSocietyApp.post.home.title' },
        loadChildren: () => import('./post/post.module').then(m => m.PostModule),
      },
      {
        path: 'reply',
        data: { pageTitle: 'songSocietyApp.reply.home.title' },
        loadChildren: () => import('./reply/reply.module').then(m => m.ReplyModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
