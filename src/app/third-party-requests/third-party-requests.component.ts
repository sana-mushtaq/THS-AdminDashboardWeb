import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MirthService } from 'src/service/mirth.service';
import Swal from "sweetalert2";
declare var $: any;

@Component({
  selector: 'app-third-party-requests',
  templateUrl: './third-party-requests.component.html',
  styleUrls: ['./third-party-requests.component.css']
})
export class ThirdPartyRequestsComponent implements OnInit {

  constructor( private mirthServices : MirthService, private router : Router ) { }

  ngOnInit() {
    $(".onlyadmin").removeClass("dclass");
    $('.onlyservicerequests').show();
    $(".nav-link").click(function () {
      $(".nav-link").removeClass("active");
      $(this).addClass("active");
    });
    $(".dropdown-check-list").hover(function () {
      $("#items").toggle();
    });

    //this.getAllRequests();
    this.initTable();
  }

  getAllRequests(){
    // this.mirthServices.getAllRequest().subscribe({
    //   next : ( res : any ) => { console.log(res.requests) },
    //   error: ( err : any ) => { Swal.fire('Error', err.error.message, 'error' ); }
    // });
  }

  initTable(){
    const $this = this;
    var table = $("#request_table").DataTable({
      "pageLength": 10,
      "language": {
        "zeroRecords": "",
        "infoEmpty": "No records available"
      },
      autoWidth: false , 
      "aaSorting": [],
      responsive: true,
      serverSide: true,
      processing: true,
      searchDelay: 1000,
      ajax : function ( data : any, callback : any, settings : any) {
        var api = new $.fn.dataTable.Api(settings);
        const params : any = {
          pageNumber: api.page(),     // <---- get page number
          pageSize: api.page.len(),   //<--- get page length
          search : data.search.value, //<--- get search value
        }

        $this.mirthServices.getAllRequest( params ).subscribe({
          next : ( res : any ) => { 
            callback({
              data: res.requests,
              recordsTotal: res.totalCount,
              recordsFiltered: res.requests.length
            });
          },
          error: ( err : any ) => { Swal.fire('Error', err.error.message, 'error' ); }
        });
      },
      "columnDefs": [ 
        { "targets": 0, "orderable": false },
        { "targets": 1, "orderable": false },
        { "targets": 2, "orderable": false },
        { "targets": 3, "orderable": false },
        { "targets": 4, "orderable": false },
        { "targets": 5, "orderable": false },
        { "targets": 6, "orderable": false },
        { "targets": 7, "orderable": false },
        { "targets": 8, "orderable": false },
        { "targets": 9, "orderable": false } 
      ],
      columns: [
        { title: 'Request ID', "data": "requestNoBupa" },
        { title: 'Booking Date & Time', "data": function ( row : any, type: any, val: any, meta: any ) {
            return row.visitDate+' '+row.visitTime;
          }
        },
        { title: 'Patient Name', "data": "name" },
        { title: 'Mobile', "data": "mobileNumber" },
        { title: 'Preferred Language', "data": "preferredLanguage" },
        { title: 'Technician Gender', "data": function ( row : any, type: any, val: any, meta: any ) {
            if( row.technicianGender == 0 ){
              return 'Male';
            }
            else if( row.technicianGender == 1 ){
              return 'Female';
            }
            else{
              return 'Any'
            }
          }
        },
        { title: 'Membership', "data": function ( row : any, type: any, val: any, meta: any ) {
            return row.membershipType+' (#'+row.membershipNumber+')';
          }
        },
        { title: 'Priority', "data": function ( row : any, type: any, val: any, meta: any ) {
            if( row.priorityQueue == 0 ){
              return '<span class="badge badge-danger">High</span>';
            }
            else if( row.priorityQueue == 1 ){
              return '<span class="badge badge-warning">Medium</span>';
            }
            else{
              return '<span class="badge badge-info">Low</span>'
            }
          }
        },
        { title: 'Is Updated', "data": function ( row : any, type: any, val: any, meta: any ) {
            if( row.updateRequest == 0 ){
              return '-';
            }else{
              return '<span class="badge badge-danger">Updated</span>'
            }
          }
        },
        { title: 'Last Updated', "data": function ( row : any, type: any, val: any, meta: any ) {
            return new Date(row.lastUpdateRequest).toDateString();
          }
        },
      ],

    });

    table.on('click', 'tbody tr', function () {
      let data = table.row(this).data();
      $this.router.navigate(['/third-party-requests/'+data.requestNoBupa]);
    });
  }

}
