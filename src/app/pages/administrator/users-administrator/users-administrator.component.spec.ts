import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersAdministratorComponent } from './users-administrator.component';

describe('UsersAdministratorComponent', () => {
  let component: UsersAdministratorComponent;
  let fixture: ComponentFixture<UsersAdministratorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersAdministratorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersAdministratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
