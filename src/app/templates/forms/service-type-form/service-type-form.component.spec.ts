import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceTypeFormComponent } from './service-type-form.component';

describe('ServiceTypeFormComponent', () => {
  let component: ServiceTypeFormComponent;
  let fixture: ComponentFixture<ServiceTypeFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceTypeFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceTypeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
