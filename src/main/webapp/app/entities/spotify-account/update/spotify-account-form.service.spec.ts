import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../spotify-account.test-samples';

import { SpotifyAccountFormService } from './spotify-account-form.service';

describe('SpotifyAccount Form Service', () => {
  let service: SpotifyAccountFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpotifyAccountFormService);
  });

  describe('Service methods', () => {
    describe('createSpotifyAccountFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createSpotifyAccountFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            spotifyId: expect.any(Object),
          })
        );
      });

      it('passing ISpotifyAccount should create a new form with FormGroup', () => {
        const formGroup = service.createSpotifyAccountFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            spotifyId: expect.any(Object),
          })
        );
      });
    });

    describe('getSpotifyAccount', () => {
      it('should return NewSpotifyAccount for default SpotifyAccount initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createSpotifyAccountFormGroup(sampleWithNewData);

        const spotifyAccount = service.getSpotifyAccount(formGroup) as any;

        expect(spotifyAccount).toMatchObject(sampleWithNewData);
      });

      it('should return NewSpotifyAccount for empty SpotifyAccount initial value', () => {
        const formGroup = service.createSpotifyAccountFormGroup();

        const spotifyAccount = service.getSpotifyAccount(formGroup) as any;

        expect(spotifyAccount).toMatchObject({});
      });

      it('should return ISpotifyAccount', () => {
        const formGroup = service.createSpotifyAccountFormGroup(sampleWithRequiredData);

        const spotifyAccount = service.getSpotifyAccount(formGroup) as any;

        expect(spotifyAccount).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ISpotifyAccount should not enable id FormControl', () => {
        const formGroup = service.createSpotifyAccountFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewSpotifyAccount should disable id FormControl', () => {
        const formGroup = service.createSpotifyAccountFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
