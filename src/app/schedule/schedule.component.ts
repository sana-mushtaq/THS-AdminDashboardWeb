import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit {
  userRoles: any = {}

  jsonData: any;
  loaded: boolean = false;
  constructor(private http: HttpClient) { }

  ngOnInit(): void {

    this.userRoles = JSON.parse(localStorage.getItem("SessionDetails"));
    
    this.http.get('assets/userRoles.json').subscribe((data: any) => {
     
      let role = this.userRoles['role']
      this.jsonData = data[role];
      this.loaded = true;
    });


    $('.onlysetting').removeClass('dclass');
    $('.onlyadmin').removeClass('dclass');
    $('#nav_settings').addClass('active');

    $('#add_session_btn').click(function(){
      //console.log("Working");
      $('.add_session').show();
    })
    $('.close').click(function(){
      $('.add_session').hide();
    })

    $('#add_sunday').hide();
    $('#icon-cancel').click(function(){
      //console.log("Working");
      $('#add_sunday').show();
      $('#hide_sunday').hide();
    })

    $('#add_monday').hide();
    $('#icon-cancel1').click(function(){
      //console.log("Working");
      $('#add_monday').show();
      $('#hide_monday').hide();
    })

    $('#add_tuesday').hide();
    $('#icon-cancel2').click(function(){
      //console.log("Working");
      $('#add_tuesday').show();
      $('#hide_tuesday').hide();
    })

    $('#add_wednesday').hide();
    $('#icon-cancel3').click(function(){
      //console.log("Working");
      $('#add_wednesday').show();
      $('#hide_wednesday').hide();
    })

    $('#add_thursday').hide();
    $('#icon-cancel4').click(function(){
      //console.log("Working");
      $('#add_thursday').show();
      $('#hide_thursday').hide();
    })

    $('#add_friday').hide();
    $('#icon-cancel5').click(function(){
      //console.log("Working");
      $('#add_friday').show();
      $('#hide_friday').hide();
    })

    $('#add_saturday').hide();
    $('#icon-cancel6').click(function(){
      //console.log("Working");
      $('#add_saturday').show();
      $('#hide_saturday').hide();
    })

    $('.save').click(function(){
      $('#add_session').hide();
    })
    
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.drawPage();
    }, 500)
  }

  drawPage() {
    $('#nav_settings').addClass('active');
  }

}
