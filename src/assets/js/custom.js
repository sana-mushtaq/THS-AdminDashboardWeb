(function ($) {

	'use strict';
	// Mean Menu JS
	$('.mean-menu').meanmenu({
		meanScreenWidth: "991"
	});

	// Nice Select JS
	$('select').niceSelect();

	// Header Sticky
	$(window).on('scroll', function () {
		if ($(this).scrollTop() > 120) {
			$('.navbar-area').addClass("is-sticky");
		} else {
			$('.navbar-area').removeClass("is-sticky");
		}
	});

	// FAQ Accordion JS
	$('.accordion').find('.accordion-title').on('click', function () {
		// Adds Active Class
		$(this).toggleClass('active');
		// Expand or Collapse This Panel
		$(this).next().slideToggle('fast');
		// Hide The Other Panels
		$('.accordion-content').not($(this).next()).slideUp('fast');
		// Removes Active Class From Other Titles
		$('.accordion-title').not($(this)).removeClass('active');
	});

	// Odometer JS
	$('.odometer').appear(function (e) {
		var odo = $(".odometer");
		odo.each(function () {
			var countNumber = $(this).attr("data-count");
			$(this).html(countNumber);
		});
	});

	// Others Option For Responsive JS
	$(".others-option-for-responsive .dot-menu").on("click", function () {
		$(".others-option-for-responsive .container .container").toggleClass("active");
	});

	// Popup Video JS
	$('.popup-youtube, .popup-vimeo').magnificPopup({
		disableOn: 300,
		type: 'iframe',
		mainClass: 'mfp-fade',
		removalDelay: 160,
		preloader: false,
		fixedContentPos: false,
	});

	// Skill JS
	$('.skill-bar').each(function () {
		jQuery(this).find('.progress-content').animate({
			width: jQuery(this).attr('data-percentage')
		}, 2000);
		jQuery(this).find('.progress-number-mark').animate({
			left: jQuery(this).attr('data-percentage')
		}, {
			duration: 2000,
			step: function (now, fx) {
				var data = Math.round(now);
				jQuery(this).find('.percent').html(data + '%');
			}
		});
	});

	// Tabs JS
	$('.tab ul.tabs').addClass('active').find('> li:eq(0)').addClass('current');
	$('.tab ul.tabs li').on('click', function (g) {
		var tab = $(this).closest('.tab'),
			index = $(this).closest('li').index();
		tab.find('ul.tabs > li').removeClass('current');
		$(this).closest('li').addClass('current');
		tab.find('.tab_content').find('div.tabs_item').not('div.tabs_item:eq(' + index + ')').slideUp();
		tab.find('.tab_content').find('div.tabs_item:eq(' + index + ')').slideDown();
		g.preventDefault();
	});

	// WOW JS
	if ($('.wow').length) {
		var wow = new WOW({
			mobile: false
		});
		wow.init();
	}

})(jQuery);