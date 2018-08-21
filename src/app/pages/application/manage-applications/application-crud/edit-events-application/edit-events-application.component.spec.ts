import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEventsApplicationComponent } from './edit-events-application.component';

describe('EditEventsApplicationComponent', () => {
  let component: EditEventsApplicationComponent;
  let fixture: ComponentFixture<EditEventsApplicationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditEventsApplicationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditEventsApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
