import { Component, OnInit } from '@angular/core';
declare var $: any;

@Component({
  selector: 'app-rateandreview',
  templateUrl: './rateandreview.component.html',
  styleUrls: ['./rateandreview.component.css']
})
export class RateandreviewComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    $('#tab-Rating').click(function(){
      //console.log('working');
      $('.el-tabs__item.is-top').removeClass('is-active');
      $(this).addClass('is-active');
      $('#pane-Rating').show();

      $('#pane-User').css("display","none");
    })
    $('#tab-User').click(function(){
      $('.el-tabs__item.is-top').removeClass('is-active');
      $(this).addClass('is-active');
      $('#pane-User').show();
      $('#pane-Rating').css("display","none");
    })

    $('#example').DataTable();
  }

}
