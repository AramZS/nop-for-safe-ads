var DNT = "0";
if ((typeof navigator != 'undefined') && (typeof navigator.doNotTrack != 'undefined')){
    if ( "0" === navigator.doNotTrack || "1" === navigator.doNotTrack ){
        DNT = navigator.doNotTrack;
    }
}
// convert to bool
DNT = !!+DNT;
if (DNT){
    var newCookie = document.cookie;
    //var newLocalStorage = window.localStorage;
    //var newSessionStorage = window.sessionStorage;
    window.cookieChecker = false;
    Object.defineProperty(
        document,
        "cookie", {
            set: function(val){
                if (window.cookieChecker){
                    //newCookie = val;
                }
                console.log("NOPed on cookies", val);
                return true;
            },
            get: function(){
                if (window.cookieChecker){
                    //return newCookie;
                }
                return '';
            },
            //writable: false,
            configurable: false,
            enumerable: true,
            //value: 'auto'
        }
    );
    var _setItem = Storage.prototype.setItem;
    var _getItem = Storage.prototype.setItem;
    //https://stackoverflow.com/questions/13612643/is-it-possible-to-override-local-storage-and-session-storage-separately-in-html5
    Storage.prototype.setItem = function(key, val) {
        if (!window.cookieChecker && this === window.localStorage) {
             // do what you want if setItem is called on localStorage
             console.log("NOPed on localStorage", val);
        } else if (!window.cookieChecker && this === window.sessionStorage) {
            // do what you want if setItem is called on sessionStorage
            console.log("NOPed on sessionStorage", val);
        } else {
             // fallback to default action
             _setItem.apply(this, arguments);
        }
    }
    Storage.prototype.getItem = function(key) {
        if (!window.cookieChecker && this === window.localStorage) {
             // do what you want if setItem is called on localStorage
             console.log("NOPed on localStorage", key);
        } else if (!window.cookieChecker && this === window.sessionStorage) {
            // do what you want if setItem is called on sessionStorage
            console.log("NOPed on sessionStorage", key);
        } else {
             // fallback to default action
             _getItem.apply(this, arguments);
        }
    }
}
