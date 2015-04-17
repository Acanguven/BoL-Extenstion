var app = angular.module("BE",[]);
var background = chrome.extension.getBackgroundPage();

app.controller("settings",function($scope){
	$scope.inside = "Working"
});