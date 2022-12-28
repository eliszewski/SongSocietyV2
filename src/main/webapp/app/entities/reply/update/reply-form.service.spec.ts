import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../reply.test-samples';

import { ReplyFormService } from './reply-form.service';

describe('Reply Form Service', () => {
  let service: ReplyFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReplyFormService);
  });

  describe('Service methods', () => {
    describe('createReplyFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createReplyFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            content: expect.any(Object),
            author: expect.any(Object),
            post: expect.any(Object),
          })
        );
      });

      it('passing IReply should create a new form with FormGroup', () => {
        const formGroup = service.createReplyFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            content: expect.any(Object),
            author: expect.any(Object),
            post: expect.any(Object),
          })
        );
      });
    });

    describe('getReply', () => {
      it('should return NewReply for default Reply initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createReplyFormGroup(sampleWithNewData);

        const reply = service.getReply(formGroup) as any;

        expect(reply).toMatchObject(sampleWithNewData);
      });

      it('should return NewReply for empty Reply initial value', () => {
        const formGroup = service.createReplyFormGroup();

        const reply = service.getReply(formGroup) as any;

        expect(reply).toMatchObject({});
      });

      it('should return IReply', () => {
        const formGroup = service.createReplyFormGroup(sampleWithRequiredData);

        const reply = service.getReply(formGroup) as any;

        expect(reply).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IReply should not enable id FormControl', () => {
        const formGroup = service.createReplyFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewReply should disable id FormControl', () => {
        const formGroup = service.createReplyFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
