import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { SpotifyAccountService } from '../service/spotify-account.service';

import { SpotifyAccountComponent } from './spotify-account.component';

describe('SpotifyAccount Management Component', () => {
  let comp: SpotifyAccountComponent;
  let fixture: ComponentFixture<SpotifyAccountComponent>;
  let service: SpotifyAccountService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'spotify-account', component: SpotifyAccountComponent }]), HttpClientTestingModule],
      declarations: [SpotifyAccountComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              })
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(SpotifyAccountComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SpotifyAccountComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(SpotifyAccountService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.spotifyAccounts?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to spotifyAccountService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getSpotifyAccountIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getSpotifyAccountIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
