import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-accountant',
  templateUrl: './add-accountant.component.html',
  styleUrls: ['./add-accountant.component.css']
})
export class AddAccountantComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    $('#nav_users').addClass('active');
    $('.onlyadmin').removeClass('dclass');
  }

}
