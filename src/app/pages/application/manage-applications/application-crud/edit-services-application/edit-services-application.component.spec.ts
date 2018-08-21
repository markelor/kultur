import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditServicesApplicationComponent } from './edit-services-application.component';

describe('EditServicesApplicationComponent', () => {
  let component: EditServicesApplicationComponent;
  let fixture: ComponentFixture<EditServicesApplicationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditServicesApplicationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditServicesApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
