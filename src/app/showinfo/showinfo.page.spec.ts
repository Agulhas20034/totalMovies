import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShowinfoPage } from './showinfo.page';

describe('ShowinfoPage', () => {
  let component: ShowinfoPage;
  let fixture: ComponentFixture<ShowinfoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowinfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
