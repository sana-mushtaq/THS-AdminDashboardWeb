import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-edit-nursepackage',
  templateUrl: './edit-nursepackage.component.html',
  styleUrls: ['./edit-nursepackage.component.css']
})
export class EditNursepackageComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    $('#nav_nurse').addClass('active');
    $('.onlyadmin').removeClass('dclass');
  }

}
