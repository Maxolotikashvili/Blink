import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatTextAreaComponent } from './chat-text-area.component';

describe('ChatTextAreaComponent', () => {
  let component: ChatTextAreaComponent;
  let fixture: ComponentFixture<ChatTextAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatTextAreaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatTextAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
