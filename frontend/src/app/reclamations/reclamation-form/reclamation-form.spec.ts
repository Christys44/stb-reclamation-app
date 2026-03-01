import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReclamationForm } from './reclamation-form';

describe('ReclamationForm', () => {
  let component: ReclamationForm;
  let fixture: ComponentFixture<ReclamationForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReclamationForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReclamationForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
