import { Component, OnInit, ElementRef } from '@angular/core';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { PromocodesService } from 'src/app/services/promocodes/promocodes.service';
import { ProgressService } from 'src/app/services/spinner/progress.service';
import { finalize } from 'rxjs/operators';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-promotion-info',
  templateUrl: './promotion-info.component.html',
  styleUrls: ['./promotion-info.component.scss', '../../../shared/scss/style.scss']
})
export class PromotionInfoComponent implements OnInit {

  isUploading: boolean = false;
  fileName: string = "No file selected";
  acceptedTypes = "image/*"
  imageUrl: string | ArrayBuffer;
  file: File
  fileUploaded: boolean;

  constructor(
    private dashboardService: DashboardService,
    private progressService: ProgressService,
    private elRef: ElementRef,
    private alertservice: AlertService
  ) { }

  ngOnInit(): void {
    this.getPromotionMessage();
  }

  filesChanged(files?: FileList): void {
    if (files) {
      this.file = <File>files[0];
      this.fileName = this.file.name;
      this.preview(this.file);
      this.fileUploaded = true;
    }
    else {
      this.fileUploaded = false;
    }
  }


  preview(file: File) {
    // Show preview 
    var mimeType = this.file.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }

    var reader = new FileReader();
    reader.readAsDataURL(this.file);
    reader.onload = (_event) => {
      this.imageUrl = reader.result;
    }
  }

  uploadFiles(): void {
    if (this.imageUrl) {
      var promotionMessage = this.imageUrl.toString();
      let progressRef = this.progressService.showProgress(this.elRef);
      this.dashboardService.savePromotionMessage(promotionMessage, this.fileName).pipe(
        finalize(() => this.progressService.detach(progressRef))
      ).subscribe(result => {
        this.showSuccessMessage();
        this.fileUploaded = false;
      });
    }
  }

  getPromotionMessage(): void {
    let progressRef = this.progressService.showProgress(this.elRef);
    this.dashboardService.promotionMessage().pipe(
      finalize(() => this.progressService.detach(progressRef))
    ).subscribe(result => {
      this.imageUrl = result.promotionText;
      this.fileName = result.promotionFileName;
    });
  }



  /**
  * Show success message
  */
  private showSuccessMessage() {
    const dialogRef = this.alertservice.openSuccessModal("Record updated Successfully");
    dialogRef.afterClosed().subscribe(dialogResult => {
    });
  }
}
