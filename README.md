[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/c4wSHrp5)
[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-2e0aaae1b6195c2367325f4f02e2d04e9abb55f0b24a779b69b11b9e10269abc.svg)](https://classroom.github.com/online_ide?assignment_repo_id=23873502&assignment_repo_type=AssignmentRepo)

# Jotpad
## Project Overview
Our project is a microblogging website called Jotpad. It is a platform that allows aspiring writers to post stories online for others to view. Its unique feature is a currency system that requires you to provide constructive feedback for others' works before you can post your own stories, so users who use this app will use it in order to improve their writing skills. Users can save drafts in the database and once they are happy with their drafts they can submit a beta-request, creating a listing that contains a summary and related genres. Other users will be able to provide feedback and ratings which are saved in the database.

## Tools Used:
**Frontend**
- React

**Backend**
- Node.js
- MongoDB

## Steps to Deploy Code
1. In the terminal while in /backend, enter:
```
npm run dev
```
2. Then in terminal while in /frontend, enter:
```
npm run dev
```


## Feature List
* Password encryption
* Admin account dashboard
* Story viewing and rating
* Draft editing page
* Feedback commenting and feedback rating
* Profile pages with all recorded ratings for reviews and stories
* Credit system

## Contributions
Andrew - I helped to set up the initial database structure and connected the backend routes to the story submission and feedback feature frontend. I also added bcrypt encryption to user account passwords. 


Matthew - I implemented a profile page for each user, an inbox system for sending notifications/prompts relating to stories/feedback, a drafts page where you can edit your drafts, a listing of all beta requests/the ability to add a request, and finished up the discover page for public stories.


Jaime - I set up the initial React frontend architecture and routing, and handled the client-side authentication and session management using localStorage. I also built the Admin Dashboard UI and connected it to the backend routes. Implemented the feedback forms and redesigned the application for a better user experience.

## Generative AI
Generative AI was not used in this project.

