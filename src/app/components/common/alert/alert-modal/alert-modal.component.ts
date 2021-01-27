import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AlertType } from 'src/app/models/alert-type';
import { ModalAlertData } from 'src/app/models/model-alert';

@Component({
  selector: 'app-alert-modal',
  templateUrl: './alert-modal.component.html',
  styleUrls: ['./alert-modal.component.scss']
})
export class AlertModalComponent implements OnInit {

  public alertType: string;
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: ModalAlertData
  ) { }
  ngOnInit() {
    this.getAlertType(this.data.alertType);
  }

  getAlertType(alertType: AlertType) {
    switch (alertType) {
      case AlertType.SUCCESS:
        this.alertType = 'success';
        break;
      case AlertType.INFO:
        this.alertType = 'info';
        break;
      case AlertType.WARNING:
        this.alertType = 'warning';
        break;
      case AlertType.ERROR:
        this.alertType = 'error';
        break;
    }
  }

}