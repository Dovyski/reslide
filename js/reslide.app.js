var Reslide = Reslide || {};

Reslide.app = new function() {
    this.start = function() {
        var aViewerId = Reslide.sync.getUrlParam('viewer');
        var aIsPresenter = aViewerId ? false : true;
        var aPresentationId = aIsPresenter ? Reslide.sync.getUrlParam('id') : aViewerId;

        Reslide.view.start(aIsPresenter, aPresentationId, '../data/test.pdf');

        if(aIsPresenter) {
            Reslide.sync.startWritingStream(aPresentationId, Reslide.view.handleWrite);
        } else {
            Reslide.sync.startReadingStream(aPresentationId, Reslide.view.handleRead);
        }
    };
};

$(function() {
    Reslide.app.start();
});
