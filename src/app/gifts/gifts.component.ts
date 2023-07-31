import { Component, OnInit } from '@angular/core';
declare var $: any;
@Component({
  selector: 'app-gifts',
  templateUrl: './gifts.component.html',
  styleUrls: ['./gifts.component.css']
})
export class GiftsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

    $('.onlygift').removeClass('dclass');
    $('.onlyadmin').removeClass('dclass');
    $('.active-gifts').addClass('active');


    $('.nav-link').click(function() {
        $('.nav-link').removeClass('active');
        $(this).addClass('active');
    })
    $('#active_card_call').click(function() {
        $('.in_ac_cards').hide();  
        $('.gif_active_card_space').show();  
    })
    $('#inactive_card_call').click(function() {
        $('.in_ac_cards').hide();  
        $('.gif_inactive_card_space').show();  
    })
    $("#files_department").on('change', function (e) {
      $('.pip').html('');
      var files = e.target.files;
      var file = files[0]
      var fileReader = new FileReader();
      fileReader.onload = function (e) {
        var file = e.target;
        $('<span class="pip">' + '<img class="imageThumb" src="' + e.target.result + '" />' + '<br/><span class="remove">Remove image</span>' + "</span>"
        ).insertAfter("#beforefilepreview");
        $(".remove").click(function () {
          $(this).parent(".pip").remove();
        });
      };
      fileReader.readAsDataURL(file);
    });
     $('#example thead tr')
            .clone(true)
            .addClass('filters')
            .appendTo('#example thead');


        var filterIndexes = [0, 1, 2, 3, 4, 5, 6];

        var table = $('#accounts-table').DataTable({
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

}
