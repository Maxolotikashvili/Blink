import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SigninModalComponent } from './signin-modal.component';

describe('SigninModalComponent', () => {
  let component: SigninModalComponent;
  let fixture: ComponentFixture<SigninModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SigninModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SigninModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
