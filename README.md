# Canteen by Jared Faucher
## Final Project: CSCI S-33a - Summer 2018

## [Canteen](https://canteen-lunch.herokuapp.com)

### Overview
- This is my final project for CSCI S-33a, Canteen. It is a web application written in Django and Javascript which allows users to search for restaurants based on their company's location via Yelp's API and create lunch events with their colleagues.  In addition to these features it allows the user to add colleagues and update their current company.

### Django
- canteen/settings.py
    - This is pretty out of the box but I did just want to call out my use of the django_heroku package on lines 12 and 128 as well as my use of a application defined AUTH_USER_MODEL CanteenUser.  The django_heroku package basically updates these settings when deploying to heroku to allow the use of postgresql as well as some static file management.
    
- lunch/models.py
  - Address: This is the model for our Company model's associated Address instance, used while calling the Yelp API when a user searches within Canteen.
  - Company: This is the model used to represent a Company within my application, which is associated with each CanteenUser.
  - CanteenUser: This is the custom user model used within Canteen which has an associated Company.
  - Event: This is the model used to hold the data associated with each Event created within Canteen containing the following attributes:
    - restaurantId: ID for restaurant in Yelp
    - restaurantName: Name of restuarant
    - attendees: the CanteenUsers which are added to an Event
    - eventTime: the DateTime for when the Event is scheduled
    - creator: the CanteenUser who created the Event
    - status: status of the Event. This would be updated through the lifecycle of an Event in a future release. 
      
- lunch/admin.py
  - AddressInlineAdmin: used to allow inline address addition for Company within Admin view
  - CanteenUserInlineAdmin: used to allow inline add of CanteenUser to Company
  - CompanyAdmin: used to allow inline add of CanteenUser to Company
  - CanteenUserAdmin:
    - Updates the forms for CanteenUser
        
- lunch/forms.py
  - CanteenUserCreationForm: sets up CSS classes and required fields for CanteenUser form
  - CanteenAuthenticationForm: sets up CSS classes for CanteenAuthenticationForm 
    
- lunch/views.py
  - index_view: mapped to the "/" path within urls.py
    - This is the main landing page for our application, routes to /login if they are unauthenticated
    - Renders lunch/index.html with user info, upcoming Events and all Companies
  - login_view: mapped to the "/login" path within urls.py
    - Used to render login screen for GET request and authenticate/login user for POST request
  - register_view: mapped to the "/register" path within urls.py
    - Used to render registration screen for GET request and register/login user for POST request
  - logout_view: mapped to the "/logout" path within urls.py
    - Used to logout current user
  - search_view: mapped to the "/search" path within urls.py
    - Used to call the Yelp API with user input and the user's company address and return restaurant results back to the server for POST request or return search_results.html on GET request
    - Called via AJAX from functions within lunch/index.js
  - update_company_view: mapped to the "/updateCompany" path within urls.py
    - Used to populate Update Company modal on GET request and create and update the Company for a particular user.
  - create_event_view: mapped to the "/createEvent/restuarant_id" path within urls.py
    - Used to return Create Event modal body on GET request and create the Event in Cantee on POST request
    - Called via AJAX from functions in index.js.
  - upcoming_lunches_view: mapped to the "/upcomingLunches" path within urls.py
    - Used to return the Upcoming Lunches card on GET request
  - find_colleagues_view: mapped to the "/findColleagues" path within urls.py
    - Used to render the Find Colleagues screen, which is the other main page of the application besides the index screen and is used to search for and add colleagues
  - search_colleagues_view: mapped to the "/searchColleagues" path within urls.py
    - used to return blank search results for GET request and returns colleague search results on POST
    - Uses Q objects in Django to do an OR clause, searching on first name, last name and company name
    - Called via AJAX call in find_colleagues.js
  - add_colleague_view: mapped to the "/addColleague/user_id" path within urls.py
    - Used to add a colleague for a particular user for POST request
    - Called via AJAX call in find_colleagues.js
  - get_colleague_view: mapped to the "/getColleague/user_id" path within urls.py
    - Used to populate the View Colleague modal triggered by clicking a colleague in the Colleagues card UI on both main screens
    - Called via AJAX call in lunches.js
  - get_event_view: mapped to the "/getEvent/event_id" path within urls.py
    - Used to populate the View Event modal triggered by clicking an event in the Upcoming Lunches card UI on both main screens
    - Called via AJAX call in lunches.js
        
- lunch/tests.py
  - ModelsTestCase: contains some test cases which are run by Travis within my CI/CD pipeline.


### HTML & CSS
- style.scss
  - The main styling file for Canteen. Not a lot out of the ordinary here, mostly just overriding/defining colors for components.
  
- base.html
  - base html template for all html files for Canteen
  - includes CSS for Bootstrap, style.css and font-awesome
  - includes jQuery, Popper, js-cookie, Bootsrap
  - includes lunch.js if the user is authenticated and includes different blocks for scripts, header and body
  - includes footer used across the entire app.
  
- login.html
  - basic login screen modified from previous projects
  
- register.html
  - basic registration screen modified from previous projects to include name fields
  
- header.html
    - header component used in both main screens of the application
    - contains search bar used to search for restaurants at "/" and colleagues at "/findColleagues" as well as a menu attached to the username/user icon which is used to navigate to different screens, update your company or logout
    
- index.html
    - Main landing page of the application containing the restaurant search results, upcoming lunches and colleagues as well as some modals that are filled via AJAX calls.
    
- search_results.html
    - This contains the restaurant search results which are populated and displayed via an AJAX call in index.js.
    - Contains a "clear results" floating static button which can clear out the current search results and the search bar to allow the user to easily search again or see their ucomping lunches/colleagues on mobile
    - Each restaurant in the search results contain a button which launches the Create Event modal for that particular restaurant.
    
- update_company_modal.html
    - This is the Update Company modal template, whose body is filled via AJAX call in lunch.js
    - This modal is launched by some links contained in header.html and can be launched form both main landing pages of the application.
    - The user is required to select a company before closing this form when they are first registered and logged in, so that a user cannot make a call to the Yelp API without a location associated with them.
    
- update_company_modal_body.
    - This is the body of the Update Company modal which is populated via AJAX call defined in lunch.js
    
- create_event_modal.html
    - This is the Create Event modal template, whose body is filled via AJAX call in index.js
    - This modal is launched via clicking the "Create Event" button on any restaurant search results.
    
- create_event_modal_body.html
    - This is the body of the Create Event modal which is populated via AJAX call defined in index.js
    
- find_colleagues.html
    - Secondary landing page of the application containing the colleague search results, upcoming lunches and colleagues as well as some modals which are filled via AJAX calls.
    
- colleague_search_results.html
    - This contains the colleague search results which are populated and displayed via an AJAX call defined in find_colleagues.js
    - Also contains a "clear results" button, similar to search_results.html
    - Each colleague in the search results contains a button which adds the colleague to your colleague list via AJAX call
    
- colleagues_card.html
    - Displays colleagues for the active user in the right sidebar of index.html and find_colleagues.html
    - Clicking of a colleague launches the View Colleague modal which displays some information about the colleague.
    
- view_colleague_modal.html
    - Modal displaying colleague information launched via click of colleagues card.
    - Content populated via AJAX call defined in lunch.js
    
- view_colleague_modal_content.html
    - Content of View Colleague modal, populated via AJAX call defined in lunch.js
    
- upcoming_lunches_card.html
    - Displays upcoming lunch events for a user
    - Clicking on one of these events launches the View Event modal
    
- view_event_modal.html
    - Modal displaying event information launched via click of upcoming event
    - Body populated via AJAX call defined in lunch.js
    
- view_event_modal_body.html
    - Body of View Event modal, populated via AJAX call defined in lunch.js


### Javascript:
- login.js
  - Contains basic jQuery to remove password error on keyup. When invalid credentials error is returned from application
- register.js
  - Contains basic jQuery to validate the password and confirm password on key up.
- lunch.js
  - Contains all of the shared Javascript/jQuery used on both index.html and find_colleagues.html
  - csrfSafeMethod is used to submit AJAX with CSRF tokens
  - getUpcomingLunches: AJAX call to /upcomingLunches to get a user's upcoming lunches and populate the Upcoming Lunches card in the sidebar.
  - getUpdateCompany: AJAX call to /updateCompany to populate the Update Company modal with a current company list as well as set up some validate behavior in that modal.
  - updateCompan: AJAX POST to updateCOmpany which updates a user's company and displaying a message to the user.
  - validateUpdateCompany: contains logic to validate required fields for submitting Update Company modal
  - setupUpdateCompanyModal: runs some initial setup of behavior for when a Update Company moday is loaded.
  - getColleage: AJAX call to /getColleague/user_id to get information on a colleague and populate the View Colleague modal
  - setupViewColleagueModal: sets up the behavior for View Collague modal
  - setupColleagueCard: sets up behavior of colleague card
  - getEvent: AJAX call to getEvent/event_id to get event information and populate the View Event modal
  - setupViewEventModal: sets up behavior for View Event modal
  - setupUpcomingLunchesCard: sets up behavior of upcoming lunches card.
  
- index.js
  - Contains all of the Javascript/jQuery used on index.html only
  - searchRestaurant: AJAX POST call to get the search results for a resaturant and set up the create event modal behavior for the search results
  - resetSearch: AJAX GET call to reset the search results in the UI
  - createEventGet: AJAX GET call to get information about a resaturant and setup the Create Event modal's behavior as well as some validation behavior for submitting the modal.
  - createEventPost: AJAX POST call to actually create the event and then show success message on the modal
  - validateCreateEvent: function to setup some validation for submitting the Create Event modal.
  - $(document).ready: sets up some of the modal behavior as well as the navbar's search behavior.
  
- find_colleagues.js
  - Contains all of the Javascript/jQuery used on find_colleagues.html only
  - searchColleagues: AJAX POST request to get colleague search results back and display them in the  as well as set up the behavior for adding a colleague from the search results and clear search results icon
  - resetSearch: AJAX GET request to reset the colleague search results
  - addColleague: AJAX POST request to add a particular colleague to a user and remove that colleague from the search results
  - $(document).ready: sets up some of the modal behavior as well as the navbar's search behavior.


### If I had more time/TODO:
- I did not get to set up the websocket behavior via Django Channels that I had wanted to. Although I did get a small POC instance using Channels up and running by following some tutorials, I realized I didn't have enough time to get something fully functional working so I decided to divert and focus on cleaning other parts of the app up.  If I continue on this as a personal project/resume builder I will definitely try to integrate some real-time websocket notications
- I would also add the ability for a create to update events as well as mark them complete.  Similarly I would add some sort of ability for an attendee to accept or reject an event meeting. 
- Besides this there are really no limits to what I could add, whether its more filtering capabilities in the search to some sort of ability to recreate a past event, the sky is the limit. The Yelp API provides a ton of information like distance, pricing, ratings and more so I'm sure I can think of more ways to extend this application in the future.
