# General Information
This is the website for Club Cooking at William & Mary. It provides various features that streamline club operation and assist club members. For example, events are published on the website and members can sign up there. General club information, such as health and safety information, is also posted on the website as soon as possible.

# Website Structure
The website is deployed as a static react app on github pages. This means, that there is a single entry point "wmcooking.org/" which contains the entire website. When users "navigate" through links, react handles the navigation but does not leave the index page. Any 404 requests are served the same content as the index url. This does have a side effect, that real links will receive a 404 response when navigated strictly from the browser.

# Backend Structure
Our backend database is deployed using Supabase and provides a PostgresSQL database with access to edge functions and user authentication.

# Repository Structure
Although this is not an open-sourced project, the repo uses some aspects of open sourced development to keep well documented for future maintainers. All changes should be made through a PR linked to an issue and merged into the main branch. This should allow future maintainers to see the commit history in terms of general feature additions, instead of smaller commits out of context. 
