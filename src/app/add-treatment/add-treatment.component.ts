import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-treatment',
  templateUrl: './add-treatment.component.html',
  styleUrls: ['./add-treatment.component.css']
})
export class AddTreatmentComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    $('.onlyadmin').removeClass('dclass');
  }

}
