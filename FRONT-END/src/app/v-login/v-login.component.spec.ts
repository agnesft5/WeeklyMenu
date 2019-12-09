import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VLoginComponent } from './v-login.component';

describe('VLoginComponent', () => {
  let component: VLoginComponent;
  let fixture: ComponentFixture<VLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
