import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ReplyFormService } from './reply-form.service';
import { ReplyService } from '../service/reply.service';
import { IReply } from '../reply.model';
import { IPoster } from 'app/entities/poster/poster.model';
import { PosterService } from 'app/entities/poster/service/poster.service';
import { IPost } from 'app/entities/post/post.model';
import { PostService } from 'app/entities/post/service/post.service';

import { ReplyUpdateComponent } from './reply-update.component';

describe('Reply Management Update Component', () => {
  let comp: ReplyUpdateComponent;
  let fixture: ComponentFixture<ReplyUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let replyFormService: ReplyFormService;
  let replyService: ReplyService;
  let posterService: PosterService;
  let postService: PostService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ReplyUpdateComponent],
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
      .overrideTemplate(ReplyUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ReplyUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    replyFormService = TestBed.inject(ReplyFormService);
    replyService = TestBed.inject(ReplyService);
    posterService = TestBed.inject(PosterService);
    postService = TestBed.inject(PostService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Poster query and add missing value', () => {
      const reply: IReply = { id: 456 };
      const author: IPoster = { id: 80626 };
      reply.author = author;

      const posterCollection: IPoster[] = [{ id: 88451 }];
      jest.spyOn(posterService, 'query').mockReturnValue(of(new HttpResponse({ body: posterCollection })));
      const additionalPosters = [author];
      const expectedCollection: IPoster[] = [...additionalPosters, ...posterCollection];
      jest.spyOn(posterService, 'addPosterToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ reply });
      comp.ngOnInit();

      expect(posterService.query).toHaveBeenCalled();
      expect(posterService.addPosterToCollectionIfMissing).toHaveBeenCalledWith(
        posterCollection,
        ...additionalPosters.map(expect.objectContaining)
      );
      expect(comp.postersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Post query and add missing value', () => {
      const reply: IReply = { id: 456 };
      const post: IPost = { id: 63629 };
      reply.post = post;

      const postCollection: IPost[] = [{ id: 70044 }];
      jest.spyOn(postService, 'query').mockReturnValue(of(new HttpResponse({ body: postCollection })));
      const additionalPosts = [post];
      const expectedCollection: IPost[] = [...additionalPosts, ...postCollection];
      jest.spyOn(postService, 'addPostToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ reply });
      comp.ngOnInit();

      expect(postService.query).toHaveBeenCalled();
      expect(postService.addPostToCollectionIfMissing).toHaveBeenCalledWith(
        postCollection,
        ...additionalPosts.map(expect.objectContaining)
      );
      expect(comp.postsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const reply: IReply = { id: 456 };
      const author: IPoster = { id: 94449 };
      reply.author = author;
      const post: IPost = { id: 52803 };
      reply.post = post;

      activatedRoute.data = of({ reply });
      comp.ngOnInit();

      expect(comp.postersSharedCollection).toContain(author);
      expect(comp.postsSharedCollection).toContain(post);
      expect(comp.reply).toEqual(reply);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IReply>>();
      const reply = { id: 123 };
      jest.spyOn(replyFormService, 'getReply').mockReturnValue(reply);
      jest.spyOn(replyService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ reply });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: reply }));
      saveSubject.complete();

      // THEN
      expect(replyFormService.getReply).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(replyService.update).toHaveBeenCalledWith(expect.objectContaining(reply));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IReply>>();
      const reply = { id: 123 };
      jest.spyOn(replyFormService, 'getReply').mockReturnValue({ id: null });
      jest.spyOn(replyService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ reply: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: reply }));
      saveSubject.complete();

      // THEN
      expect(replyFormService.getReply).toHaveBeenCalled();
      expect(replyService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IReply>>();
      const reply = { id: 123 };
      jest.spyOn(replyService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ reply });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(replyService.update).toHaveBeenCalled();
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

    describe('comparePost', () => {
      it('Should forward to postService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(postService, 'comparePost');
        comp.comparePost(entity, entity2);
        expect(postService.comparePost).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
