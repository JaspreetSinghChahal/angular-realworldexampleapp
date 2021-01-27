import { Injectable } from '@angular/core';
import { AlertService } from './alert.service';

@Injectable({
    providedIn: 'root'
})
export class UtilityService {

    constructor(private alertservice: AlertService) { }

    public showErrorMessage(error: any) {
        if (error.status === 400 || error.status === 404) {
            let errorMessage: string;
            if (typeof (error.error === 'string')) {
                let errorobj = JSON.parse(error.error);
                errorMessage = errorobj.value;
            }
            else {
                errorMessage = error.error.value;
            }
            const dialogRef = this.alertservice.openErrorModal(errorMessage);
        }
        else {
            const dialogRef = this.alertservice.openErrorModal();
        }
    }
}