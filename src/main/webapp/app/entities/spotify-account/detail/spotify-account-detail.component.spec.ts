import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { SpotifyAccountDetailComponent } from './spotify-account-detail.component';

describe('SpotifyAccount Management Detail Component', () => {
  let comp: SpotifyAccountDetailComponent;
  let fixture: ComponentFixture<SpotifyAccountDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SpotifyAccountDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ spotifyAccount: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(SpotifyAccountDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(SpotifyAccountDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load spotifyAccount on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.spotifyAccount).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
