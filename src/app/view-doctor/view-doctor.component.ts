import { Component, OnInit } from '@angular/core';
declare var $:any;
@Component({
  selector: 'app-view-doctor',
  templateUrl: './view-doctor.component.html',
  styleUrls: ['./view-doctor.component.css']
})
export class ViewDoctorComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

    $('#tab-0').css("color","#fff");
    $('#tab-0').css("background-color","#2652f3");
    $('#tab-0').css("border","1px solid #2652f3");

    $('#tab-0').click(function(){
      $('#pane-0').show();
      $('#pane-1').css("display","none");

      $('#tab-0').css("color","#fff");
      $('#tab-0').css("background-color","#2652f3");
      $('#tab-0').css("border","1px solid #2652f3");

      $('#tab-1').css("color","#909399");
      $('#tab-1').css("background-color","#fff");
      $('#tab-1').css("border","1px solid #aeb6c8");
    })
    $('#tab-1').click(function(){
      $('#pane-1').show();
      $('#pane-0').css("display","none");

      $('#tab-1').css("background-color","#2652f3");
      $('#tab-1').css("border","1px solid #2652f3");
      
      $('#tab-0').css("color","#909399");
      $('#tab-0').css("background-color","#fff");
      $('#tab-0').css("border","1px solid #aeb6c8");
    })

    $('.el-icon-close').click(function(){
      $('.el-alert--warning').hide();
    })
  }

}
