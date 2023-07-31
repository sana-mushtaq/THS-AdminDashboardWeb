import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-role-manager',
  templateUrl: './role-manager.component.html',
  styleUrls: ['./role-manager.component.css']
})
export class RoleManagerComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    $('#nav_role').addClass('active');
  }

}
