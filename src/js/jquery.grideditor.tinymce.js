(function() {
    $.fn.gridEditor.RTEs.tinymce = {
        init: function(settings, contentAreas) {
            if (!window.tinymce) {
                console.error('tinyMCE not available! Make sure you loaded the tinyMCE js file.');
            }
            if (!contentAreas.tinymce) {
                console.error('tinyMCE jquery integration not available! Make sure you loaded the jquery integration plugin.');
            }
            var self = this;
            contentAreas.each(function() {
                var contentArea = $(this);
                if (!contentArea.hasClass('active')) {
                    if (contentArea.html() == self.initialContent) {
                        contentArea.html('');
                    }
                    contentArea.addClass('active');
                    var configuration = $.extend(
                        (settings.tinymce && settings.tinymce.config ? settings.tinymce.config : {}),
                        {
                            inline: true,
                            oninit: function(editor) {
                                try {
                                    settings.tinymce.config.oninit(editor);
                                } catch(e) {}
                                // Bring focus to text field
                                $('#' + editor.settings.id).focus();
                            }
                        }
                    );
                    var tiny = contentArea.tinymce(configuration);
                }
            });
        },

        deinit: function(settings, contentAreas) {
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
        },

        initialContent: '<p>Lorem ipsum dolores</p>',
    };
})();
