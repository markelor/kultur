import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObservationsAdministratorComponent } from './observations-administrator.component';

describe('ObservationsAdministratorComponent', () => {
  let component: ObservationsAdministratorComponent;
  let fixture: ComponentFixture<ObservationsAdministratorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObservationsAdministratorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObservationsAdministratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
