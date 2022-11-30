import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ScientistDetailComponent } from './scientist-detail.component';

describe('Scientist Management Detail Component', () => {
  let comp: ScientistDetailComponent;
  let fixture: ComponentFixture<ScientistDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ScientistDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ scientist: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ScientistDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ScientistDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load scientist on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.scientist).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
