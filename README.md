# priority-tracker
More than your average todo list

![Home Page/Task List](images/Tasks.png?raw=true)

## Why I Made It

It's easy to build a simple todo list with your daily tasks, but I wanted a more organised way of keeping track of bigger projects that take several tasks.

Moreover, too many projects can cloud up the brain since it can be hard to know which to work on. Therefore, it's important to have a few higher priority ones to work on first and worry about others later

Existing solutions? ***Booooring***. How am I supposed to learn Vue and Nuxt and other fun stuff using those. Primarily so I can continue to learn and use Vue. But also, it's kinda useful. The application gives you the abiltiy to add as many projects and tasks as you want, but keeps your focus on the few that need to be complete now. That way, you don't have to keep everything in your mind, but at the same time, can focus on what's important *right now*

You simply start by adding categories for your various projects and tasks. They can be as general as "Development" or as specific as "Web Development" :)

![Categories Page](images/Categories.png?raw=true)

Then you add projects using those categories. Add as many as you like. They will be prioritized next

![Projects Page](images/Projects.png?raw=true)

It's time. Now we select the projects that we want to focus on. You will only be allowed to add tasks to projects that are prioritized

![Priorities Page](images/Priorities.png?raw=true)

## Implementation

### Frontend
The application is built using Nuxt.js and Vue. The user authentication is handled using Netlify Identity

Future: Create Mobile Application

### Backend
API is built using Node.js and Serverless and is faily simple with basic CRUD operations for the various data with some other helpful endpoints

Future: Move API to Netlify Functions and rewrite using Go (and up the security lol)
