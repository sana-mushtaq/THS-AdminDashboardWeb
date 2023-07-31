import { Injectable, NgZone } from "@angular/core";
import { AlertType, APIResponse, AppConstants, MaxFileSize } from "../utils/app-constants";
import { HttpHeaders, HttpClient, HttpParams } from "@angular/common/http";
import { MatSnackBar, MatSnackBarConfig, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from "@angular/material/snack-bar";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class UtilService {
  public appTagsSubject: BehaviorSubject<any>;
  public appTags: Observable<any>;

  public appCitiesSubject: BehaviorSubject<any>;
  public appCities: Observable<any>;

  constructor(public snackBar: MatSnackBar, private zone: NgZone) {
    this.appTagsSubject = new BehaviorSubject<any>(null);
    this.appTags = this.appTagsSubject.asObservable();

    this.appCitiesSubject = new BehaviorSubject<any>(null);
    this.appCities = this.appCitiesSubject.asObservable();
  }

  showAlert(alertType: AlertType, message: string) {
    let alertString = "";

    let horizontalPosition: MatSnackBarHorizontalPosition = "right";
    let verticalPosition: MatSnackBarVerticalPosition = "top";

    if (alertType == AlertType.Error) {
      alertString = "error";
    } else if (alertType == AlertType.Success) {
      alertString = "success";
    } else {
      alertString = "warning";
    }

    debugger;

    const config = new MatSnackBarConfig();
    config.panelClass = ["background-red"];
    config.verticalPosition = "bottom";
    config.horizontalPosition = "center";
    this.zone.run(() => {
      this.snackBar.open(message, "x", config);
    });
  }

  static checkMaxFileSize(files, maxFileSizeType) {
    debugger;
    var maxFileSize = 2000000;
    if (maxFileSizeType == MaxFileSize.FIVEMB) {
      maxFileSize = 5000000;
    } else if (maxFileSizeType == MaxFileSize.TWENTYMB) {
      maxFileSize = 20000000;
    }
    for (let i = 0; i < files.length; i++) {
      if (files[i].size > maxFileSize) {
        return false;
      }
    }
    return true;
  }

  static formatSizeUnits(bytes) {
    if (bytes >= 1073741824) {
      bytes = (bytes / 1073741824).toFixed(2) + " GB";
    } else if (bytes >= 1048576) {
      bytes = (bytes / 1048576).toFixed(2) + " MB";
    } else if (bytes >= 1024) {
      bytes = (bytes / 1024).toFixed(2) + " KB";
    } else if (bytes > 1) {
      bytes = bytes + " bytes";
    } else if (bytes == 1) {
      bytes = bytes + " byte";
    } else {
      bytes = "0 bytes";
    }
    return bytes;
  }

  showAlertMessage(alertType: AlertType, alertMessage: string) {
    this.showAlert(alertType, alertMessage);
  }

  // static checkMaxFileSize(files, maxFileSizeType) {
  //   var maxFileSize = 2000000;
  //   if (maxFileSizeType == MaxFileSize.FIVEMB) {
  //     maxFileSize = 5000000;
  //   }

  //   for (let i = 0; i < files.length; i++) {
  //     if (files[i].size > maxFileSize) {
  //       return false;
  //     }
  //   }
  //   return true;
  // }
}
