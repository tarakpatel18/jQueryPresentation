/*!
 * jQuery Presentation Plugin
 * https://github.com/tarakpatel18/jQueryPresentation
 *
 * Released under the GNU license
 */
jQuery.fn.jPresentation = function (options) {
    "use strict";
    var defaults = {
        'startButtonText': "Start Presentation",
        'data': [{
            name: 'h1',
            content: "Can't found data"
        }]
    };
    return this.each(function () {
        // Overwrite default setting and global variables
        var settings = $.extend({}, defaults, options);
        var objData = settings.data;
        var _this = $(this);
        // Get the selector id or class
        var selector = '';
        if (this.id) {
            selector = '#' + this.id;
        } else if (this.className) {
            selector = '.' + this.className;
            if (selector.indexOf(' ') > -1) {
                selector = selector.split(" ");
                selector = selector[0];
            }
        }
        // When presentation over
        $.fn.jPresentation.over = function(closed) {
            _this.children('.slide *').remove();
            _this.children('.slide').remove();
            if (closed) {
                _this.find('.startP').removeClass('restart');
            }
        }
        // Add start and close button
        _this.html("<span class='startP'>" + settings.startButtonText + "</span><div class='closeP'></div>");
        var presentationOver;
        // Close button click
        _this.find(".closeP").click(function() {
            $(this).hide();
            if (presentationOver) {
                clearTimeout(presentationOver);
                presentationOver = false;
            }
            $.fn.jPresentation.over(true);
        });
        // Start button or restrt button
        _this.find(".startP").click(function() {
            _this.find(".closeP").show();
            if ($(this).hasClass('restart')) {
                if (presentationOver) {
                    clearTimeout(presentationOver);
                    presentationOver = false;
                }
                $.fn.jPresentation.over(false);
            } else {
                $(this).hide().addClass('restart').fadeIn('slow');
            }            
            // Convert object to HTML
            var allTags = '<div class="slide">';
            for (var tag in objData) {
                var tag_html = '';
                if (objData[tag].name === 'over') {
                    presentationOver = setTimeout(function() {
                        _this.find(".closeP").hide();
                        $.fn.jPresentation.over(true);
                    }, objData[tag].time);
                } else {
                    tag_html += '<' + objData[tag].name;
                    if (objData[tag].attr != undefined) {
                        for (var atr in objData[tag].attr) {
                            tag_html += ' ' + atr;
                            tag_html += '="';
                            tag_html += objData[tag].attr[atr];
                            tag_html += '"';
                        }
                    }
                    if (objData[tag].name != 'img') {
                        tag_html += '>';
                    }
                    if (objData[tag].content) {
                        tag_html += objData[tag].content;
                    }
                    if (objData[tag].name == 'img') {
                        tag_html += ' />';
                    } else {
                        tag_html += '</' + objData[tag].name + '>';
                    }
                    allTags += tag_html;
                    tag_html = null;
                }                
            }
            allTags += '</div>';
            _this.append(allTags);
            allTags = null;
            $(selector + ' > div.slide > *').each(function () {
                var _current = $(this);
                var index = _current.index();
                // CSS effect
                if (settings.data[index].cssEffect) {
                    if (settings.data[index].cssEffect.type) {
                        var cssAnimation = setTimeout(function () {
                            $(_current).addClass('animated ' + settings.data[index].cssEffect.type + '').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
                                $(this).removeClass('animate animated ' + settings.data[index].cssEffect.type + '');                                        
                            });
                            clearTimeout(cssAnimation);
                        }, settings.data[index].cssEffect.time);
                    }
                }
                // jQuery animation
                if (settings.data[index].animation) {
                    var cssProperty = settings.data[index].animation[0];
                    var newStyle = {};
                    newStyle[cssProperty] = settings.data[index].animation[1];
                    var animation = setTimeout(function () {
                        $(_current).animate(newStyle, settings.data[index].animation[2]);
                        clearTimeout(animation);
                    }, settings.data[index].animation[3]);
                }
                // After jQuery animation
                if (settings.data[index].afterAnimation) {
                    var AcssProperty = settings.data[index].afterAnimation[0];
                    var AnewStyle = {};
                    AnewStyle[AcssProperty] = settings.data[index].afterAnimation[1];
                    var afterAnimation = setTimeout(function () {
                        $(_current).animate(AnewStyle, settings.data[index].afterAnimation[2]);
                        clearTimeout(afterAnimation);
                    }, settings.data[index].afterAnimation[3]);
                }
            });
        });
    });
};