import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReactionsModalComponent } from './reactions-modal.component';

describe('ReactionsModalComponent', () => {
  let component: ReactionsModalComponent;
  let fixture: ComponentFixture<ReactionsModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReactionsModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReactionsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
