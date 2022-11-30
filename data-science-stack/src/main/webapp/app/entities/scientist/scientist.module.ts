import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ScientistComponent } from './list/scientist.component';
import { ScientistDetailComponent } from './detail/scientist-detail.component';
import { ScientistUpdateComponent } from './update/scientist-update.component';
import { ScientistDeleteDialogComponent } from './delete/scientist-delete-dialog.component';
import { ScientistRoutingModule } from './route/scientist-routing.module';

@NgModule({
  imports: [SharedModule, ScientistRoutingModule],
  declarations: [ScientistComponent, ScientistDetailComponent, ScientistUpdateComponent, ScientistDeleteDialogComponent],
})
export class ScientistModule {}
