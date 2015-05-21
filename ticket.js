$("#primary_nav .left").last().parent().append('<li class="left"><a href="http://forum.botoflegends.com/index.php?app=core&module=usercp&liveticketchat=1" target="_new">Live Ticket & Chat</a></li>')
if(top.location.href == "http://forum.botoflegends.com/index.php?app=core&module=usercp&liveticketchat=1"){
	clearTicketPage()
}
window.WebSocket = window.WebSocket || window.MozWebSocket;
var connection = new WebSocket('ws://acanguven.koding.io:805');

var user = {
	mod: false,
	name: false
}
var _t;
var liveContainer = "<div class='liveticketcontainer'></div>";
var ticketList = 
connection.onopen = function () {
    if(top.location.href == "http://forum.botoflegends.com/index.php?app=core&module=usercp&liveticketchat=1"){
    	clearTicketPage();
		auth();
	}
};

connection.onmessage = function (message) {
	var msg = JSON.parse(message.data)
    switch(msg.type){
    	case "auth":
    		user.name = msg.data.name
    		user.mod = msg.data.mod
    		buildTicketPage();
    	break;
    	case "filter":
    		var ticketList = msg.data
    		updateList(msg.data)
    	break;
    }
};

function clearTicketPage(){
	$("#userCPForm").css("position","absolute").css("opacity","0");
	$("#secondary_navigation").remove();
	$("#footer_utilities").remove();	
	$("#content br:eq(0)").remove();
	$(liveContainer).insertAfter("noscript:eq(0)");	
	$(".liveticketcontainer").html("Connecting to live system...");
}

function buildTicketPage(){
	$(".liveticketcontainer").html('<div style="height:20px;"><div style="float:left;">Language selection : <select id="language"><option value="EN">English</option><option value="KR">Korean</option><option value="FR">French</option><option value="SP">Spanish</option><option value="GR">German</option><option value="TR" selected>Türkçe</option><option value="CN">Chinese</option><option value="PG">Portuguese</option></select></div><div style="float:right;">The Law<span id="modAccess"></span></div></div><hr style="display:block;width:100%;"><div id="liveContent"></div>');
	if(user.mod){
		$("#modAccess").html(" - Moderator Access Granted");
	}
	if(user.mod){
		$("#liveContent").html('<div class="modTicketList"><div class="modTicketFilter"><div><input type="text" id="filterText"> filter by <select id="filterBy"><option value="creator">Creator</option><option value="topic">Topic</option><option value="description">Description</option></select></div><div>Filter by status: <input type="radio" name="sol" value="1">Solved</input><input name="sol" type="radio" value="0" checked>Open</input></div></div><div class="ticketList"><ul id="ticketUl"></ul></div></div>')
	}
	$("#liveContent").append('<div class="ticketChat"></div>')
	updateFilter();
}

function auth(callback){
	$.ajax({
		url: "http://forum.botoflegends.com/index.php?app=core&module=modcp",
		dataType:"text"
	}).done(function(data) {
		connection.send(JSON.stringify({type:"auth",data:data}));
	});
}

function updateFilter(){
	var filterText = document.getElementById("filterText").value;
	var filterTextBy = document.getElementById("filterBy").value;
	var filtStatus = $('input[name="sol"]:checked').val();
	connection.send(JSON.stringify({type:"filter",filterText:filterText,filterTextBy:filterTextBy,filtStatus:filtStatus,lang:$("#language").val()}))
}

function updateList(ticket){
	var list = "";
	for(var x = 0; x < ticket.length; x++){
		list += "<li class='ticketLi' tid='"+x+"'>"+ticket[x].topic+"</li>"
	}
	$("#ticketUl").html(list)

	$(".ticketLi").click(function(){
		loadTicketChat(ticket[$(this).attr("tid")]);
	});
}

function loadTicketChat(ticket){
	$(".ticketChat").empty();
	$(".ticketChat").append('<div class="ticketDesc"><div style="height:30px;"><div class="hd">'+ticket.topic+'</div><div class="hc">Ticket Creator: '+ticket.creator+'</div></div><div><textarea disabled=disabled>'+ticket.description+'</textarea></div></div>')
	$(".ticketChat").append('<div class="chatArea"><ul></ul></div><div class="typeArea"><textarea class="inputIn"></textarea><button>Send</button></div>');
	for(var x = 0; x < ticket.chat.length; x++){
		$(".chatArea ul").append('<li class="chatMsg"><p>'+chat[x].text+'</p><div>'+chat[x].author+'</div></li>')
	}
}