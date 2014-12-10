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
                "parentSelector": ".koalapse",
                "panelSelector": ".koalapse__content",
                "headingSelector": ".koalapse__title",
                "closeOthers": true,
                "animated": false,
                "showContentOnFocus": false,
                "showFirst": true
            },
            parameters = $.extend(defaults, options),
            $_that = this;


        //
        $_that.each(function(){
            // variables attached to the element
            var kParent = $(this),
                kHeading = kParent.find(parameters.headingSelector);


            // Link title and panel together with ID and ARIA attributes.
            kHeading.each(function(i){
                var id = "koalapse-" + kParent.index() + $(this).index(),
                    kPanel = $(this).next(parameters.panelSelector);

                // Add WAI-ARIA attributes and make it focusable
                $(this).attr({
                    'aria-expanded': false,
                    'aria-controls': id,
                    'tabindex': -1
                });

                // Add WAI-ARIA attributes to the content related to the title
                kPanel.attr({
                    'id': id,
                    'aria-hidden': true
                });

                // If "showFirst" is true - show first
                if( parameters.showFirst && i === 0){
                    $(this).attr({
                        'aria-expanded': true,
                        'tabindex': 0
                    });

                    $('#'+ $(this).attr("aria-controls")).attr('aria-hidden', false);
                }
            });
        });


        /**
        * Function that update tabindex on heading
        */
        var updateTabindex = function( showTab, parent ){
            // Remove all heading from the tab order
            $(parameters.headingSelector, parent).attr('tabIndex', -1);

            // Add showTab in the tab order
            $(showTab).attr('tabindex', 0);
        };


        // Events
        $('body').on('click', parameters.headingSelector, function(){
            var $_this = $(this),
                state = $_this.attr('aria-expanded') === 'false' ? true : false,
                controledEl = $('#' + $_this.attr('aria-controls')),
                parent = $_this.parents(parameters.parentSelector);

            // Close others - if options is set to true
            if( parameters.closeOthers === true ){
                $(parameters.headingSelector, parent).attr('aria-expanded', false);
                $(parameters.panelSelector, parent).attr('aria-hidden', true);
            }

            // Show the selected content
            $_this.attr('aria-expanded', state);
            controledEl.attr('aria-hidden', !state);

            updateTabindex($_this, parent);

        }).on('keydown', parameters.headingSelector, function(e){
            var $_this = $(this),
                activeEl = $(document.activeElement),
                parent = activeEl.parents(parameters.parentSelector);

                // Enter and Space toggle the panel
                if( e.keyCode === 13  || e.keyCode === 32 ){
                    $(this).click();
                }

                // Left and Up arrows : focus the next heading
                if( e.keyCode === 37 || e.keyCode === 38 ){
                    // If it's first heading - focus on last
                    if( activeEl[0] == parent.find(parameters.headingSelector).first()[0] ){
                        activeEl.nextAll(parameters.headingSelector).last().focus();

                        // If "showContentOnFocus" : show content
                        if( parameters.showContentOnFocus ){
                            activeEl.nextAll(parameters.headingSelector).last().click();
                        } else {
                            // Else updateTabindex of heading
                            updateTabindex( activeEl.nextAll(parameters.headingSelector).last(), parent );
                        }
                    } else {
                        activeEl.prevAll(parameters.headingSelector).first().focus();

                        // If "showContentOnFocus" : show content
                        if( parameters.showContentOnFocus ){
                            activeEl.prevAll(parameters.headingSelector).first().click();
                        } else {
                            // Else updateTabindex of heading
                            updateTabindex( activeEl.prevAll(parameters.headingSelector).first(), parent );
                        }
                    }
                }

                // Right and Down arrows : focus the next heading
                if( e.keyCode === 39 || e.keyCode === 40 ){
                    // If it's last heading - focus on first
                    if( activeEl[0] == parent.find(parameters.headingSelector).last()[0] ){
                        activeEl.prevAll(parameters.headingSelector).last().focus();

                        // If "showContentOnFocus" : show content
                        if( parameters.showContentOnFocus ){
                            activeEl.prevAll(parameters.headingSelector).last().click();
                        } else {
                            // Else updateTabindex of heading
                            updateTabindex( activeEl.prevAll(parameters.headingSelector).last(), parent );
                        }
                    } else {
                        activeEl.nextAll(parameters.headingSelector).first().focus();

                        // If "showContentOnFocus" : show content
                        if( parameters.showContentOnFocus ){
                            activeEl.nextAll(parameters.headingSelector).first().click();
                        } else {
                            // Else updateTabindex of heading
                            updateTabindex( activeEl.nextAll(parameters.headingSelector).first(), parent );
                        }
                    }
                }

                // Home : focus the first heading
                if( e.keyCode === 36 ){
                    parent.find(parameters.headingSelector).first()[0].focus();

                    // Update tabindex
                    updateTabindex( parent.find(parameters.headingSelector).first()[0], parent );
                }

                // End : focus the last heading
                if( e.keyCode === 35 ){
                    parent.find(parameters.headingSelector).last()[0].focus();

                    // Update tabindex
                    updateTabindex( parent.find(parameters.headingSelector).last()[0], parent );
                }

        }).on('keydown', parameters.panelSelector, function(e){
            var $_this = $(this),
                activeEl = $(document.activeElement),
                panel = activeEl.parents(parameters.panelSelector),
                panelID = panel.attr('id'),
                parent = activeEl.parents(parameters.parentSelector),
                heading = $(parameters.headingSelector + '[aria-controls='+ panelID +']');


            // CTRL + Left or Up arrows : focus on heading of the "active" panel
            if( (e.keyCode === 37 || e.keyCode === 38) && e.ctrlKey ){
                heading.focus();
            }

            // CTRL + Page Up : show previous tab and focus previous heading
            if( e.keyCode === 33 && e.ctrlKey ){
                // If it's first heading - focus on last
                if( heading[0] == parent.find(parameters.headingSelector).first()[0] ){
                    heading.nextAll(parameters.headingSelector).last().focus();

                    // If "showContentOnFocus" : show content
                    if( parameters.showContentOnFocus ){
                        heading.nextAll(parameters.headingSelector).last().click();
                    } else {
                        // Else updateTabindex of heading
                        updateTabindex( heading.nextAll(parameters.headingSelector).last(), parent );
                    }

                } else {
                    heading.prevAll(parameters.headingSelector).first().focus();

                    // If "showContentOnFocus" : show content
                    if( parameters.showContentOnFocus ){
                        heading.prevAll(parameters.headingSelector).first().click();
                    } else {
                        // Else updateTabindex of heading
                        updateTabindex( heading.prevAll(parameters.headingSelector).first(), parent );
                    }

                }
            }

            // CTRL + Page Down : show next tab and focus previous heading
            if( e.keyCode === 34 && e.ctrlKey ){
                // If it's first heading - focus on last
                if( heading[0] == parent.find(parameters.headingSelector).last()[0] ){
                    heading.prevAll(parameters.headingSelector).last().focus();

                    // If "showContentOnFocus" : show content
                    if( parameters.showContentOnFocus ){
                        heading.prevAll(parameters.headingSelector).last().click();
                    } else {
                        // Else updateTabindex of heading
                        updateTabindex( heading.prevAll(parameters.headingSelector).last(), parent );
                    }

                } else {
                    heading.nextAll(parameters.headingSelector).first().focus();

                    // If "showContentOnFocus" : show content
                    if( parameters.showContentOnFocus ){
                        heading.nextAll(parameters.headingSelector).first().click();
                    } else {
                        // Else updateTabindex of heading
                        updateTabindex( heading.nextAll(parameters.headingSelector).first(), parent );
                    }

                }
            }
        });


        // Return the element for jQuery chaining
        return $_that;

    };
})(jQuery);
