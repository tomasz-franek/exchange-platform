import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { FooterComponent } from './footer.component';
import {
  testComponentTranslation,
  testTranslations,
} from '../../mocks/test-functions';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterComponent, testTranslations()],
    }).compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render page in english (default)', () => {
    testComponentTranslation(fixture, 'en', '#name', 'Admin Exchange Platform');
  });

  it('should render page in proper language', () => {
    testComponentTranslation(
      fixture,
      'pl',
      '#name',
      'Administracja platformy wymiany',
    );
  });

  it('should render page in english (default)', async () => {
    component.buildInfo.set({
      branchName: 'main',
      commitHash: 'aaa',
      buildTime: 'test',
      commitTime: 'test',
      moduleName: 'main',
    });
    fixture.detectChanges();
    testComponentTranslation(
      fixture,
      'en',
      '#versionEmpty',
      'Version number : ',
    );
  });

  it('should render page in proper language', () => {
    const fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    component.buildInfo.set({
      branchName: 'main',
      commitHash: 'aaa',
      buildTime: 'test',
      commitTime: 'test',
      moduleName: 'main',
    });
    testComponentTranslation(fixture, 'pl', '#versionEmpty', 'Numer wersji : ');
  });
});
