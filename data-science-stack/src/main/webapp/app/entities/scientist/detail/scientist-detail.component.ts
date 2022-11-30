import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IScientist } from '../scientist.model';

@Component({
  selector: 'jhi-scientist-detail',
  templateUrl: './scientist-detail.component.html',
})
export class ScientistDetailComponent implements OnInit {
  scientist: IScientist | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ scientist }) => {
      this.scientist = scientist;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
