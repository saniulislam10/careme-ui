import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSmsGroupComponent } from './create-sms-group.component';

describe('CreateSmsGroupComponent', () => {
  let component: CreateSmsGroupComponent;
  let fixture: ComponentFixture<CreateSmsGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateSmsGroupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateSmsGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
