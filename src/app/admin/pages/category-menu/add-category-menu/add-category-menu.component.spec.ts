import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCategoryMenuComponent } from './add-category-menu.component';

describe('AddCategoryMenuComponent', () => {
  let component: AddCategoryMenuComponent;
  let fixture: ComponentFixture<AddCategoryMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCategoryMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCategoryMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
