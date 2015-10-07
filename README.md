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

__`getHtml`:__ Returns the clean html.

```javascript
var html = $('#myGrid').gridEditor('getHtml');
```

Options
-------

__`new_row_layouts`:__ Set the column layouts that appear in the "new row" buttons at the top of the editor.

```javascript
$('#myGrid').gridEditor({
    new_row_layouts: [[12], [6,6], [9,3]],
});
```

__`row_classes`:__ Set the css classes that the user can toggle on the rows, under the settings button.

```javascript
$('#myGrid').gridEditor({
    row_classes: [{'Example class', cssClass: 'example-class'}],
});
```

__`col_classes`:__ The same as row_classes, but for columns.

__`row_tools`:__ Add extra tool button to the row toolbar.

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

__`col_tools`:__ The same as row_tools, but for columns.

__`custom_filter`:__ Allows the execution of a custom function before initialization and after de-initialization. Accepts a functions or a function name as string.
Gives the `canvas` element and `isInit` (true/false) as parameter.

```javascript
$('#myGrid').gridEditor({
    'custom_filter': 'functionname',
});

function functionname(canvas, isInit) {
    if(isInit) {
        // do magic on init
    } else {
        // do magic on de-init
    }
}
```

or

```javascript
$('#myGrid').gridEditor({
    'custom_filter': function(canvas, isInit) {
        //...
    },
});
```


__`valid_col_sizes`:__ Specify the column widths that can be selected using the +/- buttons

```javascript
$('#myGrid').gridEditor({
    'valid_col_sizes': [2, 5, 8, 10],
});
```

Attribution
-----------

Grid Editor was heavily inspired by [Neokoenig's grid manager](https://github.com/neokoenig/jQuery-gridmanager)
