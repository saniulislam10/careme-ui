import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuHoverContentComponent } from './menu-hover-content.component';

describe('MenuHoverContentComponent', () => {
  let component: MenuHoverContentComponent;
  let fixture: ComponentFixture<MenuHoverContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenuHoverContentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuHoverContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
