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
			links[i].insertAdjacentHTML('beforebegin','<div class="dlhelper" dltype="'+testCases[x].name+'" dllink="'+links[i].href+'"><img src="https://raw.githubusercontent.com/thelaw44/BoL-Extenstion/master/arrow_animate.gif">&nbsp;&nbsp;&nbsp;Bot of Legends Helper: <span>Download Script('+decodeURI(links[i].href.replace(/^.*[\\\/]/, ''))+')</span> Or <span>Open Link ('+decodeURI(links[i].href.replace(/^.*[\\\/]/, ''))+')</span></div>');
			links[i].style.display = 'none';
			array.push(links[i]);
		}
	}	
}



for(var x = 0; x < array.length; x++){
	var h3Obj = array[x].previousElementSibling
	h3Obj.childNodes[2].addEventListener("click", function(event){
		dl(this.parentNode)
	});
	h3Obj.childNodes[4].addEventListener("click", function(event){
		var win = window.open(this.parentNode.getAttribute("dllink"), '_blank');
  		win.focus();
	});
}


for(var x = 0; x < document.getElementsByClassName("prettyprint").length; x++){
	document.getElementsByClassName("prettyprint")[x].innerHTML = "<button>Download this code with Bot Of Legends Helper</button></br>" + document.getElementsByClassName("prettyprint")[x].innerHTML;
	document.getElementsByClassName("prettyprint")[x].firstChild.addEventListener("click",function(event){
		var lua = this.parentNode.innerHTML.split("</button>")[1].replace(/<[^>]*>/g, "");
		createLua(lua);
	});
}




function dl(obj,type){
	chrome.runtime.sendMessage({action:"download",url:obj.getAttribute("dllink"),type:obj.getAttribute("dltype")});
}

function createLua(lua){
	chrome.runtime.sendMessage({action:"create",code:lua});
}