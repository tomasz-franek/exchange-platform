import {ComponentFixture, TestBed} from '@angular/core/testing';

import {VersionComponent} from './version.component';
import {ApiService} from '../services/api.service';
import {provideHttpClient} from '@angular/common/http';

describe('Version', () => {
  let component: VersionComponent;
  let fixture: ComponentFixture<VersionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VersionComponent],
      providers: [ApiService, provideHttpClient()],
    })
    .compileComponents();

    fixture = TestBed.createComponent(VersionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
