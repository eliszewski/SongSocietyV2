import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IPoster, NewPoster } from '../poster.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IPoster for edit and NewPosterFormGroupInput for create.
 */
type PosterFormGroupInput = IPoster | PartialWithRequiredKeyOf<NewPoster>;

type PosterFormDefaults = Pick<NewPoster, 'id'>;

type PosterFormGroupContent = {
  id: FormControl<IPoster['id'] | NewPoster['id']>;
  name: FormControl<IPoster['name']>;
  societyTag: FormControl<IPoster['societyTag']>;
  profilePicture: FormControl<IPoster['profilePicture']>;
  profilePictureContentType: FormControl<IPoster['profilePictureContentType']>;
  user: FormControl<IPoster['user']>;
  spotifyAccount: FormControl<IPoster['spotifyAccount']>;
};

export type PosterFormGroup = FormGroup<PosterFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class PosterFormService {
  createPosterFormGroup(poster: PosterFormGroupInput = { id: null }): PosterFormGroup {
    const posterRawValue = {
      ...this.getFormDefaults(),
      ...poster,
    };
    return new FormGroup<PosterFormGroupContent>({
      id: new FormControl(
        { value: posterRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      name: new FormControl(posterRawValue.name, {
        validators: [Validators.required],
      }),
      societyTag: new FormControl(posterRawValue.societyTag, {
        validators: [Validators.required],
      }),
      profilePicture: new FormControl(posterRawValue.profilePicture),
      profilePictureContentType: new FormControl(posterRawValue.profilePictureContentType),
      user: new FormControl(posterRawValue.user),
      spotifyAccount: new FormControl(posterRawValue.spotifyAccount),
    });
  }

  getPoster(form: PosterFormGroup): IPoster | NewPoster {
    return form.getRawValue() as IPoster | NewPoster;
  }

  resetForm(form: PosterFormGroup, poster: PosterFormGroupInput): void {
    const posterRawValue = { ...this.getFormDefaults(), ...poster };
    form.reset(
      {
        ...posterRawValue,
        id: { value: posterRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): PosterFormDefaults {
    return {
      id: null,
    };
  }
}
