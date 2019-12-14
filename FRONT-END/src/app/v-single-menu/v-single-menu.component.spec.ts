import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VSingleMenuComponent } from './v-single-menu.component';

describe('VSingleMenuComponent', () => {
  let component: VSingleMenuComponent;
  let fixture: ComponentFixture<VSingleMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VSingleMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VSingleMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
