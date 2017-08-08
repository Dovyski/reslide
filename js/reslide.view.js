var Reslide = Reslide || {};

Reslide.view = new function() {
    this.pdfDoc = null;
    this.canvas = null;
    this.canvasContext = null;
    this.pageNum = 1,
    this.pageRendering = false,
    this.pageNumPending = null,
    this.loading = true;

    this.config = {
        url: '../data/test.pdf',
        scale: 2.0
    };

    this.init = function() {
        //PDFJS.workerSrc = '//mozilla.github.io/pdf.js/build/pdf.worker.js';
        this.canvas = document.getElementById('the-canvas'),
        this.canvasContext = this.canvas.getContext('2d');

        document.getElementById('prev').addEventListener('click', this.onPrevPage);
        document.getElementById('next').addEventListener('click', this.onNextPage);
    };

    this.handleRead = function(theData) {
        if(theData.success) {
            // TODO: hide loading message
            Reslide.view.setPage(theData.data.slide);
        } else {
            // TODO: react to error
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

                if (Reslide.view.pageNumPending !== null) {
                    // New page rendering is pending
                    Reslide.view.renderPage(Reslide.view.pageNumPending);
                }
            });
        });

        // Update page counters
        document.getElementById('page_num').textContent = Reslide.view.pageNum;
    };

    /**
     * If another page rendering in progress, waits until the rendering is
     * finised. Otherwise, executes rendering immediately.
     */
    this.queueRenderPage = function(num) {
        if (Reslide.view.pageRendering) {
            Reslide.view.pageNumPending = num;
        } else {
            Reslide.view.renderPage(num);
        }
    };

    this.setPage = function(thePageNum) {
        Reslide.view.pageNum = thePageNum;
        Reslide.view.queueRenderPage(Reslide.view.pageNum);
    }

    /**
     * Displays previous page.
     */
    this.onPrevPage = function() {
        if(!Reslide.view.pdfDoc || Reslide.view.pageNum <= 1) {
            return;
        }
        Reslide.view.pageNum--;
        Reslide.view.queueRenderPage(Reslide.view.pageNum);
    };

    /**
     * Displays next page.
     */
    this.onNextPage = function() {
        if(!Reslide.view.pdfDoc || Reslide.view.pageNum >= Reslide.view.pdfDoc.numPages) {
            return;
        }

        Reslide.view.pageNum++;
        Reslide.view.queueRenderPage(Reslide.view.pageNum);
    };

    this.load = function() {
        console.debug('Starting to load: ', Reslide.view.config.url);
        Reslide.view.loading = true;

        PDFJS.getDocument(Reslide.view.config.url).then(function(pdfDoc_) {
            console.debug('Finished loading!');
            Reslide.view.loading = false;
            Reslide.view.pdfDoc = pdfDoc_;

            document.getElementById('page_count').textContent = Reslide.view.pdfDoc.numPages;

            // Initial/first page rendering
            Reslide.view.renderPage(Reslide.view.pageNum);
        });
    };

    this.start = function() {
        Reslide.view.init();
        Reslide.view.load();
    };
};
