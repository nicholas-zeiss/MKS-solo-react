# Back To The Future: The Midterm Test

So, you've studied and studied, and studied so much your eyes were blurry, huh? Are you ready to show us what you've got? Hope you're well rested and your fingers are stretched out and nimble. It's time to code!

For the next two days, your "test" will be building out code for a mini-application, mostly from scratch, working alongside your sprint partner. Unlike other sprints you've seen (or will tackle later) that are about some specific pattern or framework, this exercise is all about pulling together the broad basics of JavaScript itself, that you've just spent all that time studying.

We purposely are providing you very little code to start with. That's not to be mean, but to make sure you have ample opportunity to practice and demonstrate your new JS skills. Don't fret, and remember that less is more. Look for the simplest ways to accomplish your goals. Don't just look for libraries or frameworks as your crutch -- this is just JavaScript!

You should look for ways to practice and demonstrate all of the five cores in your code. Remember them?

1. Values, Types
2. Lexical Scope, Closure, Modules
3. `this`, Objects, Prototypes
4. Functional Programming
5. Asynchronous Patterns

Regardless of whether your application "works" at the end from a feature perspective, it's not complete unless you've touched on all five of these cores. But we're deliberately not telling you exactly how to weave them together. That's your job!

## Overview

In this exercise, you are going to build the client-side of a simple reminder/calendaring application. The three overall objectives of this exercise are:

1. using closure/modules and `this`/objects for organization of your code. **DO NOT** just leave a bunch of global variables and functions strewn about.
2. using functional programming fundamentals for managing state and data, where appropriate.
3. using callbacks (or promises) for managing an asynchronous series of tasks. **Note:** This includes managing UI updates when data changes in a different user's window.


-----------------------------

**NOTE:** Please don't miss this: your goal is not just to implement all the features, but to demonstrate understanding of all five cores on the features you can implement. It would be far better to implement only some of the features and do so well than to implement all the features but do so poorly with respect to that overall goal!

-----------------------------


### Setup

#### Concept Primer/Overview

This exercise is going to have you briefly touching on some concepts which you may not yet be familiar with. We're deliberately not going to dive too deeply into them here, which may leave you a little frustrated wanting more. That's OK. These topics are revisted in-depth later in subsequent sprints.

For now, just take our word for it on a few of these things. Don't worry too much if you don't fully get them yet.

**URL**: URL is the address of a page as displayed in your browser. It's also a location on a server somewhere, where other non-page information can be retrieved.

**HTTP**: HTTP is the protocol used to transfer data (usually files like HTML and JS) from a server to your browser. Any time you click on a link, your browser makes an HTTP request to the server for that file, and the response it gets back will have all the HTML to redisplay a new page to you.

**Ajax**: Ajax means that JavaScript can make a background HTTP request from browser to server to ask for some more information, while the page stays put. Normally when you click a link in a page, the whole current page goes away and a new one pops in. Ajax makes it so data is retrieved without wiping out the current page.

**HTTP Verb**: A request (made via Ajax, for example) to a URL can be made as several different action types, called "verbs". a "GET" generally means, "get me some information", "POST" generally means, "post some information here". Other verbs include "PUT", "DELETE", etc. "GET" and "POST" are by far the most common. Which verb an Ajax call uses helps the server decide what actions to take.

**Request Data**: When an Ajax request is made, you may want to include more information than just the URL the request is being made of. This data can be included in various ways, including as URL parameters (like http://some.url/?abc=1&def=2) or as POST data (formatted much the same way, as: abc=1&def=2).

**Node**: A JavaScript implementation outside a browser (usually on a server or device) which can receive HTTP requests from a browser and respond with information.

**API**: *A*pplication *P*rogramming *I*nterface. For our purposes, this is a fancy way of describing a specific set of interactions that a server allows a browser to perform to initiate particular tasks. A server API is composed of different URLs that it knows how to respond to. It's common that a JS application makes Ajax requests to a server API to get more information or to update/persist information on the server.

**REST/Endpoint**: Within a server API, a specific URL is called an "endpoint". It might look like "http://some.url/foo/bar", which might mean something like the "bar" task in the "foo" section of the application. Endpoints can be accessed in various different ways, and may have information transmitted to them and/or information received from them.

**Session ID**: A "session" is a way to group various actions (like GETs and POSTs) that you make into one bucket. Usually a session is created on the server when a user on a web page/app initiates some form of login/authentication. Once that user is logged in, a unique *Session ID* is assigned to their session, and given back to the browser. All subsequent requests on behalf of that user must include this ID, which will let the server know that the user is still intentionally performing the actions. Sometimes this session ID is stored in the browser in a "cookie", but for our purposes a session ID can just be included in a URL parameter and also specified as a piece of data included with any Ajax requests to a server API.

OK, that's it for the dump of terminology/concepts. Don't worry if that stuff is still a bit fuzzy. These bits are all incidental/secondary to your main goals in this exercise. You'll learn much more about each of them as you continue into subsequent sprints!

#### Server

You are provided a simple Node server with an API that will handle storing the information you provide and responding to the actions you take in the client. You **do not need** to make changes to the server.

To start the provided server, open a command prompt, switch into the `/server` directory, and run `node server.js`. Let this terminal window run in the background. To stop the server, hit `Ctrl+C` in that window.

**Note:** The server already has three users and some reminders data pre-populated, to make it easier to build and test the client. Restarting the server always returns it to this initial state. The users/passwords provided are:

   * johnabark / fooManchoo13
   * sally-mercer / Bloom49
   * brand.pop / cee3$$Poh

The server provides the following API endpoints for the client to use (via simple Ajax calls):

   * `/api/login`: must `POST` to this URL with a `username` and `password` provided. On success, will return `200` status response with a session ID as the response text. On failure, will return `500` status response and no response text.
   * `/api/reminders`: must `GET` to this URL with a `sessionID` provided. Will return a JSON response as an array of reminders, each with the information necessary to display and also a `reminderID`. **Note:** The list is not necessarily sorted, so the client must do this as necessary. This list also includes all reminders, even those in the past.
   * `/api/reminder/add`: must `POST` to this URL with `sessionID`, `description`, `date`, `time`, `duration`. On success, will return a `200` status response with a reminder ID as the response text. On failure, will return a `500` status response and no response text.
   * `/api/reminder/invite`: must `POST` to this URL with a `sessionID`, `reminderID`, and `invite`, where `invite` is a comma-separated list of usernames. On success, will return a `200` status response, and on failure will return a `500` status response. Regardless of status response, a comma-separated list is returned including the current valid invitees of the reminder. **Note:** Use this endpoint for updating the invitee list for a reminder, both for adding and removing.
   * `/api/reminder/update`: must `POST` to this URL with a `sessionID`, `reminderID`, `description`, `date`, `time`, `duration`. On success, will return a `200` status response, and on failure will return a `500` status response. No response text is provided either way.
   * `/api/reminder/delete`: must `POST` to this URL with a `sessionID` and `reminderID`. On success, will return a `200` status response, and on failure will return a `500` status response. No response text is provided either way.
   * `/api/reminder/ignore`: must `POST` to this URL with a `sessionID` and `reminderID`. On success, will return a `200` status response, and on failure will return a `500` status response. No response text is provided either way. **Note:** Ignoring an invite to a reminder simply removes your username from the invite list.

The `add` and `update` API endpoints also perform some basic data validations:

   * `description` must be between 1 and 100 characters length
   * `date` must be a valid date (`yyyy-mm-dd`)
   * `time` must be a valid time in 24-hour format (`hh:mm:ss`)
   * `duration` must be a valid number of minutes from 0 to 360

**Note:** The client code provided includes (in `/js/server-api.js`) simple functions for making each of these API calls, assuming availability of jQuery for making the Ajax calls. However, none of these functions provides you a mechanism to receive the response, which is necessary. You have to **figure that part out** yourself (hint: callbacks, promises, etc). A data validation function for reminder data is also provided (in `/js/app.js`).

## Basic Requirements

-----------------------------

It is extremely important to review the code comments in the JS and HTML files provided to you. There are lots of hints and clarifications that will help keep you on track. The very first thing you should do before writing any code is read through all of these comments in all the provided client files. And regularly go back and re-read those comments as you progress on your coding.

-----------------------------


The following five items are all required for your application. Please review all of them carefully before starting to code.

1. Once the server is started, it will also serve files from the `/client` directory to your browser at `http://localhost:8005/`. The client files provided include:
   * an `index.html` file where your HTML will go
   * a `/css/styles.css` file for basic styling
   * a `/js` directory to put all your JS files

   You will load JS files using `<script src=..></script>` tags in your `index.html` file.

   The `index.html` file provided includes basic markup for a login screen, a dashboard, and two modals. You **will need to edit** this HTML some, however you shouldn't have to significantly restructure it.

   **Note:** The client files include a copy of a recent version of jQuery. You are free to use this or not as you see fit. But remember, this sprint is not specifically about browser coding (CSS manipulation, DOM APIs, Ajax, etc), so don't get tripped up on those kinds of details. jQuery is a nice abstraction that makes that kind of coding easier. It also has great documentation on jQuery.com, so it should be easy to learn the parts you may want to use.

2. For a non-logged-in user, the client should display a login screen to prompt for username and password. It should display a generic error message if login fails, but redirect to the dashboard on successful login (including the `?sessionID=..` in the URL query parameters). A logout is accomplished on the client by simply omitting this URL parameter and refreshing.

3. For a logged in user, display a dashboard showing their current list of reminders sorted in order of soonest to latest. If a reminder is already in the past according to the current time in the browser, **it should not be displayed**. Each reminder item will display a description, date, time, duration, and list of other invitees. Also, if `createdBy` is non-empty, that information should be displayed.

   If a reminder was created by the current user (`createdBy` in the reminder data will be empty), the displayed reminder will provide `edit` and `delete` buttons. If it's a reminder the current user was invited to (`createdBy` will be non-empty), the displayed reminder will provide an `ignore` button.

   Clicking `edit` will popup an edit-reminder modal. Clicking `delete` / `ignore` will show a message asking the user to confirm they want to perform the action.

   The dashboard should also include:

      * logout button (simply redirects to `http://localhost:8005/` without the `?sessionID=..` in the URL)
      * create-new-reminder button
      * a filter drop-down that has options for "All", "Public" and "Private" for filtering the list of reminders. **Note:** "Public" means more than one attendee, where the current user is either the creator or an invitee. "Private" means only reminders the current user created that have no current invitees.
      * count of all reminders (not including past reminders that should be ignored by the client)
      * count of only displayed reminders (will be less if list is filtered)
      * count of total duration in hours:minutes for only displayed reminder events

      These counters should update as the list filter is changed.

4. A user can create a new reminder (in a popup), and optionally invite others to it by username. Creating the reminder includes entry for description, date, time, duration, and list of other invitees.

   If you invite others while creating a reminder, and the reminder creation succeeds but the invite fails, the client should switch to the edit-reminder popup for that newly created reminder and display an appropriate warning message about the situation.

### Additional Requirements

1. The server is a passive API that does not notify clients of data changes. You must devise and implement a mechanism for how a client should handle the fact data can change independent of what's currently displayed to a user.

   For example, you may have two windows/tabs open with different users, and you may create a reminder in one user's window with an invite for the other window's user. How will that second user's dashboard know that the reminder has been created so that it can update the display for that second user?

   Or the second user might `ignore` a reminder, and the first user's display needs to be updated accordingly (could affect display based on currently applied filters, etc).

   This is a very challenging situation to account for. There is no particularly great simple answer.

   One strategy could be having a timer in the client that polls the server every so often (few seconds, etc) to get a new list of reminders. This brute force approach not only is creating a lot of wasted network traffic, but also presents a number of UI/UX challenges.

   For one, the time between an update of data and your next polling means the user may be operating against out-dated data and getting server errors.

   Also, you'd certainly at a minimum want the client to check the list of received data against the current data to see if it differs, and only interrupt by changing the UI if necessary. Even that task is not terribly convenient or performant, as you have to manually check all elements (remember, the list from the server is in no particular order!). **Hint:** Are there any concepts in functional programming that would affect/improve how you approach this?

   Another strategy is to combine polling with proactively retrieving new data each time some other action occurs.

   Regardless, if UI update is required, should you just completely rebuild the dashboard page while the user is potentially scrolling around, clicking on items, filtering a list, working in a modal, etc? That could be very disruptive to the UX.

   Alternatively, you could display a message like, "Your reminders have changed, click [here] to update." That's a little better UX giving the user the option of when to disrupt, but it's far from optimal/desired.

   The main exercise does not call for you to modify the server, but another way this is often handled is for a server to proactively notify connected clients (such as with long-polling, websockets, etc) of specific changes in data. But even in this case, you have to figure out how to handle the UI updates without being too disruptive to the user.

   There is no absolute right or wrong answer here. You should spend **a lot of your time** on the exercise working on this specific part. Do not skip over this requirement, and do not just settle for a basic simplifying assumption solution. There's a strong likelihood that whatever strategies you choose here will affect the code across the client, including making more of it asynchronous than you initially planned. That's OK and expected.

   The struggle to handle this complicated situation is a big part of why we've taken you through this sprint.

### Solution

[Solution Lecture](..TBD..)

## Extra Credit

If you've completed the exercise and feel confident in the organization of your code and in your handling of the asynchronous tasks, here's some challenges that you can push yourself with:

1. Create a test-suite for your client code.

2. Create a test-suite for the server API.

3. Add some capability to the client for bulk update (e.g. checking boxes and applying a `delete` or `ignore` action to all of them, etc). Handle all the corner cases here, like if an error occurs with only some of the actions.

4. Build out a "calendar" view option for the dashboard, which lays out the list of reminders in a traditional calendar grid presentation.

5. Add user registration and deletion. User deletion is particularly interesting, because it also implies some handling of existing reminders (not only ones the user created, but ones the user is an invitee of). **Note:** This will require adding new API endpoints to the server.

6. Refactor the provided quick-n-dirty server code using the same principles (organization, asynchrony, etc) that you applied to your client code.
