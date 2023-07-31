import { Component, OnInit } from '@angular/core';
declare var $: any;

@Component({
  selector: 'app-doclist',
  templateUrl: './doclist.component.html',
  styleUrls: ['./doclist.component.css']
})
export class DoclistComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

    $('.onlypatient').removeClass('dclass');
    $('.onlyadmin').removeClass('dclass');

    $('#nav_patientlist').addClass('active');

    $('#el-table__expanded-cell').hide();
    $('#expanded').click(function () {
      //console.log("Working");
      $('#el-table__expanded-cell').toggle();
    })

    // $('#example').DataTable();

    // $('#example').DataTable();
    $('#docTable thead tr')
      .clone(true)
      .addClass('filters')
      .appendTo('#docTable thead');


    var filterIndexes = [0, 1, 2, 3, 4, 5, 6];

    var table = $('#docTable').DataTable({
      orderCellsTop: true,
      fixedHeader: true,
      initComplete: function () {
        var api = this.api();

        // For each column
        api
          .columns()
          .eq(0)
          .each(function (colIdx) {

            if ($.inArray(colIdx, filterIndexes) != -1) {
              // Set the header cell to contain the input element
              var cell = $('.filters th').eq(
                $(api.column(colIdx).header()).index()
              );
              var title = $(cell).text();
              $(cell).html('<input type="search" class="form-control form-control-sm" placeholder="" />');

              // On every keypress in this input
              $(
                'input',
                $('.filters th').eq($(api.column(colIdx).header()).index())
              )
                .off('keyup change')
                .on('keyup change', function (e) {
                  e.stopPropagation();

                  // Get the search value
                  $(this).attr('title', $(this).val());
                  var regexr = '({search})'; //$(this).parents('th').find('select').val();

                  var cursorPosition = this.selectionStart;
                  // Search the column for that value
                  api
                    .column(colIdx)
                    .search(
                      this.value != ''
                        ? regexr.replace('{search}', '(((' + this.value + ')))')
                        : '',
                      this.value != '',
                      this.value == ''
                    )
                    .draw();

                  $(this)
                    .focus()[0]
                    .setSelectionRange(cursorPosition, cursorPosition);
                });

            }
            else {
              var cell = $('.filters th').eq(
                $(api.column(colIdx).header()).index()
              );
              var title = $(cell).text();
              $(cell).html('<input type="hidden" />');
            }
          });
      },
    });

  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.drawPage();
    }, 5000)
  }

  drawPage() {
    $('#nav_patientlist').addClass('active');
  }

}
