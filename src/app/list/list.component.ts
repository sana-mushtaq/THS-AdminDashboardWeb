import { Component, OnInit } from '@angular/core';
declare var $: any;

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    $('#nav_role').addClass('active');

    $('#example').DataTable();
  }

}
