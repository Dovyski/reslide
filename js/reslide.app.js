var Reslide = Reslide || {};

Reslide.app = new function() {
    this.start = function() {
        var aPresentationId = Reslide.sync.getUrlParam('id');
        var aPresenterId = Reslide.sync.getUrlParam('presenter');
        var aIsPresenter = aPresenterId !== undefined;

        Reslide.view.start(aIsPresenter, aPresentationId, '../api/?method=content&id=' + aPresentationId);

        if(aIsPresenter) {
            Reslide.sync.startWritingStream(aPresentationId, aPresenterId, Reslide.view.handleWrite);
        } else {
            Reslide.sync.startReadingStream(aPresentationId, Reslide.view.handleRead);
        }
    };
};

$(function() {
    Reslide.app.start();
});
