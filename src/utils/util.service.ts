import { Injectable } from '@angular/core';
// import { MatSnackBar } from '@angular/material/snack-bar';
import {
  MatSnackBar,
  MatSnackBarConfig,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar'
import { AlertType, MaxFileSize } from './app-constants';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor(
    public snackBar: MatSnackBar
  ) { }

  static checkMaxFileSize(files, maxFileSizeType) {
    var maxFileSize = 2000000;
    if (maxFileSizeType == MaxFileSize.FIVEMB) {
      maxFileSize = 5000000;
    }

    for (let i = 0; i < files.length; i++) {
      if (files[i].size > maxFileSize) {
        return false;
      }
    }
    return true;
  }

  static time24hourTo12Hours(time24) {
    if(time24 == null || time24 == '') {
      return "00:00"
    }
    var ts = time24;
    var H = +ts.substr(0, 2);
    var h = (H % 12) || 12;
    var hour = (h < 10)?("0"+h):h;  // leading 0 at the left for 1 digit hours
    var ampm = H < 12 ? " AM" : " PM";
    ts = hour + ts.substr(2, 3) + ampm;
    return ts;
  };


  showAlert(alertType: AlertType, message: string) {
    let alertString = ''

    let horizontalPosition: MatSnackBarHorizontalPosition = 'right';
    let verticalPosition: MatSnackBarVerticalPosition = 'top';

    if (alertType == AlertType.Error) {
      alertString = 'error';
    } else if (alertType == AlertType.Success) {
      alertString = 'success';
    } else {
      alertString = 'warning';
    }

    this.snackBar.open(message, 'x', {
      duration: 5000,
      panelClass: [alertString],
      horizontalPosition: horizontalPosition,
      verticalPosition: verticalPosition,
    });
  }
}
