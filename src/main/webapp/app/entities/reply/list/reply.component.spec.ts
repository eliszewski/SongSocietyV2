import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ReplyService } from '../service/reply.service';

import { ReplyComponent } from './reply.component';

describe('Reply Management Component', () => {
  let comp: ReplyComponent;
  let fixture: ComponentFixture<ReplyComponent>;
  let service: ReplyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'reply', component: ReplyComponent }]), HttpClientTestingModule],
      declarations: [ReplyComponent],
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
      .overrideTemplate(ReplyComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ReplyComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ReplyService);

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
    expect(comp.replies?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to replyService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getReplyIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getReplyIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
