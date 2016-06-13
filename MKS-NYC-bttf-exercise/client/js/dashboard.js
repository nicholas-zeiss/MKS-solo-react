// HINT: This is where you should organize any code related
// to the dashboard, such as the filters, the reminder list
// (probably in its own module), etc.

var Dashboard = (function Dashboard(){
  var reminders;
  
  function loadReminders() {
    reminders = ServerAPI.reminders({sessionID: document.location.href.toString().slice(33)});
    var temp = reminders.slice();
    reminders = [];
    for (var i = 0; i < temp.length; i++) {
      if (Date.now() < dateHelper(temp[i]).getTime()) {
        reminders.push(temp[i]);
      }
    }
    reminders.sort(function(a,b) {
      return dateHelper(a).getTime() - dateHelper(b).getTime();
    });
    return reminders;
  }

  function displayReminders() {
    var elems = [];
    for (var i = 0; i < reminders.length; i++) {
      elems.push(App.buildReminderElement(reminders[i]));
    }
    elems.forEach(function(item) {
      item.appendTo($("#reminderList"));
    });
  }

  function editReminder(curr) {
    $("#editReminderModal").show();

    $("button.cancel").on("click", function() {
      $("#editReminderModal").hide();
    });

    $("button.confirm").on("click", function() {
      var args = {
        sessionID: document.location.href.toString().slice(33),
        reminderID: curr.attr("data-reminder-id"),
        description: $("#editReminderModal > input.description").val(),
        date: $("#editReminderModal > input.date").val(),
        time: $("#editReminderModal > input.time").val(),
        duration: $("#editReminderModal > input.duration").val()
      };

      if ($("#editReminderModal > .invitees").val().length > 0) {
        var alreadyInvited = curr.children().children(".users").text().split(", ").join(",");
        if(alreadyInvited.length > 0) {
          alreadyInvited = alreadyInvited + ",";
        }
        ServerAPI.inviteToReminder({
          sessionID: args.sessionID,
          reminderID: args.reminderID,
          invite: alreadyInvited + $("#editReminderModal > .invitees").val()
        })
      }

      ServerAPI.updateReminder(args);
      $("#editReminderModal").hide();
    })
    $("#reminderList").children().remove();

    loadReminders();
    displayReminders();

    setup_callbacks();
    filter();
    //App.init();
  }

  function ignoreReminder(curr) {
    if (confirm("Are you sure you'd like to ignore this event?")) {
      var args = {
        sessionID: document.location.href.toString().slice(33),
        reminderID: curr.attr("data-reminder-id")
      };
      ServerAPI.ignoreReminder(args);
    }
    $("#reminderList").children().remove();

    loadReminders();
    displayReminders();

    setup_callbacks();
    filter();
    //App.init();
  }

  function deleteReminder(curr) {
    if (confirm("Are you sure you'd like to delete this event?")) {
      var args = {
        sessionID: document.location.href.toString().slice(33),
        reminderID: curr.attr("data-reminder-id")
      };
      ServerAPI.deleteReminder(args);
    }
    $("#reminderList").children().remove();

    loadReminders();
    displayReminders();

    setup_callbacks();
    filter();
    //App.init();
  }

  function addReminder() {
    $("#addReminderModal").show();
    $("button.cancel").on("click", function() {
      $("#addReminderModal").hide();
    })
    $("#addReminderModal button.confirm").on("click", function() {
      var args = {
        sessionID: document.location.href.toString().slice(33),
        description: $("#addReminderModal > .description").val(),
        date: $("#addReminderModal > .date").val(),
        time: $("#addReminderModal > .time").val(),
        duration: $("#addReminderModal > .duration").val()
      };
      var ID = ServerAPI.addReminder(args);
      var invitees = $("#addReminderModal > .invitees").val();
      if (invitees.length > 0 && ID) {
      	var invitee_list = ServerAPI.inviteToReminder({
    	    sessionID: args.sessionID,
    	    reminderID: ID,
    	    invite: invitees
  	  });
        if (!invitee_list) {
          $("#addReminderModal").hide();
          var curr;
          var results = ServerAPI.reminders({sessionID: document.location.href.toString().slice(33)});
          results.forEach(function(item) {
           if (item.reminderID == ID) {
            curr = item;
           }
          });
          curr = App.buildReminderElement(curr);
          alert("Invite field was invalid");
          editReminder(curr);
        }
      }
      $("#addReminderModal").hide();
    $("#reminderList").children().remove();

    loadReminders();
    displayReminders();

    setup_callbacks();
    filter();
    });
  }

  function reminderCount() {
    return reminders.length;
  }
  
  function dateHelper(reminder) {
    var date = reminder.date.split("-");
    var time = reminder.time.split(":");
    return new Date(date[0], date[1], date[2], time[0], time[1], time[2]);
  }



	return {
    loadReminders: loadReminders,
    dateHelper: dateHelper,
    displayReminders: displayReminders,
    editReminder: editReminder,
    ignoreReminder: ignoreReminder,
    deleteReminder: deleteReminder,
    addReminder: addReminder,
    reminders: reminders,
    reminderCount: reminderCount
  }

})();
