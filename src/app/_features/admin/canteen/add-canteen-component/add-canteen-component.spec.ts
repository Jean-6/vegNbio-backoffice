import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCanteenComponent } from './add-canteen-component';

describe('AddCanteenComponent', () => {
  let component: AddCanteenComponent;
  let fixture: ComponentFixture<AddCanteenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddCanteenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCanteenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
