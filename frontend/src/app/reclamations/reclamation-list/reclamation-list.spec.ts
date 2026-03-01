import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReclamationList } from './reclamation-list';

describe('ReclamationList', () => {
  let component: ReclamationList;
  let fixture: ComponentFixture<ReclamationList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReclamationList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReclamationList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
