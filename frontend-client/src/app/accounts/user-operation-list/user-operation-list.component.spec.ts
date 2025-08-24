import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserOperationListComponent } from './user-operation-list.component';
import { provideMockStore } from '@ngrx/store/testing';
import { initialAccountState } from '../state/account.reducers';
import { TranslateTestingModule } from 'ngx-translate-testing';
import assets_en from '../../../assets/i18n/en.json';
import assets_pl from '../../../assets/i18n/pl.json';
import { TranslateService } from '@ngx-translate/core';
import { testComponentTranslation } from '../../../mocks/test-functions';

describe('UserOperationListComponent', () => {
  let component: UserOperationListComponent;
  let fixture: ComponentFixture<UserOperationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        UserOperationListComponent,
        TranslateTestingModule.withTranslations(
          'en',
          assets_en,
        ).withTranslations('pl', assets_pl),
      ],
      providers: [provideMockStore({ initialState: initialAccountState })],
    }).compileComponents();

    fixture = TestBed.createComponent(UserOperationListComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render page in english (default)', () => {
    testComponentTranslation(fixture, 'en', '#amount', 'Amount');
  });

  it('should render page in proper language', () => {
    testComponentTranslation(fixture, 'pl', '#amount', 'Ilość');
  });
});
