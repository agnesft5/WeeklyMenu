import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VAddDishComponent } from './v-add-dish.component';

describe('VAddDishComponent', () => {
  let component: VAddDishComponent;
  let fixture: ComponentFixture<VAddDishComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VAddDishComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VAddDishComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
