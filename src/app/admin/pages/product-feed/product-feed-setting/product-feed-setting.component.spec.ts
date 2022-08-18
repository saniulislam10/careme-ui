import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductFeedSettingComponent } from './product-feed-setting.component';

describe('ProductFeedSettingComponent', () => {
  let component: ProductFeedSettingComponent;
  let fixture: ComponentFixture<ProductFeedSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductFeedSettingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductFeedSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
