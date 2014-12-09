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
        var defauts = {
            "panelClass": "koalapse__content",
            "closeOthers": true,
            "animated": false
            },
            parameters = $.extend(defauts, options),
            $_that = this,
            focusOnHeading;


        //
        return $_that.each(function(){
            // variables attached to the element
            var $_this = $(this),
                id = "koalapse-" + $_this.index(),
                kPanel = $_this.next('.'+ parameters.panelClass);


            // Add WAI-ARIA attributes and make it focusable
            $_this.attr({
                'aria-expanded': false,
                'aria-controls': id,
                'tabindex': 0
            });

            // Add WAI-ARIA attributes to the content related to the title
            kPanel.attr({
                'id': id,
                'aria-hidden': true
            });

            // Events
            $_this.on('click', function(){
                // Get current state
                var state = $(this).attr('aria-expanded') === 'false' ? true : false;

                // Close others - if options is set to true
                if( parameters.closeOthers === true ){
                    $('.koalapse__trigger').attr('aria-expanded', false);
                    $('.'+ parameters.panelClass).attr('aria-hidden', true);
                }

                // Show the selected content
                $(this).attr('aria-expanded', state);
                kPanel.attr('aria-hidden', !state);
            }).on('keydown', function(e){
                var activeEl = $(document.activeElement);

                console.log(e.keyCode);


                // If the active element - with focus - is a title
                if( activeEl.is($_this) ){
                    focusOnHeading = true;
                }

                if( focusOnHeading ){
                    // Enter toggle the panel
                    if( e.keyCode === 13  || e.keyCode === 32 ){
                        $(this).click();
                    }

                    // Left and Up arrows : focus the next heading
                    if( e.keyCode === 37 || e.keyCode === 38 ){
                        // If it's first heading - focus on last
                        if( activeEl.is('.koalapse__title:first') ){
                            activeEl.nextAll('.koalapse__title').last().focus();
                        } else {
                            activeEl.prevAll('.koalapse__title').first().focus();
                        }
                    }

                    // Right and Down arrows : focus the next heading
                    if( e.keyCode === 39 || e.keyCode === 40 ){
                        // If it's last heading - focus on first
                        if( activeEl.is('.koalapse__title:last') ){
                            console.log('last');
                            activeEl.prevAll('.koalapse__title').last().focus();
                        } else {
                            activeEl.nextAll('.koalapse__title').first().focus();
                        }
                    }

                    // Home : focus the first heading
                    if( e.keyCode === 36 ){
                        $('.koalapse__title:first').focus();
                    }

                    // End : focus the last heading
                    if( e.keyCode === 35 ){
                        $('.koalapse__title:last').focus();
                    }

                } else {

                }
            });
        });
    };
})(jQuery);
