console.log(chrome)
var array = [];
var links = document.getElementsByTagName("a");
for(var i=0; i<links.length; i++) {
	if ((links[i].href.substr((~-links[i].href.lastIndexOf(".") >>> 0) + 2)).toLowerCase().indexOf("lua") == 0){
		links[i].insertAdjacentHTML('beforebegin','<h3 dllink='+links[i].href+' style="background-color:beige;color:brown;fontSize:30px;cursor:pointer;">Bot of Legends Helper: Download Script('+links[i].href.replace(/^.*[\\\/]/, '')+')</h3>');
		links[i].style.display = 'none';
		array.push(links[i]);
	}
}

for(var x = 0; x < array.length; x++){
	var h3Obj = array[x].previousElementSibling
	h3Obj.addEventListener("click", function(event){
		dl(this)
	});
}

function dl(obj){
	chrome.runtime.sendMessage({url:obj.getAttribute("dllink")});
}