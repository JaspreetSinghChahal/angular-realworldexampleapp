import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { UserService } from 'src/app/services/user/user.service';
import { Users } from 'src/app/models/users';
import { finalize } from 'rxjs/internal/operators/finalize';
import { ProgressService } from '../../../services/spinner/progress.service';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { Roles } from 'src/app/models/roles';
import { AlertService } from 'src/app/services/alert.service';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss', '../../../shared/scss/style.scss']
})
export class UserInfoComponent implements OnInit {
  @Input()
  public userId: string;

  public userInfoForm: FormGroup;
  public userInfo: Users;
  public allRoles: Roles[];
  public userRole: string;
  public isEditable: boolean;
  public showEmail: boolean

  // convenience getter for easy access to form fields
  get data() { return this.userInfoForm.controls; }

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private progressService: ProgressService,
    private elRef: ElementRef,
    private alertservice: AlertService,
    private utilityService: UtilityService
  ) {
    this.setFormGroup();
  }

  ngOnInit(): void {
    this.getUserInfo(this.userId);
  }


  /**
   * Get details of a user
   * @param userId 
   */
  private getUserInfo(userId: string) {
    let progressRef = this.progressService.showProgress(this.elRef);

    // User data
    let userData = this.userService.userInfo(this.userId);
    // All role list
    let roles = this.userService.allRoles();

    forkJoin([userData, roles])
      .pipe(
        finalize(() => this.progressService.detach(progressRef))
      ).subscribe(results => {
        this.userInfo = results[0];
        this.allRoles = results[1];
        this.setFormData();
      });
  }

  /**
   *  Make fields ediable on edit button click
  */
  public edit() {
    this.isEditable = true;
  }

  /**
   * update user data 
   */
  public updateUser() {
    if (!this.userInfoForm.valid) {
      return;
    }
    let progressRef = this.progressService.showProgress(this.elRef);
    // create user object
    let user = new Users();
    user.id = this.userId;
    user.firstName = this.data.firstName.value;
    user.lastName = this.data.lastName.value;
    user.displayPassword = this.data.displayPassword.value;
    user.location = this.data.location.value;
    user.otherDetails = this.data.otherDetails.value;
    user.phoneNumber = this.data.phoneNumber.value;
    if (this.showEmail == true) {
      user.email = this.data.email.value;
    }
    let role = this.allRoles.filter(role => role.id === this.data.role.value);
    if (role != undefined && role.length > 0) {
      user.roleName = role[0].name;
    }


    this.userService.updateUser(user)
      .pipe(
        finalize(() => this.progressService.detach(progressRef))
      )
      .subscribe(
        response => {
          this.showSuccessMessage();
        },
        error => {
          this.utilityService.showErrorMessage(error);
        });
  }

  public cancel() {
    this.isEditable = false;
    this.userInfoForm.reset();
    this.setFormData();
  }


  public roleChange(obj) {
    this.checkIfEmailRequired(obj.value);
  }

  private checkIfEmailRequired(selectedRoleId) {
    let role = this.allRoles.filter(role => role.id === selectedRoleId);
    if (role != undefined && role.length > 0 && role[0].name.toLowerCase() == 'admin') {
      this.showEmail = true;
    } else {
      this.showEmail = false;
    }
    this.data.email.setValue('');
    this.data.email.updateValueAndValidity();
  }

  /**
   * To create user form and add validations
   */
  private setFormGroup() {
    this.userInfoForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      location: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      displayPassword: ['', Validators.required],
      otherDetails: [''],
      role: ['', Validators.required],
      email: ['', [Validators.pattern(/.+@.+\..+/), this.requiredIfValidator(() => this.showEmail)]]
    });
  }

  private setFormData() {
    // Get user role name
    let userRoles = this.allRoles.filter(role => role.name === this.userInfo.roleName);
    if (userRoles != undefined && userRoles.length > 0) {
      this.userRole = userRoles[0].name;
      this.checkIfEmailRequired(userRoles[0].id);
    }
    this.userInfoForm.setValue({ firstName: this.userInfo.firstName, lastName: this.userInfo.lastName, location: this.userInfo.location, otherDetails: this.userInfo.otherDetails, phoneNumber: this.userInfo.phoneNumber, displayPassword: this.userInfo.displayPassword, role: userRoles[0].id, email: this.userInfo.email });
  }

  /**
 * makes the field required if the predicate function returns true
 */
  private requiredIfValidator(predicate) {
    return (formControl => {
      if (!formControl.parent) {
        return null;
      }
      if (predicate()) {
        return Validators.required(formControl);
      }
      return null;
    })
  }

  /**
   * Show success message
   */
  private showSuccessMessage() {
    const dialogRef = this.alertservice.openSuccessModal("Record Updated Successfully");
    dialogRef.afterClosed().subscribe(dialogResult => {
      this.isEditable = false;
      this.getUserInfo(this.userId);
    });
  }

}
