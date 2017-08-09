var Reslide = Reslide || {};

Reslide.view = new function() {
    this.PENDING_RENDER_INTERVAL_MILLISECONDS = 500;

    this.presenterMode = true;
    this.presentationId = null;
    this.pdfDoc = null;
    this.canvas = null;
    this.canvasContext = null;
    this.pageNum = 1,
    this.pageRendering = false,
    this.pagesPending = [],
    this.loading = true;

    this.config = {
        scale: 2.0
    };

    this.init = function() {
        //PDFJS.workerSrc = '//mozilla.github.io/pdf.js/build/pdf.worker.js';
        this.canvas = document.getElementById('the-canvas'),
        this.canvasContext = this.canvas.getContext('2d');

        document.getElementById('prev').addEventListener('click', this.onPrevPage);
        document.getElementById('next').addEventListener('click', this.onNextPage);

        // Listen to arrow keys
        $(document).keydown(function(e) {
            switch(e.which) {
                case 37: Reslide.view.onPrevPage(); break; // left arrow
                case 39: Reslide.view.onNextPage(); break; // right arrow
            }
        });
    };

    this.message = function(theMessage) {
        $('#general-message').html(theMessage).show();
    }

    this.handleRead = function(theResponse) {
        if(theResponse.success) {
            Reslide.view.setPage(theResponse.data.slide);
        } else {
            Reslide.view.message(theResponse.message);
            console.warn('handleRead() problem', theResponse.message);
        }
    };

    // Source: https://stackoverflow.com/a/25279340/29827
    this.formatTimeFromSeconds = function(theSeconds) {
        var aDate = new Date(null);
        aDate.setSeconds(theSeconds);

        return aDate.toISOString().substr(11, 8);
    }

    this.handleWrite = function(theResponse) {
        if(theResponse.success) {
            var aViewerDelay = theResponse.data.viewer_delay;
            $('#viewer_delay').html(Reslide.view.formatTimeFromSeconds(aViewerDelay));
        } else {
            Reslide.view.message(theResponse.message);
            console.warn('handleWrite() problem');
        }
    };

    /**
     * Get page info from document, resize canvas accordingly, and render page.
     * @param num Page number.
     */
    this.renderPage = function(num) {
        if(Reslide.view.loading) {
            return;
        }

        if(Reslide.view.pageRendering) {
            Reslide.view.pagesPending.push(num);
            return;
        }

        Reslide.view.pageRendering = true;

        this.pdfDoc.getPage(num).then(function(page) {
            var viewport = page.getViewport(Reslide.view.config.scale);

            Reslide.view.canvas.height = viewport.height;
            Reslide.view.canvas.width = viewport.width;

            // Render PDF page into canvas context
            var renderContext = {
                canvasContext: Reslide.view.canvasContext,
                viewport: viewport
            };

            var renderTask = page.render(renderContext);

            // Wait for rendering to finish
            renderTask.promise.then(function() {
                Reslide.view.pageRendering = false;
            });
        });

        // Update page counters
        document.getElementById('page_num').textContent = Reslide.view.pageNum;
    };

    this.setPage = function(thePageNum) {
        if(!Reslide.view.pdfDoc || thePageNum > Reslide.view.pdfDoc.numPages || thePageNum < 1 || Reslide.view.pageNum == thePageNum) {
            return;
        }
        Reslide.view.pageNum = thePageNum;
        Reslide.view.renderPage(Reslide.view.pageNum);
    }

    /**
     * Displays previous page.
     */
    this.onPrevPage = function() {
        Reslide.view.setPage(Reslide.view.pageNum - 1);

        if(Reslide.view.presenterMode) {
            Reslide.sync.write(Reslide.view.pageNum);
        }
    };

    /**
     * Displays next page.
     */
    this.onNextPage = function() {
        Reslide.view.setPage(Reslide.view.pageNum + 1);

        if(Reslide.view.presenterMode) {
            Reslide.sync.write(Reslide.view.pageNum);
        }
    };

    this.load = function(theURL) {
        console.debug('Starting to load: ', theURL);
        Reslide.view.loading = true;

        PDFJS.getDocument(theURL).then(function(pdfDoc_) {
            console.debug('Finished loading!');

            $('#general-message').hide();
            if(Reslide.view.presenterMode) {
                $('#presenter-stuff').show();
            } else {
                $('#control-panel').hide();
            }

            Reslide.view.loading = false;
            Reslide.view.pdfDoc = pdfDoc_;

            document.getElementById('page_count').textContent = Reslide.view.pdfDoc.numPages;

            // Initial/first page rendering
            Reslide.view.renderPage(Reslide.view.pageNum);
            Reslide.view.processPendingRendering();
        });
    };

    this.processPendingRendering = function() {
        window.setTimeout(Reslide.view.processPendingRendering, Reslide.view.PENDING_RENDER_INTERVAL_MILLISECONDS);

        if(Reslide.view.pageRendering || Reslide.view.pagesPending.length == 0) {
            // Rendering in progress or nothing to render
            return;
        }

        var aLast = Reslide.view.pagesPending[Reslide.view.pagesPending.length - 1];
        Reslide.view.pagesPending.splice(0);

        Reslide.view.renderPage(aLast);
    };

    this.start = function(thePresenterMode, theId, theFileURL) {
        console.log('Reslide.view.start() - ', thePresenterMode ? 'PRESENTER MODE' : 'VIEWER MODE');

        Reslide.view.presenterMode = thePresenterMode;
        Reslide.view.presentationId = theId;

        $('#general-message').html('Loading presentation, please wait.');

        if(thePresenterMode) {
            $('#viewer_url').html('<a href="./?id=' + theId + '">this link</a>');
        }

        Reslide.view.init();
        Reslide.view.load(theFileURL);
    };
};
