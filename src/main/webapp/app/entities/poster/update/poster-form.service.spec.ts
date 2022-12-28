import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../poster.test-samples';

import { PosterFormService } from './poster-form.service';

describe('Poster Form Service', () => {
  let service: PosterFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PosterFormService);
  });

  describe('Service methods', () => {
    describe('createPosterFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createPosterFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            societyTag: expect.any(Object),
            profilePicture: expect.any(Object),
            user: expect.any(Object),
            spotifyAccount: expect.any(Object),
          })
        );
      });

      it('passing IPoster should create a new form with FormGroup', () => {
        const formGroup = service.createPosterFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            societyTag: expect.any(Object),
            profilePicture: expect.any(Object),
            user: expect.any(Object),
            spotifyAccount: expect.any(Object),
          })
        );
      });
    });

    describe('getPoster', () => {
      it('should return NewPoster for default Poster initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createPosterFormGroup(sampleWithNewData);

        const poster = service.getPoster(formGroup) as any;

        expect(poster).toMatchObject(sampleWithNewData);
      });

      it('should return NewPoster for empty Poster initial value', () => {
        const formGroup = service.createPosterFormGroup();

        const poster = service.getPoster(formGroup) as any;

        expect(poster).toMatchObject({});
      });

      it('should return IPoster', () => {
        const formGroup = service.createPosterFormGroup(sampleWithRequiredData);

        const poster = service.getPoster(formGroup) as any;

        expect(poster).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IPoster should not enable id FormControl', () => {
        const formGroup = service.createPosterFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewPoster should disable id FormControl', () => {
        const formGroup = service.createPosterFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
