import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ScientistFormService } from './scientist-form.service';
import { ScientistService } from '../service/scientist.service';
import { IScientist } from '../scientist.model';
import { IDepartment } from 'app/entities/department/department.model';
import { DepartmentService } from 'app/entities/department/service/department.service';

import { ScientistUpdateComponent } from './scientist-update.component';

describe('Scientist Management Update Component', () => {
  let comp: ScientistUpdateComponent;
  let fixture: ComponentFixture<ScientistUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let scientistFormService: ScientistFormService;
  let scientistService: ScientistService;
  let departmentService: DepartmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ScientistUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(ScientistUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ScientistUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    scientistFormService = TestBed.inject(ScientistFormService);
    scientistService = TestBed.inject(ScientistService);
    departmentService = TestBed.inject(DepartmentService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Department query and add missing value', () => {
      const scientist: IScientist = { id: 456 };
      const department: IDepartment = { id: 12647 };
      scientist.department = department;

      const departmentCollection: IDepartment[] = [{ id: 97125 }];
      jest.spyOn(departmentService, 'query').mockReturnValue(of(new HttpResponse({ body: departmentCollection })));
      const additionalDepartments = [department];
      const expectedCollection: IDepartment[] = [...additionalDepartments, ...departmentCollection];
      jest.spyOn(departmentService, 'addDepartmentToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ scientist });
      comp.ngOnInit();

      expect(departmentService.query).toHaveBeenCalled();
      expect(departmentService.addDepartmentToCollectionIfMissing).toHaveBeenCalledWith(
        departmentCollection,
        ...additionalDepartments.map(expect.objectContaining)
      );
      expect(comp.departmentsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const scientist: IScientist = { id: 456 };
      const department: IDepartment = { id: 14892 };
      scientist.department = department;

      activatedRoute.data = of({ scientist });
      comp.ngOnInit();

      expect(comp.departmentsSharedCollection).toContain(department);
      expect(comp.scientist).toEqual(scientist);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IScientist>>();
      const scientist = { id: 123 };
      jest.spyOn(scientistFormService, 'getScientist').mockReturnValue(scientist);
      jest.spyOn(scientistService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ scientist });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: scientist }));
      saveSubject.complete();

      // THEN
      expect(scientistFormService.getScientist).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(scientistService.update).toHaveBeenCalledWith(expect.objectContaining(scientist));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IScientist>>();
      const scientist = { id: 123 };
      jest.spyOn(scientistFormService, 'getScientist').mockReturnValue({ id: null });
      jest.spyOn(scientistService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ scientist: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: scientist }));
      saveSubject.complete();

      // THEN
      expect(scientistFormService.getScientist).toHaveBeenCalled();
      expect(scientistService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IScientist>>();
      const scientist = { id: 123 };
      jest.spyOn(scientistService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ scientist });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(scientistService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareDepartment', () => {
      it('Should forward to departmentService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(departmentService, 'compareDepartment');
        comp.compareDepartment(entity, entity2);
        expect(departmentService.compareDepartment).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
