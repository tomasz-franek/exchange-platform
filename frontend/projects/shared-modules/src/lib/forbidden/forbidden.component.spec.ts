import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForbiddenComponent } from './forbidden.component';
import {
  testComponentTranslation,
  testTranslations,
} from '../../mocks/test-functions';

describe('ForbiddenComponent', () => {
  let component: ForbiddenComponent;
  let fixture: ComponentFixture<ForbiddenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForbiddenComponent, testTranslations()],
    }).compileComponents();

    fixture = TestBed.createComponent(ForbiddenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render page in english (default)', () => {
    testComponentTranslation(fixture, 'en', '#forbidden', '403 - Forbidden.');
  });

  it('should render page in proper language', () => {
    testComponentTranslation(
      fixture,
      'pl',
      '#forbidden',
      '403 - Brak dostępu.',
    );
  });
});
