import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { AreaFormService, AreaFormGroup } from './area-form.service';
import { IArea } from '../area.model';
import { AreaService } from '../service/area.service';
import { ITask } from 'app/entities/task/task.model';
import { TaskService } from 'app/entities/task/service/task.service';
import { IScientist } from 'app/entities/scientist/scientist.model';
import { ScientistService } from 'app/entities/scientist/service/scientist.service';

@Component({
  selector: 'jhi-area-update',
  templateUrl: './area-update.component.html',
})
export class AreaUpdateComponent implements OnInit {
  isSaving = false;
  area: IArea | null = null;

  tasksSharedCollection: ITask[] = [];
  scientistsSharedCollection: IScientist[] = [];

  editForm: AreaFormGroup = this.areaFormService.createAreaFormGroup();

  constructor(
    protected areaService: AreaService,
    protected areaFormService: AreaFormService,
    protected taskService: TaskService,
    protected scientistService: ScientistService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareTask = (o1: ITask | null, o2: ITask | null): boolean => this.taskService.compareTask(o1, o2);

  compareScientist = (o1: IScientist | null, o2: IScientist | null): boolean => this.scientistService.compareScientist(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ area }) => {
      this.area = area;
      if (area) {
        this.updateForm(area);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const area = this.areaFormService.getArea(this.editForm);
    if (area.id !== null) {
      this.subscribeToSaveResponse(this.areaService.update(area));
    } else {
      this.subscribeToSaveResponse(this.areaService.create(area));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IArea>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(area: IArea): void {
    this.area = area;
    this.areaFormService.resetForm(this.editForm, area);

    this.tasksSharedCollection = this.taskService.addTaskToCollectionIfMissing<ITask>(this.tasksSharedCollection, ...(area.tasks ?? []));
    this.scientistsSharedCollection = this.scientistService.addScientistToCollectionIfMissing<IScientist>(
      this.scientistsSharedCollection,
      area.scientist
    );
  }

  protected loadRelationshipsOptions(): void {
    this.taskService
      .query()
      .pipe(map((res: HttpResponse<ITask[]>) => res.body ?? []))
      .pipe(map((tasks: ITask[]) => this.taskService.addTaskToCollectionIfMissing<ITask>(tasks, ...(this.area?.tasks ?? []))))
      .subscribe((tasks: ITask[]) => (this.tasksSharedCollection = tasks));

    this.scientistService
      .query()
      .pipe(map((res: HttpResponse<IScientist[]>) => res.body ?? []))
      .pipe(
        map((scientists: IScientist[]) =>
          this.scientistService.addScientistToCollectionIfMissing<IScientist>(scientists, this.area?.scientist)
        )
      )
      .subscribe((scientists: IScientist[]) => (this.scientistsSharedCollection = scientists));
  }
}
