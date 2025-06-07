import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgForOf } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  AccountState,
  getUserPropertyById,
} from '../state/account/account.selectors';
import { Observable } from 'rxjs';
import {
  getUserPropertyAction,
  saveUserPropertyAction,
} from '../state/account/account.actions';
import { UserProperty } from '../api/model/userProperty';

@Component({
  selector: 'app-user-properties',
  imports: [ReactiveFormsModule, NgForOf, TranslatePipe],
  templateUrl: './user-property.component.html',
  styleUrl: './user-property.component.css',
})
export class UserPropertyComponent implements OnInit {
  protected readonly formGroup: FormGroup;
  protected readonly languages: string[] = ['PL', 'EN'];
  protected readonly timezones: string[] = ['UTC', 'BST', 'CEST'];
  private _storeAccount$: Store<AccountState> = inject(Store);
  private _userProperty: Observable<UserProperty> | null = null;

  constructor(
    formBuilder: FormBuilder,
    private route: ActivatedRoute,
  ) {
    this.formGroup = formBuilder.group({
      language: new FormControl(null, [Validators.required]),
      timezone: new FormControl(null, [Validators.required]),
    });
  }

  ngOnInit() {
    const userId = this.routerId;
    if (userId === null) {
      this.formGroup.patchValue({
        language: new FormControl(null, [Validators.required]),
        timezone: new FormControl(null, [Validators.required]),
      });
    } else {
      this._storeAccount$.dispatch(getUserPropertyAction());
      this._storeAccount$
        .select(getUserPropertyById)
        .subscribe((userProperty) => {
          this.formGroup.patchValue({
            language: new FormControl(userProperty.language, [
              Validators.required,
            ]),
            timezone: new FormControl(userProperty.timezone, [
              Validators.required,
            ]),
            userId: new FormControl(userId, [Validators.required]),
          });
        });
    }
  }

  get routerId(): string | null {
    return this.route.snapshot.paramMap.get('id');
  }

  saveUserProperty(): void {
    const userProperty = {
      language: this.formGroup.get('language')?.value,
      timezone: this.formGroup.get('timezone')?.value,
    } as UserProperty;

    this._storeAccount$.dispatch(
      saveUserPropertyAction({
        userProperty,
      }),
    );
  }
}
