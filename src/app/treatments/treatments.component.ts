import { Component, OnInit } from '@angular/core';
declare var $: any;

@Component({
  selector: 'app-treatments',
  templateUrl: './treatments.component.html',
  styleUrls: ['./treatments.component.css']
})
export class TreatmentsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    $('#nav_department').addClass('active');

    $('#example').DataTable();

  }

}
