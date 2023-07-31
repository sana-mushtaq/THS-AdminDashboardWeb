import { Component, OnInit } from '@angular/core';
declare var $: any;

@Component({
  selector: 'app-tests',
  templateUrl: './tests.component.html',
  styleUrls: ['./tests.component.css']
})
export class TestsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    $('#nav_department').addClass('active');
    $('.onlyadmin').removeClass('dclass');
    $('#example').DataTable();
    
    
  }

}
