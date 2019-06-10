(function(window, jQuery) {
    window.OSnet = window.OSnet || {
        Components: {}
    };

    window.OSnet.Components.Alert = window.OSnet.Components.Alert || (function (OSnet, $) {
        if (typeof $ == 'undefined') {
            throw new Error('OSnet Alert Component requires jQuery.');
        }

        var Alert = {};

        Alert.show = (function(container, type, title, message, greedy) {
            var template = $('script[type="text/template"]#template-alert');
            
            if (template.length == 0) {
                throw new Error('Alert component template is missing.');
            }
            
            if ($(container).length) {
                template = $('<div />').html(template.html());
                
                type = type || 'info';

                template.find('.alert').addClass('alert-' + type);
                
                template.find('.title').html(title);
                template.find('.message').html(message);

                if (greedy) {
                    $(container).html(template.contents());

                } else {
                    $(container).append(template.contents());
                }
            }
        });

        Alert.clear = (function(container) {
            if ($(container).length) {
                $(container).html(null);    
            }
        });

        return Alert;
    } (window.OSnet, jQuery));
} (window, jQuery));