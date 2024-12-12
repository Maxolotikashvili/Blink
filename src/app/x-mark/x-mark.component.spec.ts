import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XMarkComponent } from './x-mark.component';

describe('XMarkComponent', () => {
  let component: XMarkComponent;
  let fixture: ComponentFixture<XMarkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [XMarkComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(XMarkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
