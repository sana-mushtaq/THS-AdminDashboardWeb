import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-viewdoc',
  templateUrl: './viewdoc.component.html',
  styleUrls: ['./viewdoc.component.css']
})
export class ViewdocComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    $("#nav_patientlist").addClass('active');
  }

}
