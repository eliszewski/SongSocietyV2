import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { PosterService } from '../service/poster.service';

import { PosterComponent } from './poster.component';

describe('Poster Management Component', () => {
  let comp: PosterComponent;
  let fixture: ComponentFixture<PosterComponent>;
  let service: PosterService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'poster', component: PosterComponent }]), HttpClientTestingModule],
      declarations: [PosterComponent],
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
      .overrideTemplate(PosterComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PosterComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(PosterService);

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
    expect(comp.posters?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to posterService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getPosterIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getPosterIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
