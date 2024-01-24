import { Component, OnInit, OnDestroy } from '@angular/core';
import { StatsService } from 'src/service/stats.service';
import { APIResponse } from 'src/utils/app-enum';

@Component({
  selector: 'app-daily-stats',
  templateUrl: './daily-stats.component.html',
  styleUrls: ['./daily-stats.component.css']
})
export class DailyStatsComponent implements OnInit, OnDestroy {

  data: any = {recordCount:0, upcomingCount: 0, completedCount: 0, cancelledCount:0};
  private intervalId: any;

  constructor(private statService: StatsService) { }

  ngOnInit(): void {
    // Initial call to fetch data
    this.fetchData();

    // Set up a recurring call every 10 seconds
    this.intervalId = setInterval(() => {
      this.fetchData();
    }, 10000);
  }

  ngOnDestroy(): void {
    // Clear the interval to prevent memory leaks
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  private fetchData() {
    let params = {
      "data": "data"
    };

    this.statService.dailyStats(params).subscribe({
      next: (res: any) => {
        if (res.status === APIResponse.Success) {
          this.data = res.data;
        }
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }
}
