import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationsAdministratorComponent } from './applications-administrator.component';

describe('ApplicationsAdministratorComponent', () => {
  let component: ApplicationsAdministratorComponent;
  let fixture: ComponentFixture<ApplicationsAdministratorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplicationsAdministratorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationsAdministratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
