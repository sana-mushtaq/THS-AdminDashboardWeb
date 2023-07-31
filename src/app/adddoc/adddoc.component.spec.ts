import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdddocComponent } from './adddoc.component';

describe('AdddocComponent', () => {
  let component: AdddocComponent;
  let fixture: ComponentFixture<AdddocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdddocComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdddocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
