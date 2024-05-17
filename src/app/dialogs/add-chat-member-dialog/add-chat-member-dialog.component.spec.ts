import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddChatMemberDialogComponent } from './add-chat-member-dialog.component';

describe('AddChatMemberDialogComponent', () => {
  let component: AddChatMemberDialogComponent;
  let fixture: ComponentFixture<AddChatMemberDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddChatMemberDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddChatMemberDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
