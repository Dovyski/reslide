var Reslide = Reslide || {};

Reslide.sync = new function() {
    this.intervalId = null;
    this.callback = null;
    this.callbackContext = null;

    // Source: https://stackoverflow.com/a/21903119/29827
    this.getUrlParam = function(theParam) {
        var aPageURL = decodeURIComponent(window.location.search.substring(1)),
            aURLVariables = aPageURL.split('&'),
            aParameterName,
            i;

        for (i = 0; i < aURLVariables.length; i++) {
            aParameterName = aURLVariables[i].split('=');

            if (aParameterName[0] === theParam) {
                return aParameterName[1] === undefined ? true : aParameterName[1];
            }
        }
    };

    this.onSuccess = function(theData) {
        //console.debug('Reslide.sync.onSuccess()', theData);

        if(Reslide.sync.callback) {
            Reslide.sync.callback.call(Reslide.sync.callbackContext, theData);
        }
    };

    this.onFail = function(theJqXHR, theTextStatus, theErrorThrown) {
        console.error('Reslide.sync.onFail()', theErrorThrown);
    };

    this.doAjax = function(theData) {
        $.ajax({
            url: '../api/',
            data: theData,
            dataType: 'json'
        }).done(Reslide.sync.onSuccess).fail(Reslide.sync.onFail);
    };

    this.write = function() {
        Reslide.sync.doAjax({method: 'write', id: Reslide.sync.getUrlParam('id')});
    };

    this.read = function() {
        Reslide.sync.doAjax({method: 'read', id: Reslide.sync.getUrlParam('id')});
    };

    this.startStream = function(theStreamFunction, theCallback, theCallbackContext) {
        this.callback = theCallback;
        this.callbackContext = theCallbackContext;
        this.intervalId = setInterval(theStreamFunction, 1000);
    }

    this.startReadingStream = function(theCallback, theCallbackContext) {
        this.startStream(this.read, theCallback, theCallbackContext);
    };

    this.startWritingStream = function() {
        this.startStream(this.write, theCallback, theCallbackContext);
    };
};
