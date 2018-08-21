import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsAdministratorComponent } from './events-administrator.component';

describe('EventsAdministratorComponent', () => {
  let component: EventsAdministratorComponent;
  let fixture: ComponentFixture<EventsAdministratorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventsAdministratorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventsAdministratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
