var testCases = [
	{
		name:"pastebinRaw",
		test:/pastebin\.com\/raw.php\?i=(.*)/
	},
	{
		name:"pastebinLink",
		test:/pastebin\.com\/((?!raw).*)/
	},
	{
		name:"gitHubLink",
		test:/github\.com\/(.*)\.lua/
	},
	{
		name:"gitHubRaw",
		test:/githubusercontent\.com\/(.*)\.lua/
	}
];


var array = [];
var links = document.getElementsByTagName("a");

for(var i=0; i<links.length; i++) {
	for(var x = 0; x < testCases.length; x++){
		if(links[i].href.match(testCases[x].test)){
			links[i].insertAdjacentHTML('beforebegin','<div class="dlhelper" dltype="'+testCases[x].name+'" dllink="'+links[i].href+'"><img src="https://raw.githubusercontent.com/thelaw44/BoL-Extenstion/master/arrow_animate.gif">&nbsp;&nbsp;&nbsp;Bot of Legends Helper: <span>Download Script('+decodeURI(links[i].href.replace(/^.*[\\\/]/, ''))+')</span></div>');
			links[i].style.display = 'none';
			array.push(links[i]);
		}
	}	
}

for(var x = 0; x < array.length; x++){
	var h3Obj = array[x].previousElementSibling
	h3Obj.addEventListener("click", function(event){
		dl(this)
	});
}

function dl(obj,type){
	chrome.runtime.sendMessage({url:obj.getAttribute("dllink"),type:obj.getAttribute("dltype")});
}