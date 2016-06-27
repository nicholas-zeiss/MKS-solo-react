/* HINT: All these functions should probably be organized
   as public methods on a `ServerAPI` module.
*/

var ServerAPI = (function() {
	// login( { username: .., password: .. } )
	function login(data) {
		// HINT: you are only passing `data` into this function right now.
		// How will you know when the `success(..)` or `error(..)` signals,
		// commented out in the `$.ajax(..)` call below, are done and have
		// information you need? Will you need callbacks? Promises?


		$.ajax("/api/login",{
			method: "POST",
			data: data,
			dataType: "text",
			cache: false,
			success: function onSuccess(data){	
				document.location.href = "http://localhost:8005/?sessionID=" + data;
			},
			error: function onError(jq,statusText,errText){
				$("#message").addClass("error").html("Invalid credentials").show();
			},
		});
	}

	// reminders( { sessionID: .. } )
	function reminders(data) {
		var results;
		$.ajax("/api/reminders",{
			method: "GET",
			data: data,
			dataType: "json",
			cache: false,
			async: false,
			success: function onSuccess(data){
				results = data;
			},
			// error: function onError(jq,statusText,errText){ jq.responseText || errText },
		});
	return results;
	}

	// ignoreReminder( { sessionID: .., reminderID: .. } )
	function ignoreReminder(data) {
		$.ajax("/api/reminder/ignore",{
			method: "POST",
			data: data,
			dataType: "text",
			cache: false,
			// success: function onSuccess(resp){},
			// error: function onError(jq,statusText,errText){ jq.responseText || errText },
		});
	}

	// deleteReminder( { sessionID: .., reminderID: .. } )
	function deleteReminder(data) {
		$.ajax("/api/reminder/delete",{
			method: "POST",
			data: data,
			dataType: "text",
			cache: false,
			// success: function onSuccess(resp){},
			// error: function onError(jq,statusText,errText){ jq.responseText || errText },
		});
	}

	// addReminder( {
	//    sessionID: ..,
	//    description: ..,
	//    date: ..,
	//    time: ..,
	//    duration: ..
	// } )
	function addReminder(data) {
		var reminderID;
		$.ajax("/api/reminder/add",{
			method: "POST",
			data: data,
			dataType: "text",
			cache: false,
			async: false,
			success: function onSuccess(resp){
				reminderID = resp;
			},
			// error: function onError(jq,satusText,errText) {alert("you done fucked up"); },
		});
		return reminderID;
	}

	// addReminder( {
	//    sessionID: ..,
	//    reminderID: ..,
	//    description: ..,
	//    date: ..,
	//    time: ..,
	//    duration: ..
	// } )
	function updateReminder(data) {
		$.ajax("/api/reminder/update",{
			method: "POST",
			data: data,
			dataType: "text",
			cache: false,
			// success: function onSuccess(resp){},
			// error: function onError(jq,statusText,errText){ jq.responseText || errText },
		});
	}

	// inviteToReminder( { sessionID: .., reminderID: .., invite: .. } )
	function inviteToReminder(data) {
		var passed = true;
		$.ajax("/api/reminder/invite",{
			method: "POST",
			data: data,
			async: false,
			dataType: "text",
			cache: false,
			// success: function onSuccess(resp){},
			error: function onError(jq,statusText,errText){ passed = false; },
		});
		return passed;
	}

	return {
		login: login,
		reminders: reminders,
		ignoreReminder: ignoreReminder,
		deleteReminder: deleteReminder,
		addReminder: addReminder,
		updateReminder: updateReminder,
	  inviteToReminder: inviteToReminder
  };
})();
