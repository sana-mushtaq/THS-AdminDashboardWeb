import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-scheduled',
  templateUrl: './scheduled.component.html',
  styleUrls: ['./scheduled.component.css']
})
export class ScheduledComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

    $('#myBtn').click(function(){
      //console.log("Working");
      $('#myModal').show();
    })
    $('.close').click(function(){
      $('#myModal').hide();
    })
    var acc = document.getElementsByClassName("accordion");
    var i;

    for (i = 0; i < acc.length; i++) {
      acc[i].addEventListener("click", function() {
        this.classList.toggle("actives");
        var panel = this.nextElementSibling;
        if (panel.style.maxHeight) {
          panel.style.maxHeight = null;
        } else {
          panel.style.maxHeight = panel.scrollHeight + "px";
        } 
      });
    }

  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.drawPage();
    }, 500)
  }

  drawPage() {
    $('#nav_settings').addClass('active');
  }

}
