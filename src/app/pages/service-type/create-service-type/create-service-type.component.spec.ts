import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateServiceTypeComponent } from './create-service-type.component';

describe('CreateServiceTypeComponent', () => {
  let component: CreateServiceTypeComponent;
  let fixture: ComponentFixture<CreateServiceTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateServiceTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateServiceTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
