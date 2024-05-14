## Description
Sleep Scheduler REST API

## Running the app
To start server in a docker container

- copy .env.example file into a .env file in the root directory

```bash
$ docker-compose build

$ docker-compose up
```
## Running the test
```bash
# To run e2e test
# Set node_env to test 
$ npm run test:e2e
```
![test image](test.png "Test image")

## Openai(Swagger) documentation
url : http://localhost:3000/api-endpoints

To set Authentication, click on the authorize button and paste the jwt token
![test image](swagger.png "swagger image")
