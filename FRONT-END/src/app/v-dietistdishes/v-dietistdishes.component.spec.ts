import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VDietistdishesComponent } from './v-dietistdishes.component';

describe('VDietistdishesComponent', () => {
  let component: VDietistdishesComponent;
  let fixture: ComponentFixture<VDietistdishesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VDietistdishesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VDietistdishesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
