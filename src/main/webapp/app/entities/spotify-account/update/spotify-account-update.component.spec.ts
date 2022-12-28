import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { SpotifyAccountFormService } from './spotify-account-form.service';
import { SpotifyAccountService } from '../service/spotify-account.service';
import { ISpotifyAccount } from '../spotify-account.model';

import { SpotifyAccountUpdateComponent } from './spotify-account-update.component';

describe('SpotifyAccount Management Update Component', () => {
  let comp: SpotifyAccountUpdateComponent;
  let fixture: ComponentFixture<SpotifyAccountUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let spotifyAccountFormService: SpotifyAccountFormService;
  let spotifyAccountService: SpotifyAccountService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [SpotifyAccountUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(SpotifyAccountUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SpotifyAccountUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    spotifyAccountFormService = TestBed.inject(SpotifyAccountFormService);
    spotifyAccountService = TestBed.inject(SpotifyAccountService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const spotifyAccount: ISpotifyAccount = { id: 456 };

      activatedRoute.data = of({ spotifyAccount });
      comp.ngOnInit();

      expect(comp.spotifyAccount).toEqual(spotifyAccount);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISpotifyAccount>>();
      const spotifyAccount = { id: 123 };
      jest.spyOn(spotifyAccountFormService, 'getSpotifyAccount').mockReturnValue(spotifyAccount);
      jest.spyOn(spotifyAccountService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ spotifyAccount });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: spotifyAccount }));
      saveSubject.complete();

      // THEN
      expect(spotifyAccountFormService.getSpotifyAccount).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(spotifyAccountService.update).toHaveBeenCalledWith(expect.objectContaining(spotifyAccount));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISpotifyAccount>>();
      const spotifyAccount = { id: 123 };
      jest.spyOn(spotifyAccountFormService, 'getSpotifyAccount').mockReturnValue({ id: null });
      jest.spyOn(spotifyAccountService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ spotifyAccount: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: spotifyAccount }));
      saveSubject.complete();

      // THEN
      expect(spotifyAccountFormService.getSpotifyAccount).toHaveBeenCalled();
      expect(spotifyAccountService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISpotifyAccount>>();
      const spotifyAccount = { id: 123 };
      jest.spyOn(spotifyAccountService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ spotifyAccount });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(spotifyAccountService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
