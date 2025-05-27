import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarComponent } from './sidebar.component';
import { TranslateTestingModule } from 'ngx-translate-testing';
import assets_en from '../../assets/i18n/en.json';
import assets_pl from '../../assets/i18n/pl.json';
import { TranslateService } from '@ngx-translate/core';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SidebarComponent,
        TranslateTestingModule.withTranslations(
          'en',
          assets_en,
        ).withTranslations('pl', assets_pl),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should render page in english (default)', () => {
    const translateService = TestBed.inject(TranslateService);
    translateService.setDefaultLang('en');
    const fixture = TestBed.createComponent(SidebarComponent);
    fixture.detectChanges();
    const tdElement: HTMLElement =
      fixture.nativeElement.querySelector('#accounts');
    expect(tdElement.innerText).toContain('Accounts list');
  });

  it('should render page in proper language', () => {
    const fixture = TestBed.createComponent(SidebarComponent);

    const translateService = TestBed.inject(TranslateService);
    translateService.use('pl');

    fixture.detectChanges();
    const tdElement: HTMLElement =
      fixture.nativeElement.querySelector('#accounts');
    expect(tdElement.innerText).toContain('Lista kont');
  });
});
