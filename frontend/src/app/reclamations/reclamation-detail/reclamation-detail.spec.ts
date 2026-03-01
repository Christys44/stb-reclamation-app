import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReclamationDetail } from './reclamation-detail';

describe('ReclamationDetail', () => {
  let component: ReclamationDetail;
  let fixture: ComponentFixture<ReclamationDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReclamationDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReclamationDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
