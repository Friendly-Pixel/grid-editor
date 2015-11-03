(function() {

    $.fn.gridEditor.RTEs.summernote = {

        init: function(settings, contentAreas) {
            
            if (!jQuery().summernote) {
                console.error('Summernote not available! Make sure you loaded the Summernote js file.');
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
                        (settings.summernote && settings.summernote.config ? settings.summernote.config : {}),
                        {
                            tabsize: 2,
                            airMode: true,
                            oninit: function(editor) {
                                try {
                                    settings.summernote.config.oninit(editor);
                                } catch(e) {}
                                $('#'+editor.settings.id).focus();
                            }
                        }
                    );
                    var summernote = contentArea.summernote(configuration);
                }
            });
        },

        deinit: function(settings, contentAreas) {
            contentAreas.filter('.active').each(function() {
                var contentArea = $(this);
                var summernote = contentArea.summernote();
                if (summernote) {
                    summernote.destroy()
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
    }
})();
