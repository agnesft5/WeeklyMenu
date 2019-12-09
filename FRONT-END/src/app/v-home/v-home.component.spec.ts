import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VHomeComponent } from './v-home.component';

describe('VHomeComponent', () => {
  let component: VHomeComponent;
  let fixture: ComponentFixture<VHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
