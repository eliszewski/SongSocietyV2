import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ISpotifyAccount, NewSpotifyAccount } from '../spotify-account.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ISpotifyAccount for edit and NewSpotifyAccountFormGroupInput for create.
 */
type SpotifyAccountFormGroupInput = ISpotifyAccount | PartialWithRequiredKeyOf<NewSpotifyAccount>;

type SpotifyAccountFormDefaults = Pick<NewSpotifyAccount, 'id'>;

type SpotifyAccountFormGroupContent = {
  id: FormControl<ISpotifyAccount['id'] | NewSpotifyAccount['id']>;
  spotifyId: FormControl<ISpotifyAccount['spotifyId']>;
};

export type SpotifyAccountFormGroup = FormGroup<SpotifyAccountFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class SpotifyAccountFormService {
  createSpotifyAccountFormGroup(spotifyAccount: SpotifyAccountFormGroupInput = { id: null }): SpotifyAccountFormGroup {
    const spotifyAccountRawValue = {
      ...this.getFormDefaults(),
      ...spotifyAccount,
    };
    return new FormGroup<SpotifyAccountFormGroupContent>({
      id: new FormControl(
        { value: spotifyAccountRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      spotifyId: new FormControl(spotifyAccountRawValue.spotifyId),
    });
  }

  getSpotifyAccount(form: SpotifyAccountFormGroup): ISpotifyAccount | NewSpotifyAccount {
    return form.getRawValue() as ISpotifyAccount | NewSpotifyAccount;
  }

  resetForm(form: SpotifyAccountFormGroup, spotifyAccount: SpotifyAccountFormGroupInput): void {
    const spotifyAccountRawValue = { ...this.getFormDefaults(), ...spotifyAccount };
    form.reset(
      {
        ...spotifyAccountRawValue,
        id: { value: spotifyAccountRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): SpotifyAccountFormDefaults {
    return {
      id: null,
    };
  }
}
