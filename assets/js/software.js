$(document).ready(function () {
    var $grid = $('.image_load').isotope({
        itemSelector: '.grid-item',
        layoutMode: 'fitRows'
    });

    $('.menu-filtering li').on('click', function () {
        $('.menu-filtering li').removeClass('current_menu_item');
        $(this).addClass('current_menu_item');

        var filterValue = $(this).attr('data-filter');
        $grid.isotope({ filter: filterValue });
    });

    const $image = $('#faqImage');

    const images = {
        collapseOne: 'assets/img/software/servicio (1).jpg',
        collapseTwo: 'assets/img/software/servicio (2).jpg',
        collapseThree: 'assets/img/software/servicio (3).jpg'
    };

        const $openSection = $('.collapse.show');
    if ($openSection.length > 0) {
        const openId = $openSection.attr('id');
        const initialSrc = images[openId];
        if (initialSrc) {
            $image.attr('src', initialSrc);
        }
    }
    
    $('.collapse').on('show.bs.collapse', function () {
        const id = $(this).attr('id');
        const newSrc = images[id];
        if (newSrc) {
            $image.fadeOut(200, function () {
                $image.attr('src', newSrc).fadeIn(200);
            });
        }
    });
});