import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog-ui',
  imports: [CommonModule],
  templateUrl: './confirm-dialog.ui.html',
  styleUrl: './confirm-dialog.ui.css',
})
export class ConfirmDialogUi {
  title = 'Confirm';
  message = 'Are you sure?';
  confirmText = 'Yes';
  cancelText = 'No';
  severity = 'brand';

  close!: (result: boolean) => void;
}
