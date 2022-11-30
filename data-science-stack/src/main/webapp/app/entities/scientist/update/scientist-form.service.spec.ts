import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../scientist.test-samples';

import { ScientistFormService } from './scientist-form.service';

describe('Scientist Form Service', () => {
  let service: ScientistFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScientistFormService);
  });

  describe('Service methods', () => {
    describe('createScientistFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createScientistFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            firstName: expect.any(Object),
            lastName: expect.any(Object),
            email: expect.any(Object),
            phoneNumber: expect.any(Object),
            startDate: expect.any(Object),
            salary: expect.any(Object),
            percentage: expect.any(Object),
            department: expect.any(Object),
          })
        );
      });

      it('passing IScientist should create a new form with FormGroup', () => {
        const formGroup = service.createScientistFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            firstName: expect.any(Object),
            lastName: expect.any(Object),
            email: expect.any(Object),
            phoneNumber: expect.any(Object),
            startDate: expect.any(Object),
            salary: expect.any(Object),
            percentage: expect.any(Object),
            department: expect.any(Object),
          })
        );
      });
    });

    describe('getScientist', () => {
      it('should return NewScientist for default Scientist initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createScientistFormGroup(sampleWithNewData);

        const scientist = service.getScientist(formGroup) as any;

        expect(scientist).toMatchObject(sampleWithNewData);
      });

      it('should return NewScientist for empty Scientist initial value', () => {
        const formGroup = service.createScientistFormGroup();

        const scientist = service.getScientist(formGroup) as any;

        expect(scientist).toMatchObject({});
      });

      it('should return IScientist', () => {
        const formGroup = service.createScientistFormGroup(sampleWithRequiredData);

        const scientist = service.getScientist(formGroup) as any;

        expect(scientist).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IScientist should not enable id FormControl', () => {
        const formGroup = service.createScientistFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewScientist should disable id FormControl', () => {
        const formGroup = service.createScientistFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
