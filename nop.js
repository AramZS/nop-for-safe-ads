var MAXIMUM_INTERVAL = (1000 * 60) * 2;

function activateBodyNOPs() {
	console.log('Activate NOPs');
	if (Object.getOwnPropertyDescriptor(document.documentElement.style, 'overflow').configurable) {
		//document.documentElement.style = document.documentElement.style || {}; document.documentElement.style.overflow = "auto";
		Object.defineProperty(
			document.documentElement.style,
			"overflow", {
				set: function (val) {
					console.log("NOPed on style overflow", val);
					return true;
				},
				get: function () {
					return 'auto';
				},
				//writable: false,
				configurable: false,
				enumerable: true,
				//value: 'auto'
			}
		);

		Object.freeze(document.documentElement.style.overflow);
	} else {
		// Safari won't let us freeze this property properly.
		// We will instead brute force a lock on this style.
		console.log("nop", "Can't freeze documentElement style", "");
		window.setInterval(
			function () {
				document.documentElement.style.overflow = 'auto';
			},
			60,
			true
		);
	}
	//Object.freeze(document.documentElement.style); document.getElementsByTagName('body')[0].style.overflow = "auto";
	/**
	document.getElementsByTagName('body')[0].style = document.getElementsByTagName('body')[0].style || {};
	Object.defineProperty(
		document.getElementsByTagName('body')[0].style,
		"overflow", {
			set: function(val){
				console.log("nop", "NOPed on style overflow", val);
				return true;
			},
			get: function(){
				return 'auto';
			},
			//writable: false,
			configurable: false,
			enumerable: true,
			//value: 'auto'
		}
	);
	Object.freeze(document.getElementsByTagName('body')[0].style);
	**/
	//document.body.style = document.body.style || {};
	if (document.body.hasOwnProperty('style') && Object.getOwnPropertyDescriptor(document.body.style, 'overflow').configurable) {
		console.log('Overwrite body style overflow');
		Object.defineProperty(
			document.body.style,
			"overflow", {
				set: function (val) {
					console.log("nop", "NOPed on style overflow", val);
					return true;
				},
				get: function () {
					return 'auto';
				},
				//writable: false,
				configurable: false,
				enumerable: true,
				//value: 'auto'
			}
		);
	} else if ('MutationObserver' in window) {
		console.log('Enforce overflow with Mutation Observer');
		var observer = new MutationObserver(function (mutations) {
			mutations.forEach(function (mutationRecord) {
				console.log('style changed!', mutationRecord);
				if (document.body.style.overflow !== 'auto') {
					document.body.style.overflow = 'auto';
				}
			});
		});

		observer.observe(document.body, {
			attributes: true,
			attributeFilter: ['style']
		});

	} else {
		// Safari won't let us freeze this property properly.
		// We will instead brute force a lock on this style.
		console.log("nop", "Can't freeze document body style", "");
		window.setInterval(
			function () {
				document.body.style.overflow = 'auto';
			},
			60,
			true
		);
	}
}

var setIntervalOrig = window.setInterval;
window.setInterval = function (callback, intervalTime, override) {
	var intervalID = setIntervalOrig(callback, intervalTime);
	if (typeof override === 'undefined' || !override) {
		window.setTimeout(function () {
			window.clearInterval(intervalID);
			console.log('setInterval maximum of ' + MAXIMUM_INTERVAL + ' reached on interval ID:', intervalID);
		}, MAXIMUM_INTERVAL);
	}
	return intervalID;
}
