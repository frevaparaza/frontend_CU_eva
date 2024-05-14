import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateChatDlgComponent } from './create-chat-dlg.component';

describe('CreateChatDlgComponent', () => {
  let component: CreateChatDlgComponent;
  let fixture: ComponentFixture<CreateChatDlgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateChatDlgComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateChatDlgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
