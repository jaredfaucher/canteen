# CSCI S-33a: Project Proposal
## Due: Friday, July 27 at 6pm

#### Your name

Jared Faucher

#### Your teaching fellow's name

David Nunez

#### Which language(s) will you use for your project?

Python, Javascript, SQL, HTML, CSS

#### What will (likely) be the title of your project?

"Canteen" is the working title so far but that could change.

#### In just a sentence or two, summarize your project. (e.g. "A website that lets you check the weather in different cities.")

For my project I plan on building a web application which allows users to look up places and set up plans to get lunch with their coworkers.

#### Where will your project ultimately live? (e.g. within CS50 IDE, Heroku, AWS, some commerical web host...)

I plan on hosting the project on Heroku, as I did with my Project 1.  If I have time I would like to set up a Travis CI/CD pipeline obviously the project functionality is more important.

#### In a paragraph or more, detail your project. What will it do? What features will it have?

Since deciding where to get lunch is always a huge process at my job, I decided to make a web application which allows users to look up places and set up plans with my coworkers to get lunch. The basic idea is that users would register for the website, enter in some information about themselves like their company, work address and food preferences. I plan on having the application call Yelp's API to return a list of restaurants for the user to pick from and allow the user to set up lunch appointments with other users of the application.

The feature possibilities are pretty limitless for this application but some of the features I plan to implement are as follows:

- User can register and enter various information about themselves (food preferences, cost preferences, etc), login/logout to the application
- User can search for restaurants near their work using Yelp's API
- User can set up lunch dates/meetings for themselves or with other users of the website
- User can set up some sort of office friend list which notifies their friends when they have set up a lunch

I have plenty other ideas that could be implemented depending how smoothly the MVP goes but I will go into those details below.

<hr>

- In the world of software, most everything takes longer to implement than you expect. And so it's not uncommon to accomplish less in a fixed amount of time than you hope.

#### In a sentence or list, define a GOOD outcome for your project. What WILL you accomplish no matter what?

- User can register and enter various information about themselves (food preferences, cost preferences, etc), login/logout to the application
- User can search for restaurants near their work using Yelp's API
- User can set up lunch dates/meetings for themselves or with other users of the website

#### In a sentence or list, define a BETTER outcome for your project. What do you THINK you will accomplish in time?

- User can set up some sort of office friend list which notifies their friends when they have set up a lunch

#### In a sentence or list, define a BEST outcome for your project. What do you HOPE you will accomplish in time?

- User can set up some sort of poll for office friend list where the other users can vote on where to eat in real-time
- Adding in a chat feature to allow people to chat about a particular lunch meeting in real-time

#### In a paragraph or more, outline your next steps. What new skills do you need to acquire? What topics will you need to research?

So for the next steps I need to read Yelp's API [Documentation](https://www.yelp.com/developers/documentation/v3) and decide how I am going to use it. I plan on just using the "Search" API but depending on how complex my project gets I could expand to others.

Another thing I need to research is that since I plan on using Django for all of the out-of-the-box features it includes, I will need to research how to do SocketIO in Django. I've done a little preliminary work and it seems as if there are two options [django-socketio](https://django-socketio.readthedocs.io/en/latest/) which is out-of-date and [Django Channels](https://blog.heroku.com/in_deep_with_django_channels_the_future_of_real_time_apps_in_django) which seems a bit complicated to configure, but I have not looked into it extensively. Any advice on this topic would be great as I may just have to use Flask, but would rather get all of the nice features of Django.

Besides these two things the main next step is setting up my data model for the application. Since I plan on using Django I will get some stuff out-of-the-box as far as users goes but I will need to extend this.  As of right now I am thinking that I will have Users, some sort of Event object to hold information about a particlar lunch date, a relationship table between Events and Users and probably some other tables for friend lists/etc. Since I plan on using the Yelp API for restaurants, I'm not sure if I need to store any information about restaurants in the database but I will identify what domain objects my application needs and which of those needs to be stored in the database as my application design progresses.