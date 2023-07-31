import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-view-bill',
  templateUrl: './view-bill.component.html',
  styleUrls: ['./view-bill.component.css']
})
export class ViewBillComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    $('#nav_bill').addClass('active');
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.drawPage();
    }, 500)
  }

  drawPage() {
    $('#nav_bill').addClass('active');
  }

}
