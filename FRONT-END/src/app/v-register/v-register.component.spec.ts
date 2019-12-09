import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VRegisterComponent } from './v-register.component';

describe('VRegisterComponent', () => {
  let component: VRegisterComponent;
  let fixture: ComponentFixture<VRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VRegisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
