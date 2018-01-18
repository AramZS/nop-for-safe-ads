function DNTCompliance() {
	var newCookie = document.cookie;
	//var newLocalStorage = window.localStorage;
	//var newSessionStorage = window.sessionStorage;
	window.cookieChecker = false;
	//https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/cookies/onChanged
	if ((!document.hasOwnProperty('cookie')) || (document.hasOwnProperty('cookie') && Object.getOwnPropertyDescriptor(document, 'cookie').configurable)) {
		Object.defineProperty(
			document,
			"cookie", {
				set: function (val) {
					if (window.cookieChecker) {
						//newCookie = val;
					}
					console.log("NOPed on cookies", val);
					return true;
				},
				get: function () {
					if (window.cookieChecker) {
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
	} else if (typeof browser !== 'undefined' && typeof browser.cookies !== 'undefined') {
		browser.cookies.onChanged.addListener(function (changeInfo) {
			console.log('Cookie changed: ' +
				'\n * Cookie: ' + JSON.stringify(changeInfo.cookie) +
				'\n * Cause: ' + changeInfo.cause +
				'\n * Removed: ' + changeInfo.removed);
		});
	} else {
		window.setInterval(
			function () {
				if (document.cookie.length > 0) {
					console.log('kill cookie', document.cookie);
					var cookies = document.cookie.split(';');
					cookies.forEach(function (value, index, array) {
						var singleCookie = value.split('=');
						console.log('singleCookie', singleCookie[0]);
						document.cookie = encodeURIComponent(singleCookie[0]) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + "domain=" + location.origin.replace(/htt(p|ps):\/\//i, '') + "path=/";
					});
				}
			},
			120,
			true
		);
		console.log('No access to cookie property');
	}
	var _setItem = Storage.prototype.setItem;
	var _getItem = Storage.prototype.setItem;
	//https://stackoverflow.com/questions/13612643/is-it-possible-to-override-local-storage-and-session-storage-separately-in-html5
	Storage.prototype.setItem = function (key, val) {
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
	Storage.prototype.getItem = function (key) {
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

var DNT = "0";
if ((typeof navigator != 'undefined') && (typeof navigator.doNotTrack != 'undefined')) {
	if ("0" === navigator.doNotTrack || "1" === navigator.doNotTrack) {
		DNT = navigator.doNotTrack;
	}
}
// Try hijacking window.top or window.top.location ?
// convert to bool
DNT = !!+DNT;
if (DNT) {
	DNTCompliance();
}
