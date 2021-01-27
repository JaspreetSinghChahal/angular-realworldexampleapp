import { Component, OnInit, ElementRef } from '@angular/core';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { UserStatistics } from 'src/app/models/userStatistics';
import { ProgressService } from 'src/app/services/spinner/progress.service';
import { finalize } from 'rxjs/operators';
import { AlertService } from 'src/app/services/alert.service';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: 'app-user-statistics',
  templateUrl: './user-statistics.component.html',
  styleUrls: ['./user-statistics.component.scss', '../../../shared/scss/style.scss']
})
export class UserStatisticsComponent implements OnInit {

  public userStatistics: UserStatistics;

  constructor(private dashboardService: DashboardService,
    private progressService: ProgressService,
    private elRef: ElementRef,
    private alertservice: AlertService,
    private utilityService: UtilityService
  ) { }

  ngOnInit(): void {
    this.getUserStatistics();
  }

  getUserStatistics() {
    let progressRef = this.progressService.showProgress(this.elRef);

    // User data
    this.dashboardService.userStatistics().pipe(
      finalize(() => this.progressService.detach(progressRef))
    ).subscribe(result => {
      this.userStatistics = result;
    },
      error => {
        this.utilityService.showErrorMessage(error);
      }
    );
  }

}
