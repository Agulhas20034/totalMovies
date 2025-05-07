import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchpagePage } from './searchpage.page';

describe('SearchpagePage', () => {
  let component: SearchpagePage;
  let fixture: ComponentFixture<SearchpagePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchpagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
