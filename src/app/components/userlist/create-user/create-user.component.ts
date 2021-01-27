import { Component, OnInit, ViewEncapsulation, ElementRef } from '@angular/core';
import { MatDialogRef } from "@angular/material/dialog";
import { FormBuilder, Validators, FormGroup, AbstractControl } from "@angular/forms";
import { UserService } from 'src/app/services/user/user.service';
import { ProgressService } from 'src/app/services/spinner/progress.service';
import { finalize } from 'rxjs/internal/operators/finalize';
import { Roles } from 'src/app/models/roles';
import { Users } from 'src/app/models/users';
import { AlertService } from 'src/app/services/alert.service';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent implements OnInit {

  userForm: FormGroup;
  allRoles: Roles[];
  showEmail: boolean;

  // convenience getter for easy access to form fields
  get data() { return this.userForm.controls; }

  constructor
    (
      private formBuilder: FormBuilder,
      private userService: UserService,
      private progressService: ProgressService,
      private elRef: ElementRef,
      private dialogRef: MatDialogRef<CreateUserComponent>,
      private alertservice: AlertService,
      private utilityService: UtilityService
    ) {
    this.setFormGroup();
  }

  ngOnInit() {
    this.getAllRoles();
  }

  /**
   * update user data 
   */
  public addUser() {
    if (!this.userForm.valid) {
      return;
    }
    let progressRef = this.progressService.showProgress(this.elRef);
    // create user object
    let user = new Users();
    user.firstName = this.data.firstName.value;
    user.lastName = this.data.lastName.value;
    user.location = this.data.location.value;
    user.otherDetails = this.data.otherDetails.value;
    user.phoneNumber = this.data.phoneNumber.value.toString();
    user.password = this.data.password.value;
    if (this.showEmail == true) {
      user.email = this.data.email.value;
    }
    let role = this.allRoles.filter(role => role.id === this.data.role.value);
    if (role != undefined && role.length > 0) {
      user.roleName = role[0].name;
    }

    this.userService.addUser(user)
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

  close() {
    this.dialogRef.close();
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
    var password = this.randomPasswordGenerator();
    this.userForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      location: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      otherDetails: [''],
      role: ['', Validators.required],
      password: [password, [Validators.required, Validators.minLength(6)]],
      email: ['', [Validators.pattern(/.+@.+\..+/), this.requiredIfValidator(() => this.showEmail)]]
    });
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
   *  Get available roles
   **/
  private getAllRoles() {
    let progressRef = this.progressService.showProgress(this.elRef);

    this.userService.allRoles()
      .pipe(
        finalize(() => this.progressService.detach(progressRef))
      ).subscribe(result => {
        this.allRoles = result;
        var userRoleId = this.allRoles.filter(role => role.name.toLowerCase() == 'user');
        this.data.role.setValue(userRoleId[0].id);
      });
  }

  /**
   * Generates 8 character password
   * This will generate three random strings from the given charsets (letter, number, either) and then scramble the result.
   */
  private randomPasswordGenerator() {
    var chars = ["ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz", "0123456789", "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"];
    var randPwd = [4, 2, 2].map(function (len, i) { return Array(len).fill(chars[i]).map(function (x) { return x[Math.floor(Math.random() * x.length)] }).join('') }).concat().join('').split('').sort(function () { return 0.5 - Math.random() }).join('');
    return randPwd;
  }

  /**
  * Show success message
  */
  private showSuccessMessage() {
    const dialogRef = this.alertservice.openSuccessModal("Record added Successfully");
    dialogRef.afterClosed().subscribe(dialogResult => {
      this.dialogRef.close();
    });
  }
}

