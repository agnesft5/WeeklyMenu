import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VDietComponent } from './v-diet.component';

describe('VDietComponent', () => {
  let component: VDietComponent;
  let fixture: ComponentFixture<VDietComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VDietComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VDietComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
