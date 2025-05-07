import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MovieinfoPage } from './movieinfo.page';

describe('MovieinfoPage', () => {
  let component: MovieinfoPage;
  let fixture: ComponentFixture<MovieinfoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MovieinfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
