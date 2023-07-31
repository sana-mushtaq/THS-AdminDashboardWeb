import { Component, OnInit } from "@angular/core";
import { AppService } from "src/service/app.service";
import { AlertType, APIResponse } from "src/utils/app-constants";
import { Router } from "@angular/router";
import { UtilService } from "src/service/util.service";
import Swal from "sweetalert2";
declare let $: any;

const UserRole = {
  SuperAdmin: 1,
  OrgAdmin: 2,
  Employee: 3,
};

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  constructor(private _appService: AppService, private router: Router, private appUtil: UtilService) {}
  ngOnInit(): void {}

  loginClicked() {
    var username = $("#username").val();
    var password = $("#password").val();
    this.performUserLogin(username, password);
  }

  performUserLogin(userName: string, password: string) {
    this._appService.userLogin(userName, password).subscribe(
      (response: any) => {
        if (response.status == APIResponse.Success) {
          const jsonData = JSON.stringify(response);
          localStorage.setItem("SessionDetails", jsonData);
          if (response.accessLevel == UserRole.SuperAdmin) {
            this.router.navigate(["/dashboard"]);
          } else {
            this.router.navigate(["/labdashboard"]);
          }
        } else {
          Swal.fire("Error.", "Invalid credentials. Please try again..!", "error");
        }
      },
      (err) => {
        debugger;
        Swal.fire("Error.", "Something went wrong. Please try again later..!", "error");
      }
    );
  }
}
