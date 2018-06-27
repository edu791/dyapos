/**
 * @module Collaborative
 * @class User
 */

define([], function() {
	"use strict";
	var collaborative_visible = false,
		user_colors = ["#26642d", "#4e81e0", "#da6229", "#ad0c0c", "#cc76ac", "#1beadc", "#0a0101", "#ffff00", "#6d5050", "#703462"];

	function initWebsocketEvents() {
		// When a list of connected users is received from the server
		socket.on("load_connected_users", function(data) {
			appendUserList(data);
		});

		// When a new user connects to the room
		socket.on("new_user_arrives", function(data) {
			console.log("A new user arrived");
			console.log(data);

			// Add the logged user to the right panel (connected users)
			appendNewUser(data);
		});

		// When a user is disconnected
		socket.on("user_disconnect", function(data) {
			console.log("Disconnected user ID: " + data);
			removeUser(data);
		});
	}

	// Append a list of connected users
	function appendUserList(list) {
		for (var i = 0; i < list.length; i = i + 1) {
			console.log(list[i]);
			appendNewUser(list[i]);
		}
	}

	// Append a new user to the list
	function appendNewUser(new_user_data) {
		var template = document.getElementById("template-user").innerHTML,
			user = document.getElementById("user-" + new_user_data.id),
			total = $("#user-list").children().length,
			data = {},
			view;

		if (collaborative_visible === false) {
			showCollaborative();
		}

		if (user === null) {
			data = {
				"id" : new_user_data.id,
				"first_name" : new_user_data.first_name,
				"last_name" : new_user_data.last_name,
				"color" : user_colors[total]
			};
			view = Mustache.render(template, data);
			document.getElementById("user-list").innerHTML += view;
		}

	}

	// Remove a user from the list
	function removeUser(user_id) {
		var user = document.getElementById("user-list").querySelector("#user-" + user_id);
		user.remove();

		// Check if it is the last collaborator
		if (document.getElementById("user-list").children.length === 0) {
			hideCollaborative();
		}
	}

	function showCollaborative() {
		console.log("Show collaborative box");
		document.getElementById("collaborative").style.display = "block";
		collaborative_visible = true;
	}

	function hideCollaborative() {
		console.log("hide collaborative box");
		document.getElementById("collaborative").style.display = "none";
		collaborative_visible = false;
	}

	return {
		initWebsocketEvents : initWebsocketEvents,
		appendUserList : appendUserList,
		appendNewUser : appendNewUser,
		removeUser : removeUser
	};

});

