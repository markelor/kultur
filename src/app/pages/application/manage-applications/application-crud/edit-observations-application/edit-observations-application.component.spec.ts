import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditObservationsApplicationComponent } from './edit-observations-application.component';

describe('EditObservationsApplicationComponent', () => {
  let component: EditObservationsApplicationComponent;
  let fixture: ComponentFixture<EditObservationsApplicationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditObservationsApplicationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditObservationsApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
