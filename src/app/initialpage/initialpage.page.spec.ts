import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InitialpagePage } from './initialpage.page';

describe('InitialpagePage', () => {
  let component: InitialpagePage;
  let fixture: ComponentFixture<InitialpagePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(InitialpagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
