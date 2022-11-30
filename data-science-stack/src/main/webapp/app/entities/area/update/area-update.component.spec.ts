import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { AreaFormService } from './area-form.service';
import { AreaService } from '../service/area.service';
import { IArea } from '../area.model';
import { ITask } from 'app/entities/task/task.model';
import { TaskService } from 'app/entities/task/service/task.service';
import { IScientist } from 'app/entities/scientist/scientist.model';
import { ScientistService } from 'app/entities/scientist/service/scientist.service';

import { AreaUpdateComponent } from './area-update.component';

describe('Area Management Update Component', () => {
  let comp: AreaUpdateComponent;
  let fixture: ComponentFixture<AreaUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let areaFormService: AreaFormService;
  let areaService: AreaService;
  let taskService: TaskService;
  let scientistService: ScientistService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [AreaUpdateComponent],
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
      .overrideTemplate(AreaUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AreaUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    areaFormService = TestBed.inject(AreaFormService);
    areaService = TestBed.inject(AreaService);
    taskService = TestBed.inject(TaskService);
    scientistService = TestBed.inject(ScientistService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Task query and add missing value', () => {
      const area: IArea = { id: 456 };
      const tasks: ITask[] = [{ id: 4858 }];
      area.tasks = tasks;

      const taskCollection: ITask[] = [{ id: 40888 }];
      jest.spyOn(taskService, 'query').mockReturnValue(of(new HttpResponse({ body: taskCollection })));
      const additionalTasks = [...tasks];
      const expectedCollection: ITask[] = [...additionalTasks, ...taskCollection];
      jest.spyOn(taskService, 'addTaskToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ area });
      comp.ngOnInit();

      expect(taskService.query).toHaveBeenCalled();
      expect(taskService.addTaskToCollectionIfMissing).toHaveBeenCalledWith(
        taskCollection,
        ...additionalTasks.map(expect.objectContaining)
      );
      expect(comp.tasksSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Scientist query and add missing value', () => {
      const area: IArea = { id: 456 };
      const scientist: IScientist = { id: 93225 };
      area.scientist = scientist;

      const scientistCollection: IScientist[] = [{ id: 5512 }];
      jest.spyOn(scientistService, 'query').mockReturnValue(of(new HttpResponse({ body: scientistCollection })));
      const additionalScientists = [scientist];
      const expectedCollection: IScientist[] = [...additionalScientists, ...scientistCollection];
      jest.spyOn(scientistService, 'addScientistToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ area });
      comp.ngOnInit();

      expect(scientistService.query).toHaveBeenCalled();
      expect(scientistService.addScientistToCollectionIfMissing).toHaveBeenCalledWith(
        scientistCollection,
        ...additionalScientists.map(expect.objectContaining)
      );
      expect(comp.scientistsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const area: IArea = { id: 456 };
      const task: ITask = { id: 78898 };
      area.tasks = [task];
      const scientist: IScientist = { id: 56227 };
      area.scientist = scientist;

      activatedRoute.data = of({ area });
      comp.ngOnInit();

      expect(comp.tasksSharedCollection).toContain(task);
      expect(comp.scientistsSharedCollection).toContain(scientist);
      expect(comp.area).toEqual(area);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IArea>>();
      const area = { id: 123 };
      jest.spyOn(areaFormService, 'getArea').mockReturnValue(area);
      jest.spyOn(areaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ area });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: area }));
      saveSubject.complete();

      // THEN
      expect(areaFormService.getArea).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(areaService.update).toHaveBeenCalledWith(expect.objectContaining(area));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IArea>>();
      const area = { id: 123 };
      jest.spyOn(areaFormService, 'getArea').mockReturnValue({ id: null });
      jest.spyOn(areaService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ area: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: area }));
      saveSubject.complete();

      // THEN
      expect(areaFormService.getArea).toHaveBeenCalled();
      expect(areaService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IArea>>();
      const area = { id: 123 };
      jest.spyOn(areaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ area });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(areaService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareTask', () => {
      it('Should forward to taskService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(taskService, 'compareTask');
        comp.compareTask(entity, entity2);
        expect(taskService.compareTask).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareScientist', () => {
      it('Should forward to scientistService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(scientistService, 'compareScientist');
        comp.compareScientist(entity, entity2);
        expect(scientistService.compareScientist).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
