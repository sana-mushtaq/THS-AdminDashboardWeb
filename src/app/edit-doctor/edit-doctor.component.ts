import { Component, OnInit } from '@angular/core';
declare var $: any;
@Component({
  selector: 'app-edit-doctor',
  templateUrl: './edit-doctor.component.html',
  styleUrls: ['./edit-doctor.component.css']
})
export class EditDoctorComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    $('.onlyadmin').removeClass('dclass');
    $('.add_session_btn').click(function(){
      //console.log("Working");
      $('.add_session').show();
    })
    $('.close').click(function(){
      $('.add_session').hide();
    })
    $('#tab-basic').click(function(){
      $('#pane-basic').show();
      $('#pane-schedule').css("display","none");
    })
    $('#tab-schedule').click(function(){
      $('#pane-schedule').show();
      $('#pane-basic').css("display","none");
    })
    $('.el-icon-close').click(function(){
      $('.el-alert--warning').hide();
    })
  }

}
