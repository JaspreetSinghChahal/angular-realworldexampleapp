import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UserlistDataSource } from './userlistDataSource';
import { UserService } from 'src/app/services/user/user.service';
import { MatPaginator } from '@angular/material/paginator';
import { tap, debounceTime, distinctUntilChanged, finalize } from 'rxjs/operators';
import { MatSort } from '@angular/material/sort';
import { fromEvent } from 'rxjs/internal/observable/fromEvent';
import { ProgressService } from '../../services/spinner/progress.service';
import { CreateUserComponent } from './create-user/create-user.component';
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { saveAs } from 'file-saver';
import { SelectionModel } from '@angular/cdk/collections';
import { Users } from 'src/app/models/users';
import { AlertService } from 'src/app/services/alert.service';
import { UtilityService } from 'src/app/services/utility.service';
import { Constants } from 'src/app/shared/interceptors/constants';

@Component({
  selector: 'app-userlist',
  templateUrl: './userlist.component.html',
  styleUrls: ['./userlist.component.scss', '../../shared/scss/style.scss']
})
export class UserlistComponent implements OnInit {

  dataSource: UserlistDataSource;
  displayedColumns = ["userName", "phoneNumber", "displayPassword", "location", "otherDetails", "isActive","termsAndConditonsAcceptedOn"];
  selection = new SelectionModel<Users>(true, []);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('input') input: ElementRef;

  constructor(private userlistService: UserService,
    private progressService: ProgressService,
    private elRef: ElementRef,
    private dialog: MatDialog,
    private alertService: AlertService,
    private utilityService: UtilityService
  ) { }

  ngOnInit() {
    this.dataSource = new UserlistDataSource(this.userlistService);
    this.subscribeToLoader();
    this.dataSource.loadUsers();
  }

  ngAfterViewInit() {
    // server-side search
    fromEvent(this.input.nativeElement, 'keyup')
      .pipe(
        debounceTime(Constants.DebounceTime),
        distinctUntilChanged(),
        tap(() => {
          this.paginator.pageIndex = 0;
          this.loadUserListPage();
        })
      )
      .subscribe();

    // reset the paginator after sorting
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    this.sort.sortChange
      .pipe(
        tap(() => this.loadUserListPage())
      ).subscribe();

  }

  paginate() {
    this.loadUserListPage();
  }

  /**
   * Get list of all users
   */
  loadUserListPage() {
    this.dataSource.loadUsers(
      this.input.nativeElement.value,
      this.sort.active,
      this.sort.direction,
      this.paginator.pageIndex,
      this.paginator.pageSize);
  }


  /**
   * Susbscribe to loader in datasource
   */
  subscribeToLoader() {
    let progressRef;
    this.dataSource.loading$.subscribe(
      show => {
        if (show == true) {
          progressRef = this.progressService.showProgress(this.elRef);
        }
        else {
          this.progressService.detach(progressRef);
        }
      });
  }

  /**
   * Open dialog box to add new user
   * Pass dialog configuration and refresh table after dialog close
   */
  addUser() {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    const dialogRef = this.dialog.open(CreateUserComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      val => this.loadUserListPage()
    );
  }


  /**
   * Download user data in excel
   */
  downloadUser() {
    let progressRef = this.progressService.showProgress(this.elRef);

    this.userlistService.downloadUser()
      .pipe(
        finalize(() => this.progressService.detach(progressRef))).subscribe(
          blob => {
            saveAs(blob, "userlist.xlsx");
          },
          error => {
            this.utilityService.showErrorMessage(error)
          });
  }

  /**
   * Download user points in excel
   */
  downloadUserReputation() {
    let progressRef = this.progressService.showProgress(this.elRef);
    this.userlistService.downloadUserReputation()
      .pipe(finalize(() => this.progressService.detach(progressRef)))
      .subscribe(
        blob => {
          saveAs(blob, "userReputation.xlsx");
        },
        error => {
          this.utilityService.showErrorMessage(error)
        });
  }

}