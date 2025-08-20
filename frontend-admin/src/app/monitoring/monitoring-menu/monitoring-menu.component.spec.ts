import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoringMenuComponent } from './monitoring-menu.component';
import { ActivatedRoute } from '@angular/router';
import { mockRoute } from '../../../mocks/activated-route-mock';
import { TranslateService } from '@ngx-translate/core';
import {
  checkMenuChecked,
  testTranslations,
} from '../../../mocks/test-functions';

describe('MonitoringMenuComponent', () => {
  let component: MonitoringMenuComponent;
  let fixture: ComponentFixture<MonitoringMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonitoringMenuComponent, testTranslations()],
      providers: [{ provide: ActivatedRoute, useValue: mockRoute }],
    }).compileComponents();

    fixture = TestBed.createComponent(MonitoringMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render page in english (default)', () => {
    const translateService = TestBed.inject(TranslateService);
    translateService.setDefaultLang('en');
    const fixture = TestBed.createComponent(MonitoringMenuComponent);

    fixture.detectChanges();
    const idElement: HTMLElement =
      fixture.nativeElement.querySelector('#labelNodes');
    expect(idElement.innerText).toContain('System components');
  });

  it('should render page in proper language', () => {
    const fixture = TestBed.createComponent(MonitoringMenuComponent);

    const translateService = TestBed.inject(TranslateService);
    translateService.use('pl');

    fixture.detectChanges();
    const idElement: HTMLElement =
      fixture.nativeElement.querySelector('#labelNodes');
    expect(idElement.innerText).toContain('Komponenty systemu');
  });

  [{ id: 'nodes', description: 'Nodes' }].forEach(({ id, description }) => {
    it(`should check the menu option ${description} when clicked`, () => {
      checkMenuChecked(fixture, `#${id}`);
    });
  });
});
