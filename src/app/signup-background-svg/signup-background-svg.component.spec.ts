import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupBackgroundSvgComponent } from './signup-background-svg.component';

describe('SignupBackgroundSvgComponent', () => {
  let component: SignupBackgroundSvgComponent;
  let fixture: ComponentFixture<SignupBackgroundSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignupBackgroundSvgComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignupBackgroundSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
