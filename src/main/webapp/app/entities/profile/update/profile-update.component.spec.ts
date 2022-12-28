import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ProfileFormService } from './profile-form.service';
import { ProfileService } from '../service/profile.service';
import { IProfile } from '../profile.model';
import { IPoster } from 'app/entities/poster/poster.model';
import { PosterService } from 'app/entities/poster/service/poster.service';

import { ProfileUpdateComponent } from './profile-update.component';

describe('Profile Management Update Component', () => {
  let comp: ProfileUpdateComponent;
  let fixture: ComponentFixture<ProfileUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let profileFormService: ProfileFormService;
  let profileService: ProfileService;
  let posterService: PosterService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ProfileUpdateComponent],
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
      .overrideTemplate(ProfileUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ProfileUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    profileFormService = TestBed.inject(ProfileFormService);
    profileService = TestBed.inject(ProfileService);
    posterService = TestBed.inject(PosterService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call poster query and add missing value', () => {
      const profile: IProfile = { id: 456 };
      const poster: IPoster = { id: 45587 };
      profile.poster = poster;

      const posterCollection: IPoster[] = [{ id: 10875 }];
      jest.spyOn(posterService, 'query').mockReturnValue(of(new HttpResponse({ body: posterCollection })));
      const expectedCollection: IPoster[] = [poster, ...posterCollection];
      jest.spyOn(posterService, 'addPosterToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ profile });
      comp.ngOnInit();

      expect(posterService.query).toHaveBeenCalled();
      expect(posterService.addPosterToCollectionIfMissing).toHaveBeenCalledWith(posterCollection, poster);
      expect(comp.postersCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const profile: IProfile = { id: 456 };
      const poster: IPoster = { id: 43715 };
      profile.poster = poster;

      activatedRoute.data = of({ profile });
      comp.ngOnInit();

      expect(comp.postersCollection).toContain(poster);
      expect(comp.profile).toEqual(profile);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IProfile>>();
      const profile = { id: 123 };
      jest.spyOn(profileFormService, 'getProfile').mockReturnValue(profile);
      jest.spyOn(profileService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ profile });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: profile }));
      saveSubject.complete();

      // THEN
      expect(profileFormService.getProfile).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(profileService.update).toHaveBeenCalledWith(expect.objectContaining(profile));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IProfile>>();
      const profile = { id: 123 };
      jest.spyOn(profileFormService, 'getProfile').mockReturnValue({ id: null });
      jest.spyOn(profileService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ profile: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: profile }));
      saveSubject.complete();

      // THEN
      expect(profileFormService.getProfile).toHaveBeenCalled();
      expect(profileService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IProfile>>();
      const profile = { id: 123 };
      jest.spyOn(profileService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ profile });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(profileService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('comparePoster', () => {
      it('Should forward to posterService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(posterService, 'comparePoster');
        comp.comparePoster(entity, entity2);
        expect(posterService.comparePoster).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
