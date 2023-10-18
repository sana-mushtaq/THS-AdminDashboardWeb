import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  title = 'Taib Home Medical Care Company - Riyadh'
  
  constructor(private router: Router,) { this.getDetails()}

  sessionDetails;
  accessLevel;

  getDetails() {
    this.sessionDetails = localStorage.getItem("SessionDetails");
    var details =  JSON.parse(this.sessionDetails);
    this.accessLevel = details.accessLevel;
    this.title = details.title;
  }

  LogoutClick() {
    localStorage.setItem("SessionDetails", null);
    this.router.navigate(["/admin-login"]);
  }
  ngOnInit(): void {
    $('.el-submenu__title').click(function(){
        $('#horizontal').toggle();
    });
    if(localStorage.getItem("SessionDetails") == "null"){
      this.router.navigate(["/"]);
    }
  }

}
