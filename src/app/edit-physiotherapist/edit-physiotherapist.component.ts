import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-edit-physiotherapist',
  templateUrl: './edit-physiotherapist.component.html',
  styleUrls: ['./edit-physiotherapist.component.css']
})
export class EditPhysiotherapistComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    $('.onlyadmin').removeClass('dclass');
    $('#tab-basic').css("color","#fff");
    $('#tab-basic').css("background-color","#2652f3");
    $('#tab-basic').css("border","1px solid #2652f3");

    $('#tab-basic').click(function(){
      $('#pane-basic').show();
      $('#pane-schedule').css("display","none");
      
      $('#tab-basic').css("color","#fff");
      $('#tab-basic').css("background-color","#2652f3");
      $('#tab-basic').css("border","1px solid #2652f3");

      $('#tab-schedule').css("color","#909399");
      $('#tab-schedule').css("background-color","#fff");
      $('#tab-schedule').css("border","1px solid #aeb6c8");

    })
    $('#tab-schedule').click(function(){
      $('#pane-schedule').show();
      $('#pane-basic').css("display","none");

      $('#tab-schedule').css("color","#fff");
      $('#tab-schedule').css("background-color","#2652f3");
      $('#tab-schedule').css("border","1px solid #2652f3");

      $('#tab-basic').css("color","#909399");
      $('#tab-basic').css("background-color","#fff");
      $('#tab-basic').css("border","1px solid #aeb6c8");
    })

    $('.add_session_btn').click(function(){
      //console.log("Working");
      $('.add_session').show();
    })
    $('.close').click(function(){
      $('.add_session').hide();
    })
  }

}
