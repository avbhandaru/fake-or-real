# TODO List

## Priority Queue
1. Generate Fake Tweets and upload to Database (temp: use existing generators)
2. Update database real Trump tweets to only have tweets post election 2016
3. Get random tweets/new tweets when a new game is started after exhausting previous query result
4. API response status
5. Webpack + AWS S3 supload script
6. Add Keyboard Shortcuts
7. Code cleanup
8. Message bank for correct/incorrect answers

## All TODO
 - Validate CRUD requests
 - How to add a webworker/dyno? Or does that cost money :(
 - [ABOVE](2) dynamic fake tweet generation? Will the backend just do that on the fly? Or will we need a separate node process to do that (extra dyno?)
 - [ABOVE](3) front end bloom filter for overflow new games that require new set of tweets. For now, do simple member checks
 - [ABOVE](3) consider adding skips in queries for increased "randomness" later when we request tweets
 - [ABOVE](4) add request status when sending 404/200, etc
 - [FAIL] hide endpoints from client/public private API
 - [DONE] setup s3 hosting of site
 - [ABOVE](5) script to upload changed prod front end to s3