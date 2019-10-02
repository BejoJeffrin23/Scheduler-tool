import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserEventViewComponent } from './user-event-view.component';

describe('UserEventViewComponent', () => {
  let component: UserEventViewComponent;
  let fixture: ComponentFixture<UserEventViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserEventViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserEventViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
