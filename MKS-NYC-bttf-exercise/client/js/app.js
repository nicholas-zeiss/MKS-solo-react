// ****************************************

// HINT: Just leave this code alone. It's an inlined library for
// managing URL parsing easily.

// parseUri 1.2.2
// (c) Steven Levithan <stevenlevithan.com>
// MIT License
function parseUri(e){var a=parseUri.options,f=a.parser[a.strictMode?"strict":"loose"].exec(e),b={},c=14;while(c--)b[a.key[c]]=f[c]||"";b[a.q.name]={};b[a.key[12]].replace(a.q.parser,function(h,d,g){if(d)b[a.q.name][d]=g});return b}parseUri.options={strictMode:false,key:["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"],q:{name:"queryKey",parser:/(?:^|&)([^&=]*)=?([^&]*)/g},parser:{strict:/^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,loose:/^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/}};

// ****************************************



var App = (function() {
	// HINT: this variable declaration shouldn't be global, it
	// should probably be in an `App` module. It's set in `init()` to
	// point to the `#message` <div> in index.html.

	var $message;
  var $reminderTemplate;

	// HINT: this makes sure to fire the `init()` function at DOM-ready.



	// ****************************************


	// HINT: this `init()` function should probably be put into
	// an `App` module.

	function init() {
		$message = $("#message");

		// When properly logged in, the page URL should look like:
		// http://localhost:8005/?sessionID=...

		var urlParts = parseUri(document.location.href.toString());

		// session ID in URL indicating we're logged in?
		if (urlParts.queryKey && urlParts.queryKey.sessionID) {

			// HINT: this code is related to the `buildReminderElement(..)`
			// utility further down in this file. Both of them should probably
			// move to a separate module for the reminder list.

			// pull out reminder element as template for new reminders
			var $reminder = $("#reminderList > .reminder:first-child");
			$reminderTemplate = $reminder.clone();
			$reminder.remove();

			//use dashboard module to call reminders, organize them, display them

			$("#logout").show();

			// HINT: Now, to make a new reminder, you can simply do:
			//   var $newReminderElem = $reminderTemplate.clone()
			//
			// ...and then fill in the appropriate data into its elements


			// **********************************

			$("#dashboard").show();
			var reminders = Dashboard.loadReminders();
			Dashboard.displayReminders();

			setup_callbacks();
			filter();
			
			
			
			function a() {
				setTimeout(b, 5000);
			}

			function b() {
				if( !( $("#editReminderModal").is(":visible") || $("#addReminderModal").is(":visible") ) ){
					console.log("reloaded");
					$("#reminderList").children().remove();
					//App.init();
					reminders = Dashboard.loadReminders();
					Dashboard.displayReminders();

					setup_callbacks();
					filter();
				}
				a();
			}

			a();
			// b();

			// HINT: dashboard code should go into the `Dashboard` module
			// from `dashboard.js`
		} else {
			$("#loginBox").show();
      $("#loginBtn").on("click",function(){
	      var username = $("#loginUsername").val();
	      var password = $("#loginPassword").val();
	      var userInfo = {
	        username: username,
	        password: password
        };
        ServerAPI.login(userInfo);
			});

			// HINT: login screen code should probably be its own module
			//
			// ...or you could use prototypes/OLOO to organize the login
			// functionality.


			// **********************************

			// HINT: you can change the URL of the page by assigning:
			//    document.location.href = "..";
			//
			// This action will redirect/refresh the page, re-running
			// everything, so there's no need to put any code after it.
		}
	}


	// ****************************************


	// HINT: These next 3 functions are how you can easily display
	// success and error messages.

	function showMessage(msg) {
		$message.html(msg).show();
	}

	function showError(err) {
		$message.addClass("error").html(err).show();
	}

	function resetMessage() {
		$message.removeClass("error").hide();
	}


	// ****************************************


	// HINT: use this utility to validate new or edited
	// reminder data before sending to the server

	// HINT: this will probably need to move to some other
	// module.

	function validateReminderData(data) {
		if ("description" in data && "date" in data &&
			"time" in data && "duration" in data
		) {
			if (data.description.length < 1 || data.description.length > 100) return false;
			if (!/^\d{4}-\d{2}-\d{2}$/.test(data.date)) return false;
			if (!/^\d{2}:\d{2}:\d{2}$/.test(data.time)) return false;
			if (isNaN(Date.parse(data.date + "T" + data.time))) return false;
			if (!/^\d+$/.test(String(data.duration)) ||
				data.duration < 0 || data.duration > 360
			) return false;

			return true;
		}

		return false;
	}


	// ****************************************


	// HINT: These next two functions `reminderTimestamp(..)` and
	// `formatReminderDateTime(..)` are related to `buildReminderElement(..)`
	// below

	// HINT: this will probably need to move to another module.

	// parse a date/time pair in UTC as JS does, but then force
	// it to behave as if it was specified in the local timezone
	function reminderTimestamp(date,time) {
		var tz = (new Date()).toString().match(/\((.+)\)$/)[1];
		var utc = new Date(date + "T" + time);
		var str = utc.toUTCString();
		str = str.replace(/GMT$/,tz);
		return (new Date(str)).getTime();
	}

	// format a date and time in a friendlier way
	function formatReminderDateTime(date,time) {
		var ts = new Date(reminderTimestamp(date,time));
		var hours = ts.getHours(), minutes = ts.getMinutes(), ampm;
		ampm = (hours > 11) ? "pm" : "am";
		hours = (hours + 11) % 12 + 1;
		return ts.toLocaleDateString() + " " +
			hours + ":" + (minutes < 10 ? "0" : "") + minutes + ampm;
	}


	// HINT: use this function to build the reminder DOM element for
	// each reminder in the list. IT DOES NOT ADD IT to the DOM, though,
	// only return it to you for you to add somewhere.

	function buildReminderElement(reminder) {
		var $reminder = $reminderTemplate.clone();

		$reminder.attr("shown", "true");
		$reminder.attr("data-reminder-id",reminder.reminderID);
		$reminder.find(".description").text(reminder.description);
		$reminder.find(".datetime").text(
			formatReminderDateTime(reminder.date,reminder.time)
		);
		if (reminder.duration > 0) {
			$reminder.find(".duration > .count").text(reminder.duration);
		}
		else {
			$reminder.find(".duration").hide();
		}
		if (reminder.createdBy != null) {
			$reminder.find(".createdBy > .user").text(reminder.createdBy);
			$reminder.find(".buttons > .edit, .buttons > .delete").hide();
		}
		else {
			$reminder.find(".createdBy").hide();
			$reminder.find(".buttons > .ignore").hide();
		}
		if (reminder.invitees != "") {
			var invitees = reminder.invitees.join(", ");
			$reminder.find(".invitees > .users").text(invitees);
		}
		else {
			$reminder.find(".invitees").hide();
		}
		return $reminder;
	}

	function getVisibleCount(){
		var i = 0;
		$("#reminderList").children().each(function() {
			if ($(this).attr("visible") === "true") {
				i++
			}
		});
		return i;
	}

	function getDuration() {
		var duration = 0;
		$("#reminderList").children().each(function() {
			if ($(this).attr("visible") === "true") {
				duration += Number($(this).children(".when").children(".duration").children().text());
			}
		});
		return duration;
	}
	function setup_callbacks() {
	    var temp = $("#reminderList").children();
	    for (var i = 0; i < temp.length; i++) {
		    if (temp[i].getElementsByClassName("invitees")[0].getElementsByClassName("users")[0].innerHTML !== "other, people") {
			    temp[i].setAttribute("visible", "true");
		    }
	    }

	    $(".reminderCount").html("Total number of events: " + Dashboard.reminderCount());
	    $(".currentReminderCount").html("Number of displayed events: " + Dashboard.reminderCount());
	    $(".currentDuration").html("Duration of displayed events: " + getDuration());

	    $("button.ignore").on("click", function() {
		    Dashboard.ignoreReminder($(this).parent().parent());
		    reminders = Dashboard.loadReminders();
		    Dashboard.displayReminders();

		    setup_callbacks();
		    filter();
	    });

	    $("button.edit").on("click", function() {
		    //$("#editReminderModal .description").val("");
		    //$("#editReminderModal .date").val("");
		    //$("#editReminderModal .time").val("");
		    //$("#editReminderModal .duration").val("");
		    //$("#editReminderModal .invitees").val("");
		    var data_reminder_id = $(this).parent().parent().attr('data-reminder-id');
		    reminder_id = parseInt(data_reminder_id);

		    for (var i=0; i < reminders.length; i++) {
		      if (reminders[i].reminderID === reminder_id) {
			  var reminder = reminders[i];
			break;
		      }
		    }
		    $("#editReminderModal .description").val(reminder.description);
		    $("#editReminderModal .date").val(reminder.date);
		    $("#editReminderModal .time").val(reminder.time);
		    $("#editReminderModal .duration").val(reminder.duration);
		    $("#editReminderModal .invitees").val(reminder.invitees);

		    Dashboard.editReminder($(this).parent().parent());
	    });

	    $("button.delete").on("click", function() {
		    Dashboard.deleteReminder($(this).parent().parent());
		    reminders = Dashboard.loadReminders();
		    Dashboard.displayReminders();

		    setup_callbacks();
		    filter();
	    });

	    $("button.newReminder").on("click", function() {
		    $("#addReminderModal .description").val("");
		    $("#addReminderModal .date").val("");
		    $("#addReminderModal .time").val("");
		    $("#addReminderModal .duration").val("");
		    $("#addReminderModal .invitees").val("");

		    Dashboard.addReminder();
	    });

	    $("#filter").on("change", function() {
	      filter();
	    });
	}

	function filter() {
	    if ($("#filter").val() === "all") {

		    var temp = $("#reminderList").children();
		    for (var i = 0; i < temp.length; i++) {
				    temp[i].setAttribute("visible", "true");
		    }

		    $("#reminderList").children().show();

	    } else if ($("#filter").val() === "public") {

		    $("#reminderList").children().hide();
		    var temp = $("#reminderList").children();

		    for (var i = 0; i < temp.length; i++) {
			    if (temp[i].getElementsByClassName("invitees")[0].getElementsByClassName("users")[0].innerHTML !== "other, people") {
				    temp[i].setAttribute("visible", "true");
			    } else {
				    temp[i].setAttribute("visible", "false");
			    }
		    }

		    $("#reminderList").children().each(function() {
			    if($(this).attr("visible") === "true") {
				    $(this).show();
		      }
		    });

	    } else {
		    $("#reminderList").children().hide();

		    var temp = $("#reminderList").children();
		    for (var i = 0; i < temp.length; i++) {
			    if (temp[i].getElementsByClassName("createdBy")[0].getElementsByClassName("user")[0].innerHTML === "someone"
				    && temp[i].getElementsByClassName("invitees")[0].getElementsByClassName("users")[0].innerHTML === "other, people") {
				    temp[i].setAttribute("visible", "true");
			    } else {
				    temp[i].setAttribute("visible", "false");
			    }
		    }

		    $("#reminderList").children().each(function() {
			    if($(this).attr("visible") === "true") {
				    $(this).show();
		      }
		    });
	    }

	    $(".currentReminderCount").html("Number of displayed events: " + getVisibleCount());
	    $(".currentDuration").html("Duration of displayed events: " + getDuration());
	}

	// call init
	// unless modal is open

  return {
  	init: init,
  	showMessage: showMessage,
  	showError: showError,
  	resetMessage: resetMessage,
  	validateReminderData: validateReminderData,
  	reminderTimestamp: reminderTimestamp,
  	formatReminderDateTime: formatReminderDateTime,
  	buildReminderElement: buildReminderElement,
  	filter: filter,
  	setup_callbacks: setup_callbacks
  }
})();

$(document).ready(App.init);

