import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditUsersApplicationComponent } from './edit-users-application.component';

describe('EditUsersApplicationComponent', () => {
  let component: EditUsersApplicationComponent;
  let fixture: ComponentFixture<EditUsersApplicationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditUsersApplicationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditUsersApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
