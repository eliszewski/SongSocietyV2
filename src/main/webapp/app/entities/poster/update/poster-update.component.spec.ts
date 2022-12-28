import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { PosterFormService } from './poster-form.service';
import { PosterService } from '../service/poster.service';
import { IPoster } from '../poster.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { ISpotifyAccount } from 'app/entities/spotify-account/spotify-account.model';
import { SpotifyAccountService } from 'app/entities/spotify-account/service/spotify-account.service';

import { PosterUpdateComponent } from './poster-update.component';

describe('Poster Management Update Component', () => {
  let comp: PosterUpdateComponent;
  let fixture: ComponentFixture<PosterUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let posterFormService: PosterFormService;
  let posterService: PosterService;
  let userService: UserService;
  let spotifyAccountService: SpotifyAccountService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [PosterUpdateComponent],
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
      .overrideTemplate(PosterUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PosterUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    posterFormService = TestBed.inject(PosterFormService);
    posterService = TestBed.inject(PosterService);
    userService = TestBed.inject(UserService);
    spotifyAccountService = TestBed.inject(SpotifyAccountService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const poster: IPoster = { id: 456 };
      const user: IUser = { id: 62030 };
      poster.user = user;

      const userCollection: IUser[] = [{ id: 83093 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ poster });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(expect.objectContaining)
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call spotifyAccount query and add missing value', () => {
      const poster: IPoster = { id: 456 };
      const spotifyAccount: ISpotifyAccount = { id: 91932 };
      poster.spotifyAccount = spotifyAccount;

      const spotifyAccountCollection: ISpotifyAccount[] = [{ id: 70489 }];
      jest.spyOn(spotifyAccountService, 'query').mockReturnValue(of(new HttpResponse({ body: spotifyAccountCollection })));
      const expectedCollection: ISpotifyAccount[] = [spotifyAccount, ...spotifyAccountCollection];
      jest.spyOn(spotifyAccountService, 'addSpotifyAccountToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ poster });
      comp.ngOnInit();

      expect(spotifyAccountService.query).toHaveBeenCalled();
      expect(spotifyAccountService.addSpotifyAccountToCollectionIfMissing).toHaveBeenCalledWith(spotifyAccountCollection, spotifyAccount);
      expect(comp.spotifyAccountsCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const poster: IPoster = { id: 456 };
      const user: IUser = { id: 35369 };
      poster.user = user;
      const spotifyAccount: ISpotifyAccount = { id: 47349 };
      poster.spotifyAccount = spotifyAccount;

      activatedRoute.data = of({ poster });
      comp.ngOnInit();

      expect(comp.usersSharedCollection).toContain(user);
      expect(comp.spotifyAccountsCollection).toContain(spotifyAccount);
      expect(comp.poster).toEqual(poster);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPoster>>();
      const poster = { id: 123 };
      jest.spyOn(posterFormService, 'getPoster').mockReturnValue(poster);
      jest.spyOn(posterService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ poster });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: poster }));
      saveSubject.complete();

      // THEN
      expect(posterFormService.getPoster).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(posterService.update).toHaveBeenCalledWith(expect.objectContaining(poster));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPoster>>();
      const poster = { id: 123 };
      jest.spyOn(posterFormService, 'getPoster').mockReturnValue({ id: null });
      jest.spyOn(posterService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ poster: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: poster }));
      saveSubject.complete();

      // THEN
      expect(posterFormService.getPoster).toHaveBeenCalled();
      expect(posterService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPoster>>();
      const poster = { id: 123 };
      jest.spyOn(posterService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ poster });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(posterService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareUser', () => {
      it('Should forward to userService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(userService, 'compareUser');
        comp.compareUser(entity, entity2);
        expect(userService.compareUser).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareSpotifyAccount', () => {
      it('Should forward to spotifyAccountService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(spotifyAccountService, 'compareSpotifyAccount');
        comp.compareSpotifyAccount(entity, entity2);
        expect(spotifyAccountService.compareSpotifyAccount).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
