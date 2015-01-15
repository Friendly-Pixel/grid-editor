Grid Editor
===========

Grid Editor is a visual javascript editor for the [bootstrap grid system](http://getbootstrap.com/css/#grid), written as a [jQuery](http://jquery.com/) plugin.

![Preview](http://i.imgur.com/UF9CCzk.png) 

# <a href="http://transfer.frontwise.com/frontwise/grid-editor/example/" target="_blank">Try the demo!</a>

Installation
------------

* __Dependencies:__ Grid Editor depens on jQuery, jQuery UI, and Bootstap, so make sure you have included those in the page. If you want to use the tincyMCE integration, load tinyMCE en tinyMCE jQuery plugin as well.
* [Download the latest version of Grid Editor](https://github.com/Frontwise/grid-editor/archive/master.zip) include it in your page: 


    <link rel="stylesheet" type="text/css" href="grid-editor/dist/grideditor.css" />
    <script src="grid-editor/dist/jquery.grideditor.min.js"></script>

Usage
-----

    $('#myGrid').gridEditor({
        new_row_layouts: [[12], [6,6], [9,3]],
    });
    
Options
-------

__`new_row_layouts`:__ set the column layouts that appear in the "new row" buttons at the top of the editor.<br>

    $('#myGrid').gridEditor({
        new_row_layouts: [[12], [6,6], [9,3]],
    });


__`row_classes`:__ set the css classes that the user can toggle on the rows, under the settings button.<br>

    $('#myGrid').gridEditor({
        row_classes: [{'Example class', cssClass: 'example-class'}],
    });

__`col_classes`:__ the same as row_classes, but for columns.

__`row_tools`:__ add extra tool button to the row toolbar.<br>

    $('#myGrid').gridEditor({
        row_tools: [{
            title: 'Set background image',
            iconClass: 'glyphicon-picture',
            on: { 
                click: function() {
                    $(this).closest('.row').css('background-image', 'url(http://placekitten.com/g/300/300)');
                }
            }
        }]
    });
    
__`col_tools`:__ the same as row_tools, but for columns.

Attribution
-----------

Grid Editor was heavily inspired by [Neokoenig's grid manager](https://github.com/neokoenig/jQuery-gridmanager)