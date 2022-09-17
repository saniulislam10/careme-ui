import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyReturnComponent } from './my-return.component';

describe('MyReturnComponent', () => {
  let component: MyReturnComponent;
  let fixture: ComponentFixture<MyReturnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyReturnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyReturnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
