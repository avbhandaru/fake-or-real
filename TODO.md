## TODO
 - Download trump tweets and load into real-tweets collection in mongodb real-or-fake database (might need to write a short script)
 - Construct tweet model/schema
 - routes for /api/tweets/ and / and other if needed
 - figure out env/config vars issue with heroku
 - How to add a webworker/dyno? Or does that cost money :(
 - Figure out tweet quota randomization/how I want to do that/should be pretty straightforward
 - dynamic fake tweet generation? Will the backend just do that on the fly? Or will we need a separate node process to do that (extra dyno?)