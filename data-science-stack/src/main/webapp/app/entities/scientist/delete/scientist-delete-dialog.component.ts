import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IScientist } from '../scientist.model';
import { ScientistService } from '../service/scientist.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './scientist-delete-dialog.component.html',
})
export class ScientistDeleteDialogComponent {
  scientist?: IScientist;

  constructor(protected scientistService: ScientistService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.scientistService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
