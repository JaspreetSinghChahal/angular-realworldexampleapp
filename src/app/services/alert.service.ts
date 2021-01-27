import { Injectable } from '@angular/core';
import { AlertModalComponent } from '../components/common/alert/alert-modal/alert-modal.component';
import { AlertType } from '../models/alert-type';
import { MatDialog } from '@angular/material/dialog';
import { ModalAlertData } from '../models/model-alert';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(public dialog: MatDialog) { }

  getAlertType(alertType: AlertType) {
    switch (alertType) {
      case AlertType.SUCCESS:
        return 'success';
      case AlertType.INFO:
        return 'info';
      case AlertType.WARNING:
        return 'warning';
      case AlertType.ERROR:
        return 'error';
    }
  }

  openAlertModal(message: string, alertType: AlertType) {
    const dialogRef = this.dialog.open(AlertModalComponent, {
      width: '400px',
      hasBackdrop: true,
      disableClose: true,
      panelClass: this.getAlertType(alertType),
      data: new ModalAlertData({
        content: message,
        closeButtonLabel: 'OK',
        alertType: alertType
      })
    });

    return dialogRef;
  }

  openSuccessModal(message: string) {
    return this.openAlertModal(message, AlertType.SUCCESS);
  }

  openWarningModal(message: string) {
    return this.openAlertModal(message, AlertType.WARNING);
  }

  openErrorModal(message?: string) {
    return this.openAlertModal(message || "An unexpected error has occured", AlertType.ERROR);
  }
}