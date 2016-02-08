//if #main_menu.page-home has child li.page-home, add teh class "pure-menu-selected" to that child, and change the href child of that child to "#"

//on click of element with class .pure-menu-link, toggle on the class "pure-menu-selected" to the parent of that element.
//on click anywhere else, toggle off



(function (window, document) {

    var layout   = document.getElementById('layout'),
        main_menu     = document.getElementById('main_menu'),
        menuLink = document.getElementById('menuLink');

    function toggleClass(element, className) {
        var classes = element.className.split(/\s+/),
            length = classes.length,
            i = 0;

        for(; i < length; i++) {
          if (classes[i] === className) {
            classes.splice(i, 1);
            break;
          }
        }
        // The className is not found
        if (length === classes.length) {
            classes.push(className);
        }

        element.className = classes.join(' ');
    }

    menuLink.onclick = function (e) {
        var active = 'active';

        e.preventDefault();
        toggleClass(layout, active);
        toggleClass(main_menu, active);
        toggleClass(menuLink, active);
    };

}(this, this.document));
