
angular.module('ContentApp.services').factory('LoadingDialogService', ['$modal', '$timeout', function ($modal, $timeout) {
    var theTimerInstance = undefined;
    var theStandbyDialogInstance = undefined;
    var standbyDialogGetCounter = 0;

    var timeoutCloseInstance = undefined;

    var openTimeout = 500;//ms
        var closeTimeout = 100;//ms



    function open() {
        standbyDialogGetCounter++;

        if (timeoutCloseInstance) {
            $timeout.cancel(timeoutCloseInstance);
            timeoutCloseInstance = undefined;
        }
        else if (standbyDialogGetCounter == 1) {
            theTimerInstance = $timeout(function () {
                theStandbyDialogInstance = $modal.open({
                    template:
                    '<div class=\"LoadingDialog\">' +
                    '<img src=\"images/loading.gif\">' +
                    '<p>Bitte warten...</p>' +
                    '</div>',
                    controller: 'ModalLoadingInstanceCtrl',
                    size: 'sm',
                    backdrop: 'static',
                    keyboard: false
                });
            }, openTimeout);
        }
    }
    function close() {
        if (standbyDialogGetCounter-- == 1) {
            timeoutCloseInstance = $timeout(function () {
                $timeout.cancel(theTimerInstance);
                timeoutCloseInstance = undefined;
                if (theStandbyDialogInstance !== undefined) {
                    theStandbyDialogInstance.close();
                    theStandbyDialogInstance=undefined;
                }
            }, closeTimeout)
        }
    }

    return {
        open: function () {
            open();
        },
        close: function () {
            close();
        }
    };

}]);
