# CSCI S-33a: Status Report
## Due: Monday, August 6 at 6pm

#### Your name

Jared Faucher

#### Your teaching fellow's name

David Nunez

<hr>

- Short answers for the below questions suffice. If you want to alter your plan for your project (and obtain approval for the same), be sure to email your teaching fellow directly!

#### What have you done for your project so far?

I have implemented the following features:
- Registration, Login, Logout
- Allowing user to set their company to an existing company or a new company (company address is used for restaurant search)
- Allow users to search for restaurants via AJAX call to the application which calls Yelp's API
- Allow users to create an event for a restaurant at a paticular date and time
- Allow users to search for colleagues to add to their colleague list
- Allow users to add a colleague to their colleague list
- Display current events and current colleagues
    - current events and colleagues are updated via AJAX call during event creation/colleague add

#### What have you not done for your project yet?

I have not implemented the following features:
- Allow user to add users from colleague list to created event
- Use Django Channels to implement new colleagues/events notifications
- Use Django Channels to implement Event Restaurant Polling between attendees

#### What problems, if any, have you encountered?

To be honest development of this application has been going pretty smoothly.  Because I was able to create and tweak the data model as I see fit, it has been working out pretty well. The main issues I've faced are UI related and mostly just the growing pains of getting used to Bootstrap.

I've also figured out a few new methods that would have helped make my previous project development a lot easier, including returning/replacing HTML from AJAX calls rather than redrawing HTML with JSON elements via Javascript. Along with this I've also set up a Travis-CI/Heroku Pipeline where any time I push my code to Github, CI tests are run before deployment my app to Heroku.  This has been useful in identifying any major issues during some refactoring that I've done and has proven to be very helpful.

However since I have not started the implementation of my Django Channels functionality there may be some challenges ahead.  But I am confident that I will be able to get some if not all of those websocket related features completed before the due date.