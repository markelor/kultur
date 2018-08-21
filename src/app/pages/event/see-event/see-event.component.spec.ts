import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeeEventComponent } from './see-event.component';

describe('SeeEventComponent', () => {
  let component: SeeEventComponent;
  let fixture: ComponentFixture<SeeEventComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeeEventComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeeEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
