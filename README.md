## What is this project?
Its a simple web app to manage files.
* Create as many directories and sub directories.
* Upload, download, delete and move files.
* Share files with users. 

## How to run this project?
This is just the frontend. To run the entire app:
* Install docker: https://docs.docker.com/get-docker/
* Clone the repository.
* In project root run: docker-compose run --service-ports file
* To reset the app, simple rerun the above command. The database will get reset.

## What is the backend?
The backend for this project is an express server running in a container pushed to docker hub. 