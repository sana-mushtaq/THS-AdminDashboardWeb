$(document).ready(function() {
    //$('#example').DataTable();
    $('#horizontal').hide();
    $('.el-submenu__title').click( function(){
        $('#horizontal').toggle(); 
    });
    
    
        if (window.File && window.FileList && window.FileReader) {
          $("#file").change(function (e) {
            alert("working");
            var files = e.target.files,
              filesLength = files.length;
            for (var i = 0; i < filesLength; i++) {
              var f = files[i];
              var fileReader = new FileReader();
              fileReader.onload = function (e) {
                var file = e.target;
                $(
                  '<span class="pip">' +
                    '<img class="imageThumb" src="' +
                    e.target.result +
                    '" title="' +
                    file.name +
                    '"/>' +
                    '<br/><span class="remove">Remove image</span>' +
                    "</span>"
                ).insertAfter("#files");
                $(".remove").click(function () {
                  $(this).parent(".pip").remove();
                });

              };
              fileReader.readAsDataURL(f);
            }
            console.log(files);
          });
        } else {
          alert("Your browser doesn't support to File API");
        }
        

    //   $(document).ready(function () {
    //     if (window.File && window.FileList && window.FileReader) {
    //       $("#images").on("change", function (e) {
    //         var files = e.target.files,
    //           filesLength = files.length;
    //         for (var i = 0; i < filesLength; i++) {
    //           var f = files[i];
    //           var fileReader = new FileReader();
    //           fileReader.onload = function (e) {
    //             var file = e.target;
    //             $(
    //               '<span class="pip">' +
    //                 '<img class="imageThumb" src="' +
    //                 e.target.result +
    //                 '" title="' +
    //                 file.name +
    //                 '"/>' +
    //                 '<br/><span class="remove">Remove image</span>' +
    //                 "</span>"
    //             ).insertAfter("#images");
    //             $(".remove").click(function () {
    //               $(this).parent(".pip").remove();
    //             });
    
    //           };
    //           fileReader.readAsDataURL(f);
    //         }
    //         console.log(images);
    //       });
    //     } else {
    //       alert("Your browser doesn't support to File API");
    //     }
    //   });

//     var acc = document.getElementsByClassName("accordion");
// var i;

// for (i = 0; i < acc.length; i++) {
//   acc[i].addEventListener("click", function() {
//     this.classList.toggle("actives");
//     var panel = this.nextElementSibling;
//     if (panel.style.maxHeight) {
//       panel.style.maxHeight = null;
//     } else {
//       panel.style.maxHeight = panel.scrollHeight + "px";
//     } 
//   });
// }


// // Get the modal
// var modal = document.getElementById("myModal");

// // Get the button that opens the modal
// var btn = document.getElementById("myBtn");

// // Get the <span> element that closes the modal
// var span = document.getElementsByClassName("close")[0];

// // When the user clicks the button, open the modal 
// btn.onclick = function() {
//   modal.style.display = "block";
// }

// // When the user clicks on <span> (x), close the modal
// span.onclick = function() {
//   modal.style.display = "none";
// }

// // When the user clicks anywhere outside of the modal, close it
// window.onclick = function(event) {
//   if (event.target == modal) {
//     modal.style.display = "none";
//   }
// }

// $('.schedule').click(function(){
//   //console.log("Working");
//   $('.schedule_modal').show();
// })
// $('.close').click(function(){
//     $('#schedule_modal').hide();
// })
$('.el-submenu__title').click(function(){
    $('.el-menu--horizontal').toggle();
})
function RemoveServiceRow() {
  console.log('Working');
}
});
