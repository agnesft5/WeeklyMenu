import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VDetailsComponent } from './v-details.component';

describe('VDetailsComponent', () => {
  let component: VDetailsComponent;
  let fixture: ComponentFixture<VDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
