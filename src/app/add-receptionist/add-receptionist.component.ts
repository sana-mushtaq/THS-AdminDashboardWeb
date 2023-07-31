import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-receptionist',
  templateUrl: './add-receptionist.component.html',
  styleUrls: ['./add-receptionist.component.css']
})
export class AddReceptionistComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    $('#nav_users').addClass('active');
    $('.onlyadmin').removeClass('dclass');
  }

}
