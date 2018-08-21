import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageObservationsComponent } from './manage-observations.component';

describe('ManageObservationsComponent', () => {
  let component: ManageObservationsComponent;
  let fixture: ComponentFixture<ManageObservationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageObservationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageObservationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
