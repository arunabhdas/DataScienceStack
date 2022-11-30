import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ScientistFormService, ScientistFormGroup } from './scientist-form.service';
import { IScientist } from '../scientist.model';
import { ScientistService } from '../service/scientist.service';
import { IDepartment } from 'app/entities/department/department.model';
import { DepartmentService } from 'app/entities/department/service/department.service';

@Component({
  selector: 'jhi-scientist-update',
  templateUrl: './scientist-update.component.html',
})
export class ScientistUpdateComponent implements OnInit {
  isSaving = false;
  scientist: IScientist | null = null;

  departmentsSharedCollection: IDepartment[] = [];

  editForm: ScientistFormGroup = this.scientistFormService.createScientistFormGroup();

  constructor(
    protected scientistService: ScientistService,
    protected scientistFormService: ScientistFormService,
    protected departmentService: DepartmentService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareDepartment = (o1: IDepartment | null, o2: IDepartment | null): boolean => this.departmentService.compareDepartment(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ scientist }) => {
      this.scientist = scientist;
      if (scientist) {
        this.updateForm(scientist);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const scientist = this.scientistFormService.getScientist(this.editForm);
    if (scientist.id !== null) {
      this.subscribeToSaveResponse(this.scientistService.update(scientist));
    } else {
      this.subscribeToSaveResponse(this.scientistService.create(scientist));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IScientist>>): void {
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

  protected updateForm(scientist: IScientist): void {
    this.scientist = scientist;
    this.scientistFormService.resetForm(this.editForm, scientist);

    this.departmentsSharedCollection = this.departmentService.addDepartmentToCollectionIfMissing<IDepartment>(
      this.departmentsSharedCollection,
      scientist.department
    );
  }

  protected loadRelationshipsOptions(): void {
    this.departmentService
      .query()
      .pipe(map((res: HttpResponse<IDepartment[]>) => res.body ?? []))
      .pipe(
        map((departments: IDepartment[]) =>
          this.departmentService.addDepartmentToCollectionIfMissing<IDepartment>(departments, this.scientist?.department)
        )
      )
      .subscribe((departments: IDepartment[]) => (this.departmentsSharedCollection = departments));
  }
}
