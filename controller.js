var app = angular.module("BE",[]);
var background = chrome.extension.getBackgroundPage();


app.controller("info",function($scope,$http){
	$scope.bol = {
		version:"",
		status:false
	}
	$http.get('https://raw.githubusercontent.com/thelaw44/BoL-Extenstion/master/status').
  	success(function(data, status, headers, config) {
		$scope.bol.version = data.version;
		$scope.bol.status = data.status;
  	}).
  	error(function(data, status, headers, config) {
	    console.log("Can't connect to Law's Github")
  	});
})

app.controller("fastss", function($scope,$http){
	$scope.champName = "";
	$scope.scriptList = [];
	$scope.$watch('champName', function(){
		$scope.scriptList = [];
		$http.get('http://www.scriptstatus.net/get-'+$scope.champName).
	  	success(function(data, status, headers, config) {
			if(data.indexOf("<tbody>")>0){
				var regex = /<tr id="tr-(.*?)"><td>(.*?)<\/td><td class="(.*?)">(.*?)<\/td><td class="name (.*?)">(.*?)<\/td><td>(.*?)<\/td><td>(.*?)<td>*/gi; 
				do {
				    m = regex.exec(data);
				    if (m) {
				    	console.log(m)
				    	var script = {
				        	type: m[4],
				        	name: m[6].substring(0, 40),
				        	status: m[5],
				        	link: "http://scriptstatus.net/goto-"+m[1],
				        	author: ""
				        }
				        if(m[7].indexOf("<a target=")>=0){
				        	script.author = m[7].split("-\">")[1].split("<")[0];
				        }else{
				        	script.author = m[8];
				        }
				        $scope.scriptList.push(script);
				    }
				} while (m);

			}
	  	}).
	  	error(function(data, status, headers, config) {
		    console.log("Can't connect to Script Status")
	  	});
	});
	$scope.open = function(link){
		background.popupNewTab(link)
	}
});

app.controller("settings",function($scope){
	$scope.settings = {
		github:background.settings.github,
		pastebin:background.settings.pastebin,
		openlink:background.settings.openlink,
		codebox:background.settings.codebox
	}
	$scope.set = function(option){
		$scope.settings[option] = !$scope.settings[option];
		background.updateSettings(option)
	}
});