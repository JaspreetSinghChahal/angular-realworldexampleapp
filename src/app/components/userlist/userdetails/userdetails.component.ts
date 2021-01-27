import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';
import { UtilityService } from 'src/app/services/utility.service';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-userdetails',
  templateUrl: './userdetails.component.html',
  styleUrls: ['./userdetails.component.scss', '../../../shared/scss/style.scss']
})
export class UserdetailsComponent implements OnInit {

  public userId: string;
  public refreshOnPointsReset: boolean;

  constructor(private route: ActivatedRoute,
    private userlistService: UserService,
    private alertService: AlertService,
    private utilityService: UtilityService
  ) {
  }

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id');
  }

  /**
  * Delete selected promocodes
  */
  resetPoints() {
    if (confirm("Confirm to reset points")) {
      this.userlistService.resetPoints(this.userId).subscribe(result => {
        this.showSuccessMessage("Points reset successfully");
      },
        error => {
          this.utilityService.showErrorMessage(error);
        })
    }
  }

  /**
     * Show success message
     */
  private showSuccessMessage(msg: string) {
    const dialogRef = this.alertService.openSuccessModal(msg);
    dialogRef.afterClosed().subscribe(dialogResult => {
      this.refreshOnPointsReset = true;
    });
  }
}
