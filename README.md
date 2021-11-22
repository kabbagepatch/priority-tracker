# priority-tracker
More than your average todo list

It's easy to build a simple todo list with your daily tasks, but what if you want a more organised way of keeping track of bigger projects that take several tasks.

Moreover, too many projects can cloud up the brain since it can be hard to know which to work on. Therefore, it's important to have a few higher priority ones to work on first and worry about others later

That is what this application is for. The application gives you the abiltiy to add as many projects and tasks as you want, but keeps your focus on the few that need to be complete now. That way, you don't have to keep everything in your mind, but at the same time, can focus on what's important *right now*

## API
Built using Node.js and Serverless

Currently has endpoints for CRUD operations for categories, projects and tasks, along with endpoints for adding high priority projects and moving tasks between active, queued and backlog

## Web APP
Building using Nuxt.js

Home page contains the Active tasks, Queued tasks and a backlog of tasks on the five high priority projects selected by the user

Other pages exist to update categories, update projects and select priorities

Major To-dos:
* Add User login and API authentication (so I can actually have a link to this without showing my own list of tasks lol)
* Move API to Go (so I can learn Go)
* Update UI (Design's very simple right now)
