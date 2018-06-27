/**
 * @module Collaborative
 */

/**
 * Chat window view
 * @class ChatWindowView
 * @extends Backbone.View
 */

define([], function() {"use strict";
	return Backbone.View.extend({
		/**
		 * Element: #chat
		 * @property el
		 * @type Dom Object
		 */
		el : document.getElementById("chat"),

		events : {
			/**
			 * Calls sendMessage()
			 * @event submit #chat-form
			 */
			"submit #chat-form" : "sendMessage"
		},

		/**
		 * Connects to socket.io to start sending and receiving messages.
		 * @method initialize
		 */
		initialize : function() {
			socket.on("receive_chat_message", this.appendMessage);
		},

		/**
		 * Sends a chat message to the other connected users
		 * @method sendMessage
		 * @param event {Object} submit event object
		 */
		sendMessage : function(event) {
			var text_box = event.target.querySelector("#message-text"), message = text_box.value;
			//If message is not empty
			if (message !== "" && message !== null) {
				socket.emit("send_chat_message", message);
				text_box.value = "";
			}
			event.preventDefault();
		},

		/**
		 * Appends a new message to the chat conversation
		 * @method appendMessage
		 * @param data message data
		 */
		appendMessage : function(data) {
			var view = Mustache.render(document.getElementById("template-chat-message").innerHTML, {
				"first_name" : data.first_name,
				"last_name" : data.last_name,
				"message" : data.message
			});
			document.getElementById("message-list").innerHTML += view;
		}
	});
});
