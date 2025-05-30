$(document).ready(function () {
    // Inicializa Isotope en el contenedor de las tarjetas
    var $grid = $('.image_load').isotope({
        itemSelector: '.grid-item',
        layoutMode: 'fitRows'
    });

    // Filtro al hacer clic en los elementos del menú
    $('.menu-filtering li').on('click', function () {
        $('.menu-filtering li').removeClass('current_menu_item');
        $(this).addClass('current_menu_item');

        var filterValue = $(this).attr('data-filter');
        $grid.isotope({ filter: filterValue });
    });
});