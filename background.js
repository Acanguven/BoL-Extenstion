chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
	try{
		if (message.type == "gitHubRaw") {
			chrome.downloads.download({
			  url: message.url,
			  filename: decodeURI(message.url.replace(/^.*[\\\/]/, ''))
			});
		};
		if (message.type == "pastebinRaw") {
			chrome.downloads.download({
			  url: message.url,
			  filename: message.url.split("i=")[1]+".lua"
			});
		};
		if (message.type == "gitHubLink") {
			var urlLink = "https://raw.githubusercontent.com/" + message.url.replace("/blob", "").split("github.com/")[1];
			chrome.downloads.download({
			  url: urlLink,
			  filename: decodeURI(urlLink.replace(/^.*[\\\/]/, ''))
			});
		};
		if (message.type == "pastebinLink") {
			var test = /pastebin\.com\/(.*)/
			var urlLink = "http://pastebin.com/raw.php?i=" + message.url.match(test)[1];
			chrome.downloads.download({
			  url: urlLink,
			  filename: urlLink.split("i=")[1]+".lua"
			});
		};
	}catch(err){alert("Bot of Legends Helper Error:" + error)}
});