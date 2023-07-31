import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-edit-labtechpackage',
  templateUrl: './edit-labtechpackage.component.html',
  styleUrls: ['./edit-labtechpackage.component.css']
})
export class EditLabtechpackageComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    $('#nav_nurse').addClass('active');
    $('.onlyadmin').removeClass('dclass');
  }

}
