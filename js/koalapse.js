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
            "contentClass": "koalapse__content",
            "closeOthers": true,
            "animated": false
            },
            parametres = $.extend(defauts, options),
            $_that = this;


        //
        return $_that.each(function(){
            // variables attached to the element
            var $_this = $(this),
                id = "koalapse-" + $_this.index(),
                kHeadingHTML = $_this.html(),
                kContent = $_this.next('.'+ parametres.contentClass);

            // Wrap heading content in a button and add WAI-ARIA attributes
            $_this.html('<button class="koalapse__trigger" aria-expanded="false" aria-controls="'+ id +'">'+ kHeadingHTML +'</button>');
            var trigger = $_this.children('.koalapse__trigger');

            // Add WAI-ARIA attributes to the content related to the title
            kContent.attr({
                'id': id,
                'aria-hidden': true
            });

            // Events
            trigger.on('click', function(){
                // Get current state
                var state = $(this).attr('aria-expanded') === 'false' ? true : false;

                // Close others - if options is set to true
                if( parametres.closeOthers === true ){
                    $('.koalapse__trigger').attr('aria-expanded', false);
                    $('.'+ parametres.contentClass).attr('aria-hidden', true);
                }

                // Show the selected content
                $(this).attr('aria-expanded', state);
                kContent.attr('aria-hidden', !state);
            });

        });
    };
})(jQuery);



$('.koalapse__title').koalapse();