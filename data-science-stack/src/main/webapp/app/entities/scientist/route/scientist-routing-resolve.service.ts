import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IScientist } from '../scientist.model';
import { ScientistService } from '../service/scientist.service';

@Injectable({ providedIn: 'root' })
export class ScientistRoutingResolveService implements Resolve<IScientist | null> {
  constructor(protected service: ScientistService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IScientist | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((scientist: HttpResponse<IScientist>) => {
          if (scientist.body) {
            return of(scientist.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
