import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicesAdministratorComponent } from './services-administrator.component';

describe('ServicesAdministratorComponent', () => {
  let component: ServicesAdministratorComponent;
  let fixture: ComponentFixture<ServicesAdministratorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServicesAdministratorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServicesAdministratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
