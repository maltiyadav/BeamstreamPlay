/*
 * function startChat(){ var setNameOfUser="1"; var chatSocket = new
 * WebSocket('ws://localhost:9000/chat') var sendMessage = function() {
 * chatSocket.send(JSON.stringify( {text: $("#talkNow").val()} ))
 * $("#talkNow").val('') }
 * 
 * var receiveEvent = function(event) { $("#chatbox").css("display", "block");
 * $("#chatbox").css("position", "fixed"); $("#chatbox").css("bottom", "0");
 * $("#chatbox").css("right", "650");
 * 
 * 
 * var data = JSON.parse(event.data)
 * 
 * if(setNameOfUser=="1") { $("#friend").text(data.user) setNameOfUser="0" } //
 * Handle errors if(data.error) { chatSocket.close() $("#onError
 * span").text(data.error) $("#onError").show() return } else {
 * $("#onChat").show() }
 *  // Create the message element var el = $('<div class="message"><span></span><p></p></div>')
 * $("span", el).text(data.user) $("p", el).text(data.message)
 * $(el).addClass(data.kind) $('.messages').append(el)
 *  }
 * 
 * var handleReturnKey = function(e) { if(e.charCode == 13 || e.keyCode == 13) {
 * e.preventDefault() sendMessage() } }
 * 
 * $("#talkNow").keypress(handleReturnKey)
 * 
 * chatSocket.onmessage = receiveEvent }
 */

function startChat() {
	var oldChatSocket = new WebSocket('ws://localhost:9000/chat')
	//$(".chatbox").css("display", "block");
	var oldId = randomString(8);
	$(".chatbox")
			.append(
					"<div id="
							+ oldId
							+ ">"
							/*+'<div class="chatbox-header">'
			                +'<h1 id="friend"></h1>'

			                +'<div class="exit"></div>'

			                +'<div class="addfriends-btn"><a href="#"></a></div>'
			            +'</div>' 


			            +'<div class="chatbox-body">'
			                +'<div class="chatbox-content">'


			               +'<div class="chat-feed" id="main">'
			                +'        <div class="messages"></div>'
			                    +'</div>' 
			                  
			                  
			                  
			                +'</div>'

			                +'<div class="left-border"></div>'
			                +'<div class="right-border"></div>'
			            +'</div>' 
			            +'<div class="chatbox-footer">'
			                +'<div class="my-avatar"></div>'
			                    +'<textarea id="talkNow" name="styled-textarea" class="message" placeholder="Type message here...">'
			                    +'</textarea>'
			                    +'<p>Press enter to submit message</p>'*/
							+ '<div class="chatbox-header">'

							+ '<h1 class="friend"></h1>'

							+ '<div class="exit"></div>'

							+ '<div class="addfriends-btn"><a href="#"></a></div>'
							+ '</div>'

							+ '<div class="chatbox-body">'
							+ '<div class="chatbox-content">'

							+ '<div class="chat-feed" id="main">'
							+ '<div id="messages"></div>'
							+ '</div>'

							+ '</div>'

							+ '<div class="left-border"></div>'
							+ '<div class="right-border"></div>'
							+ '</div>'
							+ '<div class="chatbox-footer">'
							+ '<div class="my-avatar"></div>'
							+ '<textarea id="talk" name="styled-textarea" class="message" placeholder="Type message here...">'
							+ '</textarea>'
							+ '<p>Press enter to submit message</p>' + '</div>'
							+ '</div>');

	
	var oldSendMessage = function() {
		oldChatSocket.send(JSON.stringify({
			text : $("#" + oldId + " " + "textarea#talk").val()
		}))
		$("div#" + oldId + " " + "textarea#talk").val('')
	}

	var oldReceiveEvent = function(event) {
		var data = JSON.parse(event.data)
		var setNameOfUser="1";
		$(".chatbox").css("display", "block");
		if(setNameOfUser=="1") {
			$("#" + oldId + " " + "div#chatbox-header h1.friend").text(data.user); 
			setNameOfUser="0"
				}
		
		// alert(data.user +","+data.message+","+data.kind) // Handle errors
		if (data.error) {
			oldChatSocket.close()
			$("#onError span").text(data.error)
			$("#onError").show()
			return

		} else {
			$("#onChat").show()
		}

		// Create the message element
		var el = $('<div class="message"><span></span><p></p></div>')
		$("span", el).text(data.user)
		$("p", el).text(data.message)
		$(el).addClass(data.kind)
		$("#" + oldId + " " + "div#messages").append(el)

	}

	var newHandleReturnKey = function(e) {
		if (e.charCode == 13 || e.keyCode == 13) {
			e.preventDefault()
			oldSendMessage()
		}
	}

	$("#" + oldId + " " + "textarea#talk").keypress(newHandleReturnKey)

	oldChatSocket.onmessage = oldReceiveEvent

}


function popit(userId, toWhom, name, profileImageUrl) {
	var newChatSocket = new WebSocket('ws://localhost:9000/startChat/' + userId+ "/" + toWhom)
	var itsId = randomString(8);
	$(".chatbox")
			.append(
					"<div id="+ itsId+ ">"
							+ '<div class="chatbox-header">'

							+ '<h1 class="friend"></h1>'

							+ '<div class="exit"></div>'

							+ '<div class="addfriends-btn"><a href="#"></a></div>'
							+ '</div>'

							+ '<div class="chatbox-body">'
							+ '<div class="chatbox-content">'

							+ '<div class="chat-feed" id="main">'
							+ '<div id="messages"></div>'
							+ '</div>'

							+ '</div>'

							+ '<div class="left-border"></div>'
							+ '<div class="right-border"></div>'
							+ '</div>'
							+ '<div class="chatbox-footer">'
							+ '<div class="my-avatar"></div>'
							+ '<textarea id="talk" name="styled-textarea" class="message" placeholder="Type message here...">'
							+ '</textarea>'
							+ '<p>Press enter to submit message</p>' + '</div>'
							+ '</div>');
	$("div#" + itsId + " " + "h1.friend").text(name);
	$(".chatbox").css("display", "block");
	$(".chatbox #"+itsId).css("position", "absolute");
	$(".chatbox #"+itsId).css("bottom", "0");
	$(".chatbox #"+itsId).css("right", "333");
	var newSendMessage = function() {
		newChatSocket.send(JSON.stringify({
			text : $("#" + itsId + " " + "textarea#talk").val()
		}))
		$("div#" + itsId + " " + "textarea#talk").val('')
	}

	var newReceiveEvent = function(event) {
		var data = JSON.parse(event.data)
		// alert(data.user +","+data.message+","+data.kind) // Handle errors
		if (data.error) {
			newChatSocket.close()
			$("#onError span").text(data.error)
			$("#onError").show()
			return

		} else {
			$("#onChat").show()
		}

		// Create the message element
		var el = $('<div class="message"><span></span><p></p></div>')
		$("span", el).text(data.user)
		$("p", el).text(data.message)
		$(el).addClass(data.kind)
		$("#" + itsId + " " + "div#messages").append(el)

	}

	var newHandleReturnKey = function(e) {
		if (e.charCode == 13 || e.keyCode == 13) {
			e.preventDefault()
			newSendMessage()
		}
	}
	$("#" + itsId + " " + "textarea#talk").keypress(newHandleReturnKey)

	newChatSocket.onmessage = newReceiveEvent
    
}