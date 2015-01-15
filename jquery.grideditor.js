/**
 * Frontwise simple cycle plugin.
 * v 1.2
 */
(function( $ ){

  $.fn.gridEditor = function( options ) {
      
    var self = this;
    
    self.each(function(baseIndex, baseElem) {
        baseElem = $(baseElem);
        
        var settings = $.extend({
            'new_row_layouts'   : [ // Column layouts for add row buttons
                                    [12],
                                    [6, 6],
                                    [4, 4, 4],
                                    [3, 3, 3, 3],
                                    [2, 2, 2, 2, 2, 2],
                                    [2, 8, 2],
                                    [4, 8],
                                    [8, 4]
                                ],
            'row_classes'       : [{ label: 'example', cssClass: 'example-class'}],
            'col_classes'       : [{ label: 'example', cssClass: 'example-class'}],
        }, options);
        
        // Elems
        var canvas,
            mainControls,
            addRowGroup,
            htmlTextArea
        ;
        var colClasses = ['col-md-', 'col-sm-', 'col-xs-'];
        var curColClassIndex = 0; // Index of the column class we are manipulating currently
        var MAX_COL_SIZE = 12;
        var initialTinyMceContent = '<p>Lorem ipsum dolores</p>';
        
        setup();
        init();
        
        function setup() {
            /* Setup canvas */
            canvas = baseElem.addClass('ge-canvas');
            
            htmlTextArea = $('<textarea class="ge-html-output"/>').insertBefore(canvas);
            
            /* Create main controls*/
            mainControls = $('<div class="ge-mainControls" />').insertBefore(htmlTextArea);
            var wrapper = $('<div class="ge-wrapper ge-top" />').appendTo(mainControls);
            
            // Add row
            addRowGroup = $('<div class="ge-addRowGroup btn-group" />').appendTo(wrapper);
            $.each(settings.new_row_layouts, function(i, layout) {
                var btn = $('<a class="btn btn-xs btn-primary" />')
                    .attr('title', 'Add row ' + layout.join('-'))
                    .on('click', function() {
                        var row = createRow().appendTo(canvas);
                        layout.forEach(function(i) {
                            createColumn(i).appendTo(row);
                        });
                        init();
                    })
                    .appendTo(addRowGroup)
                ;
                
                btn.append('<span class="fa fa-plus-square"/>');
                    
                var layoutName = layout.join(' - ');
                var icon = '<div class="row ge-row-icon">';
                layout.forEach(function(i) {
                    icon += '<div class="column col-xs-' + i + '"/>';
                });
                icon += '</div>';
                btn.append(icon);
            });
            
            // Buttons on right
            var btnGroup = $('<div class="btn-group pull-right"/>')
                .appendTo(wrapper)
            ;
            var htmlButton = $('<button title="Edit Source Code" type="button" class="btn btn-xs btn-primary gm-edit-mode"><span class="fa fa-code"></span></button>')
                .on('click', function() {
                    if (htmlButton.hasClass('active')) {
                        canvas.empty().html(htmlTextArea.val()).show();
                        init();
                        htmlTextArea.hide();
                    } else {
                        deinit();
                        htmlTextArea
                            .height(0.8 * $(window).height())
                            .val(canvas.html())
                            .show()
                        ;
                        canvas.hide();
                    }
                    
                    htmlButton.toggleClass('active btn-danger');
                })
                .appendTo(btnGroup)
            ;
            var previewButton = $('<button title="Preview" type="button" class="btn btn-xs btn-primary gm-preview"><span class="fa fa-eye"></span></button>')
                .on('mouseenter', function() {
                    canvas.removeClass('ge-editing');
                })
                .on('click', function() {
                    previewButton.toggleClass('active btn-danger').trigger('mouseleave');
                })
                .on('mouseleave', function() {
                    if (!previewButton.hasClass('active')) {
                        canvas.addClass('ge-editing');
                    }
                })
                .appendTo(btnGroup)
            ;
            var layoutDropdown = $('<div class="dropdown pull-right ge-layout-mode">' +
                '<button type="button" class="btn btn-xs btn-primary dropdown-toggle" data-toggle="dropdown"><span class="fa fa-desktop" title="Desktop"></span></button>' +
                '<ul class="dropdown-menu" role="menu">' +
                    '<li><a data-width="auto" title="Desktop"><span class="fa fa-desktop"></span> Desktop</a></li>' +
                    '<li><a title="Tablet"><span class="fa fa-tablet"></span> Tablet</a></li>' +
                    '<li><a title="Phone"><span class="fa fa-mobile-phone"></span> Phone</a></li>' +
                    '</ul>' +
                '</div>')
                .on('click', 'a', function() {
                    var a = $(this);
                    switchLayout(a.closest('li').index());
                    var btn = layoutDropdown.find('button');
                    btn.find('span').remove();
                    btn.append(a.find('span').clone());
                })
                .appendTo(btnGroup)
            ;
            
            // Make controls fixed on scroll
            var $window = $(window);
            $window.on('scroll', function(e) {
                if (
                    $window.scrollTop() > mainControls.offset().top &&
                    $window.scrollTop() < canvas.offset().top + canvas.height()
                ) {
                    if (wrapper.hasClass('ge-top')) {
                        wrapper
                            .css({
                                left: wrapper.offset().left,
                                width: wrapper.outerWidth(),
                            })
                            .removeClass('ge-top')
                            .addClass('ge-fixed')
                        ;
                    }
                } else {
                    if (wrapper.hasClass('ge-fixed')) {
                        wrapper
                            .css({ left: '', width: '' })
                            .removeClass('ge-fixed')
                            .addClass('ge-top')
                        ;
                    }
                }
            });
            
            /* Init RTE on click */
            canvas.on('click', '.ge-content', function(e) {
                initRTE($(this), e);
            })
        }
        
        function reset() {
            deinit();
            init();
        }
            
        function init() {
            canvas.addClass('ge-editing');
            addAllColClasses();
            wrapContent();
            createRowControls();
            createColControls();
            makeSortable();
            switchLayout(curColClassIndex);
        }
        
        function deinit() {
            canvas.removeClass('ge-editing');
            deinitRTE(canvas.find('.ge-content-type-tinymce'));
            canvas.find('.ge-tools-drawer').remove();
            removeSortable();
        }
        
        function createRowControls() {
            canvas.find('.row').each(function() {
                var row = $(this);
                if (row.find('> .ge-tools-drawer').length) { return; }
                
                var drawer = $('<div class="ge-tools-drawer" />').prependTo(row);
                createTool(drawer, 'Move', 'ge-move', 'fa-arrows');
                createTool(drawer, 'Settings', '', 'fa-cog', function() {
                    details.toggle();
                });
                createTool(drawer, 'Remove row', '', 'fa-trash', function() {
                    row.slideUp(function() {
                        row.remove();
                    });
                });
                createTool(drawer, 'Add column', 'ge-add-column', 'fa-plus-square', function() {
                    row.append(createColumn(3));
                    init();
                });
                
                var details = createDetails(row, settings.row_classes).appendTo(drawer);
            });
        }
        
        function createColControls() {
            canvas.find('.column').each(function() {
                var col = $(this);
                if (col.find('> .ge-tools-drawer').length) { return; }
                
                var drawer = $('<div class="ge-tools-drawer" />').prependTo(col);
                
                createTool(drawer, 'Move', 'ge-move', 'fa-arrows');
                
                createTool(drawer, 'Make column wider\n(hold shift for max)', 'ge-increase-col-width', 'fa-plus', function(e) {
                    var curColClass = colClasses[curColClassIndex];
                    var newSize = getColSize(col, curColClass) + 1;
                    if (e.shiftKey) {
                        newSize = MAX_COL_SIZE;
                    }
                    setColSize(col, curColClass, Math.min(newSize, MAX_COL_SIZE));
                });
                
                createTool(drawer, 'Make column narrower\n(hold shift for min)', 'ge-decrease-col-width', 'fa-minus', function(e) {
                    var curColClass = colClasses[curColClassIndex];
                    var newSize = getColSize(col, curColClass) - 1;
                    if (e.shiftKey) {
                        newSize = 1;
                    }
                    setColSize(col, curColClass, Math.max(newSize, 1));
                });
                
                createTool(drawer, 'Settings', '', 'fa-cog', function() {
                    details.toggle();
                });
                
                settings.col_tools.forEach(function(t) {
                    createTool(drawer, t.title, t.className, t.iconClass, t.on);
                });
                
                createTool(drawer, 'Remove col', '', 'fa-trash', function() {
                    col.animate({
                        opacity: 'hide',
                        width: 'hide',
                        height: 'hide'
                    }, 400, function() {
                        col.remove();
                    });
                });
                
                createTool(drawer, 'Add row', 'ge-add-row', 'fa-plus-square', function() {
                    var row = createRow();
                    col.append(row);
                    row.append(createColumn(6)).append(createColumn(6));
                    init();
                });
                
                var details = createDetails(col, settings.col_classes).appendTo(drawer);
            });
        }
        
        function createTool(drawer, title, className, iconClass, eventHandlers) {
            var tool = $('<a title="' + title + '" class="' + className + '"><span class="fa ' + iconClass + '"></span></a>')
                .appendTo(drawer)
            ;
            if (typeof eventHandlers == 'function') {
                tool.on('click', eventHandlers)
            }
            if (typeof eventHandlers == 'object') {
                $.each(eventHandlers, function(name, func) {
                    tool.on(name, func);
                });
            }
        }
        
        function createDetails(container, cssClasses) {
            var detailsDiv = $('<div class="ge-details" />');
            
            $('<input class="ge-id" />')
                .attr('placeholder', 'id')
                .val(container.attr('id'))
                .attr('title', 'Set a unique identifier')
                .appendTo(detailsDiv)
            ;
            
            var classGroup = $('<div class="btn-group" />').appendTo(detailsDiv);
            cssClasses.forEach(function(rowClass) {
                var btn = $('<a class="btn btn-xs btn-default" />')
                    .html(rowClass.label)
                    .attr('title', rowClass.title ? rowClass.title : 'Toggle "' + rowClass.label + '" styling')
                    .toggleClass('active btn-primary', container.hasClass(rowClass.cssClass))
                    .on('click', function() {
                        btn.toggleClass('active btn-primary');
                        container.toggleClass(rowClass.cssClass, btn.hasClass('active'));
                    })
                    .appendTo(classGroup)
                ;
            });
            
            return detailsDiv;
        }
        
        function addAllColClasses() {
            canvas.find('.column, div[class*="col-"]').each(function() {
                var col = $(this);
                
                var size = 2;
                var sizes = getColSizes(col);
                if (sizes.length) {
                    size = sizes[0].size;
                }
                
                var elemClass = col.attr('class');
                colClasses.forEach(function(colClass) {
                    if (elemClass.indexOf(colClass) == -1) {
                        col.addClass(colClass + size);
                    }
                });
                
                col.addClass('column');
            });
        }
        
        /**
         * Return the column size for colClass, or a size from a different
         * class if it was not found.
         * Returns null if no size whatsoever was found.
         */
        function getColSize(col, colClass) {
            var sizes = getColSizes(col);
            for (var i = 0; i < sizes.length; i++) {
                if (sizes[i].colClass == colClass) {
                    return sizes[i].size;
                }
            }
            if (sizes.length) {
                return sizes[0].size;
            }
            return null;
        }
        
        function getColSizes(col) {
            var result = [];
            colClasses.forEach(function(colClass) {
                var re = new RegExp(colClass + '(\\d+)', 'i');
                if (re.test(col.attr('class'))) {
                    result.push({
                        colClass: colClass,
                        size: parseInt(re.exec(col.attr('class'))[1])
                    });
                }
            });
            return result;
        }
        
        function setColSize(col, colClass, size) {
            var re = new RegExp('(' + colClass + '(\\d+))', 'i');
            var reResult = re.exec(col.attr('class'));
            if (reResult && parseInt(reResult[2]) !== size) {
                col.switchClass(reResult[1], colClass + size, 50);
            } else {
                col.addClass(colClass + size);
            }
        }
        
        function makeSortable() {
            canvas.find('.row').sortable({
                items: '> .column',
                connectWith: '.ge-canvas .row',
                handle: '> .ge-tools-drawer .ge-move',
                start: sortStart,
                helper: 'clone',
            });
            canvas.add(canvas.find('.column')).sortable({
                items: '> .row, > .ge-content',
                connectsWith: '.ge-canvas, .ge-canvas .column',
                handle: '> .ge-tools-drawer .ge-move',
                start: sortStart,
                helper: 'clone',
            })
            
            function sortStart(e, ui) {
                ui.placeholder.css({ height: ui.item.height()});
                ui.helper.hide();
            }
        }
        
        function removeSortable() {
            canvas.add(canvas.find('.column')).add(canvas.find('.row')).sortable('destroy');
        }
        
        function createRow() {
            return $('<div class="row" />');
        }
        
        function createColumn(size) {
            return $('<div/>')
                .addClass(colClasses.map(function(c) { return c += size }).join(' '))
                .append(createContentArea('tinymce', initialTinyMceContent))
            ;
        }
        
        function createContentArea(type, initialContent) {
            return $('<div/>')
                .addClass('ge-content ge-content-type-' + type)
                .html(initialContent)
            ;
        } 
        
        /**
         * Wrap column content in <div class="ge-content"> where neccesary
         */
        function wrapContent() {
            canvas.find('.column').each(function() {
                var col = $(this);
                var contents = $();
                col.children().each(function() {
                    var child = $(this);
                    if (child.is('.row, .ge-tools-drawer, .ge-content')) {
                        doWrap(contents);
                    } else {
                        contents = contents.add(child);
                    }
                });
                doWrap(contents);
            })
        }
        function doWrap(contents) {
            if (contents.length) {
                var container = $('<div class="ge-content ge-content-type-tinymce" />').insertAfter(contents.last());
                contents.appendTo(container);
                contents = $();
            }
        }
        
        function initRTE(contentAreas, evt) {
            contentAreas.each(function() {
                var contentArea = $(this);
                if (!contentArea.hasClass('active')) {
                    if (contentArea.html() == initialTinyMceContent) {
                        contentArea.html('');
                    }
                    contentArea.addClass('active');
                    var tiny = contentArea.tinymce(settings.tinymce.config);
                    setTimeout(function() {
                        tiny.focus();
                    })
                }
            });
        }
        
        function deinitRTE(contentAreas) {
            contentAreas.filter('.active').each(function() {
                var contentArea = $(this);
                var tiny = contentArea.tinymce();
                if (tiny) {
                    tiny.remove();
                }
                contentArea
                    .removeClass('active')
                    .attr('id', null)
                    .attr('style', null)
                    .attr('spellcheck', null)
                ;
            });
        }
        
        function switchLayout(colClassIndex) {
            curColClassIndex = colClassIndex;
            
            var layoutClasses = ['ge-layout-desktop', 'ge-layout-tablet', 'ge-layout-phone'];
            layoutClasses.forEach(function(cssClass, i) {
                canvas.toggleClass(cssClass, i == colClassIndex);
            });
        }
        
        baseElem.data('grideditor', {
            init: init,
            deinit: deinit,
        })
        
    });
    
    return self;
    
  };
})( jQuery );