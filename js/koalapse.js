/**
 * --------------------------------------------------------------------
 * jQuery Koalapse plugin
 * A simple and accessible accordion plugin
 * Inspired by: http://heydonworks.com/practical_aria_examples/#progressive-collapsibles
 * Author: Christophe HERMANN, christophe-hermann.fr
 * --------------------------------------------------------------------
 */
(function($){
    $.fn.koalapse=function(options){

        // variables used in the plugin
        var defaults = {
                "parentClass": ".koalapse",
                "panelClass": ".koalapse__content",
                "headingClass": ".koalapse__title",
                "closeOthers": false,
                "animated": false,
                "showContentOnFocus": false
            },
            parameters = $.extend(defaults, options),
            $_that = this;


        //
        $_that.each(function(){
            // variables attached to the element
            var kParent = $(this),
                kHeading = kParent.find(parameters.headingClass);


            // Link title and panel together with ID and ARIA attributes.
            kHeading.each(function(){
                var id = "koalapse-" + kParent.index() + $(this).index(),
                    kPanel = $(this).next(parameters.panelClass);

                // Add WAI-ARIA attributes and make it focusable
                $(this).attr({
                    'aria-expanded': false,
                    'aria-controls': id,
                    'tabindex': 0
                });

                // Add WAI-ARIA attributes to the content related to the title
                kPanel.attr({
                    'id': id,
                    'aria-hidden': true
                });
            });
        });



        // Events
        $('body').on('click', parameters.headingClass, function(){
            var $_this = $(this),
                state = $_this.attr('aria-expanded') === 'false' ? true : false,
                controledEl = $('#' + $_this.attr('aria-controls')),
                parent = $_this.parents(parameters.parentClass);

            // Close others - if options is set to true
            if( parameters.closeOthers === true ){
                $(parameters.headingClass, parent).attr('aria-expanded', false);
                $(parameters.panelClass, parent).attr('aria-hidden', true);
            }

            // Show the selected content
            $_this.attr('aria-expanded', state);
            controledEl.attr('aria-hidden', !state);

        }).on('keydown', parameters.headingClass, function(e){
            var $_this = $(this),
                activeEl = $(document.activeElement),
                parent = activeEl.parents(parameters.parentClass);

                console.log(activeEl);

                // Enter and Space toggle the panel
                if( e.keyCode === 13  || e.keyCode === 32 ){
                    $(this).click();
                }

                // Left and Up arrows : focus the next heading
                if( e.keyCode === 37 || e.keyCode === 38 ){
                    // If it's first heading - focus on last
                    if( activeEl[0] == parent.find(parameters.headingClass).first()[0] ){
                        activeEl.nextAll(parameters.headingClass).last().focus();
                    } else {
                        activeEl.prevAll(parameters.headingClass).first().focus();
                    }
                }

                // Right and Down arrows : focus the next heading
                if( e.keyCode === 39 || e.keyCode === 40 ){
                    // If it's last heading - focus on first
                    if( activeEl[0] == parent.find(parameters.headingClass).last()[0] ){
                        activeEl.prevAll(parameters.headingClass).last().focus();
                    } else {
                        activeEl.nextAll(parameters.headingClass).first().focus();
                    }
                }

                // Home : focus the first heading
                if( e.keyCode === 36 ){
                    parent.find(parameters.headingClass).first()[0].focus();
                }

                // End : focus the last heading
                if( e.keyCode === 35 ){
                    parent.find(parameters.headingClass).last()[0].focus();
                }

        }).on('keydown', parameters.panelClass, function(e){
            var $_this = $(this),
                activeEl = $(document.activeElement),
                panel = activeEl.parents(parameters.panelClass),
                panelID = panel.attr('id'),
                parent = activeEl.parents(parameters.parentClass),
                heading = $(parameters.headingClass + '[aria-controls='+ panelID +']');

            // CTRL + Left or Up arrows : focus on heading of the "active" panel
            if( (e.keyCode === 37 || e.keyCode === 38) && e.ctrlKey ){
                heading.focus();
            }

            // CTRL + Page Up : show previous tab and focus previous heading
            if( e.keyCode === 33 && e.ctrlKey ){
                // If it's first heading - focus on last
                if( heading[0] == parent.find(parameters.headingClass).first()[0] ){
                    heading.nextAll(parameters.headingClass).last().focus().click();
                } else {
                    heading.prevAll(parameters.headingClass).first().focus().click();
                }
            }

            // CTRL + Page Down : show next tab and focus previous heading
            if( e.keyCode === 34 && e.ctrlKey ){
                // If it's first heading - focus on last
                if( heading[0] == parent.find(parameters.headingClass).last()[0] ){
                    heading.prevAll(parameters.headingClass).last().focus().click();
                } else {
                    heading.nextAll(parameters.headingClass).first().focus().click();
                }
            }
        });


        return $_that;

    };
})(jQuery);
