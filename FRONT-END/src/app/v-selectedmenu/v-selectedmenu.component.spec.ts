import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VSelectedmenuComponent } from './v-selectedmenu.component';

describe('VSelectedmenuComponent', () => {
  let component: VSelectedmenuComponent;
  let fixture: ComponentFixture<VSelectedmenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VSelectedmenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VSelectedmenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
