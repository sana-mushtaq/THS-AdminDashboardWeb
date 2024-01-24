import { Component, OnInit } from '@angular/core';
import { StatsService } from 'src/service/stats.service';
import { APIResponse } from 'src/utils/app-enum'

@Component({
  selector: 'app-daily-stats',
  templateUrl: './daily-stats.component.html',
  styleUrls: ['./daily-stats.component.css']
})
export class DailyStatsComponent implements OnInit {

  data: any = {};

  constructor(private statService: StatsService) { }

  ngOnInit(): void {

    let params = {
      "data": "data"
    };
    //now we will get a list of categories from the backend
    this.statService.dailyStats(params).subscribe({
  
      next : ( res : any ) => {

        //in case of success the api returns 0 as a status code
        if( res.status === APIResponse.Success) {

          this.data = res.data;

        } 
      },
      error: ( err: any ) => {

        console.log(err)

      }
  
    })
        
  }

}