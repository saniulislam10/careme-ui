import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderSingleProductDetailsComponent } from './order-single-product-details.component';

describe('OrderSingleProductDetailsComponent', () => {
  let component: OrderSingleProductDetailsComponent;
  let fixture: ComponentFixture<OrderSingleProductDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderSingleProductDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderSingleProductDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
