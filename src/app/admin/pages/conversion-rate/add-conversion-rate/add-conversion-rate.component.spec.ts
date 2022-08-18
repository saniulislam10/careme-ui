import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddConversionRateComponent } from './add-conversion-rate.component';

describe('AddConversionRateComponent', () => {
  let component: AddConversionRateComponent;
  let fixture: ComponentFixture<AddConversionRateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddConversionRateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddConversionRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
