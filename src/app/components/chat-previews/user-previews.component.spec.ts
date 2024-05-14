import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPreviewsComponent } from './user-previews.component';

describe('UserPreviewsComponent', () => {
  let component: UserPreviewsComponent;
  let fixture: ComponentFixture<UserPreviewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserPreviewsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserPreviewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
