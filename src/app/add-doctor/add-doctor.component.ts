import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-doctor',
  templateUrl: './add-doctor.component.html',
  styleUrls: ['./add-doctor.component.css']
})
export class AddDoctorComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    $('.onlyadmin').removeClass('dclass');
    $('#nav_users').addClass('active');
    $('#myBtns').click(function(){
      //console.log("Working");
      $('#myModals').show();
    })
    $('.close').click(function(){
      $('#myModals').hide();
    })
    $('.ok').click(function(){
      $('#myModals').hide();
    })
    
  }

}
