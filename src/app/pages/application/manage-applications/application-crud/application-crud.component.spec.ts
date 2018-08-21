import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationCrudComponent } from './application-crud.component';

describe('ApplicationCrudComponent', () => {
  let component: ApplicationCrudComponent;
  let fixture: ComponentFixture<ApplicationCrudComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplicationCrudComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
