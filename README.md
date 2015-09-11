Grid Editor
===========

Grid Editor is a visual javascript editor for the [bootstrap grid system](http://getbootstrap.com/css/#grid), written as a [jQuery](http://jquery.com/) plugin.

![Preview](http://i.imgur.com/UF9CCzk.png)

# <a href="http://transfer.frontwise.com/frontwise/grid-editor/example/" target="_blank">Try the demo!</a>

Installation
------------

* __Dependencies:__ Grid Editor depens on jQuery, jQuery UI, and Bootstap, so make sure you have included those in the page. If you want to use the tincyMCE integration, load tinyMCE en tinyMCE jQuery plugin as well.
* [Download the latest version of Grid Editor](https://github.com/Frontwise/grid-editor/archive/master.zip) and include it in your page:

```html
<!-- Make sure jQuery, jQuery UI, and bootstrap 3 are included. TinyMCE is optional. -->
<link rel="stylesheet" type="text/css" href="grid-editor/dist/grideditor.css" />
<script src="grid-editor/dist/jquery.grideditor.min.js"></script>
```

Usage
-----
```javascript
$('#myGrid').gridEditor({
    new_row_layouts: [[12], [6,6], [9,3]],
});
// Call this to get the result after the user has done some editing:
var html = $('#myGrid').gridEditor('getHtml');
```

Methods
-------

__`getHtml`:__ Returns the clean html, after the user has done some editing

```javascript
var html = $('#myGrid').gridEditor('getHtml');
```

Options
-------

__`new_row_layouts`:__ set the column layouts that appear in the "new row" buttons at the top of the editor.<br>

```javascript
$('#myGrid').gridEditor({
    new_row_layouts: [[12], [6,6], [9,3]],
});
```

__`row_classes`:__ set the css classes that the user can toggle on the rows, under the settings button.<br>

```javascript
$('#myGrid').gridEditor({
    row_classes: [{'Example class', cssClass: 'example-class'}],
});
```

__`col_classes`:__ the same as row_classes, but for columns.

__`row_tools`:__ add extra tool button to the row toolbar.<br>

```javascript
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
```

__`col_tools`:__ the same as row_tools, but for columns.

__`col_min_size`:__ minimal size of a column (1-12)

__`col_stop_size`:__ steps when resizing a column (1-12)

Attribution
-----------

Grid Editor was heavily inspired by [Neokoenig's grid manager](https://github.com/neokoenig/jQuery-gridmanager)
