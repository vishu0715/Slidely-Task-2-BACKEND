# Slidely-Task-2-BACKEND
This is the Repository containing all the files regarding backend of the Slidely Task 2.

THE FILES FOR THIS BACKEND ARE PRESENT IN    "my-backend-branch"

FIRST OF ALL THANK YOU VERY MUCH SLIDELY  FOR THIS WONDERFULL OPPURTUNITY WHICH HELPED ME LEARN SO MANY NEW THINGS I WAS ALSO ABLE TO EXPLORE MANY INTERESTING FEATURES WHILE WORKING THROUGH THIS PROJECT. 

Coming to the task this Repository Consists of all the files needed for the backend part of this task, README of this Repository Consists of how you can run the BACKEND server.

This project is a simple backend server built with Node.js and Express using TypeScript. It handles form submissions, stores them in a JSON file, and provides various endpoints to interact with the stored data.

SETUP AND RUNNING THE SERVER

1. Clone the Repository:
   git clone https://github.com/vishu0715/Slidely-Task-2-BACKEND.git
   cd Slidely-Task-2-BACKEND

2. Install Dependencies:
     npm install ---> installing npm packages
     npm init -y ---> installing required npm packages
 npm install express body-parser cors @types/express @types/body-parser @types/cors typescript ts-node fs-extra    ---> for installing express, bodyparser and typescript.

3.This repo already consists of tsconfig file and other files.
4.Once you clone this repository open it in vs code or anyother editor, YOU NEED TO MOVE ALL THE FILES OF NEW FOLDER into the workspace and delete the new folder (I created this for git hub purpose).
   
5.After that go to terminal and first compile the Typescript file using 
   -------> npx tsc
6. After that enter 
  ---------> npx ts-node ./dist/server.js 
7.This will start your server if there are any issues please contact me at any means I am available to help.


FEATURES OF THE BACKEND:

Endpoints

Ping Endpoint (GET /ping):

Checks if the server is running.
Submit Endpoint (POST /submit):

Submits a new form entry with fields: name, email, phone, github_link, and stopwatch_time.
Read Endpoint (GET /read?index={index}):

Retrieves a specific submission by index from the database.
Update Endpoint (POST /update):

Updates a submission based on email.
Read by Email Endpoint (GET /readByEmail?email={email}):

Retrieves a specific submission by email.
Delete Endpoint (DELETE /delete?email={email}):

Deletes a submission based on email.  


IF YOU HAVE ANY DOUBT REGARDING THIS PLEASE CONTACT ME I AM READY TO HELP , BECAUSE I HAVE PUT VERY MUCH EFFORT INTO THIS SO I WILL HAVE AN IDEA REGARDING ANY ISSUES IF THEY ARE OCCURING.
