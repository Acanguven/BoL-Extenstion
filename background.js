chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
	chrome.downloads.download({
	  url: message.url,
	  filename: message.url.replace(/^.*[\\\/]/, '')
	});
});

