import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IReply, NewReply } from '../reply.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IReply for edit and NewReplyFormGroupInput for create.
 */
type ReplyFormGroupInput = IReply | PartialWithRequiredKeyOf<NewReply>;

type ReplyFormDefaults = Pick<NewReply, 'id'>;

type ReplyFormGroupContent = {
  id: FormControl<IReply['id'] | NewReply['id']>;
  content: FormControl<IReply['content']>;
  author: FormControl<IReply['author']>;
  post: FormControl<IReply['post']>;
};

export type ReplyFormGroup = FormGroup<ReplyFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ReplyFormService {
  createReplyFormGroup(reply: ReplyFormGroupInput = { id: null }): ReplyFormGroup {
    const replyRawValue = {
      ...this.getFormDefaults(),
      ...reply,
    };
    return new FormGroup<ReplyFormGroupContent>({
      id: new FormControl(
        { value: replyRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      content: new FormControl(replyRawValue.content),
      author: new FormControl(replyRawValue.author),
      post: new FormControl(replyRawValue.post),
    });
  }

  getReply(form: ReplyFormGroup): IReply | NewReply {
    return form.getRawValue() as IReply | NewReply;
  }

  resetForm(form: ReplyFormGroup, reply: ReplyFormGroupInput): void {
    const replyRawValue = { ...this.getFormDefaults(), ...reply };
    form.reset(
      {
        ...replyRawValue,
        id: { value: replyRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ReplyFormDefaults {
    return {
      id: null,
    };
  }
}
