import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ScientistComponent } from '../list/scientist.component';
import { ScientistDetailComponent } from '../detail/scientist-detail.component';
import { ScientistUpdateComponent } from '../update/scientist-update.component';
import { ScientistRoutingResolveService } from './scientist-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const scientistRoute: Routes = [
  {
    path: '',
    component: ScientistComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ScientistDetailComponent,
    resolve: {
      scientist: ScientistRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ScientistUpdateComponent,
    resolve: {
      scientist: ScientistRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ScientistUpdateComponent,
    resolve: {
      scientist: ScientistRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(scientistRoute)],
  exports: [RouterModule],
})
export class ScientistRoutingModule {}
