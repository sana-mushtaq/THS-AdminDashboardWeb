import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-edit-role',
  templateUrl: './edit-role.component.html',
  styleUrls: ['./edit-role.component.css']
})
export class EditRoleComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    $('#nav_role').addClass('active');
    
    $('.el-icon-close').click(function(){
      //console.log("Working");
      $('.el-alert--warning').hide();
    })
  }

}
