# Instagram RESTful API

This project will be modeled off of the Instagram API. Instagram itself, is a free social media platform that allows users to share photos and videos. It has become hugely popular focusing on visual connection. Users can create/edit/delete posts, comment and like other posts, create Instagram stories and reels, and so on. Each user has an Instagram profile that stores all of their information and content. Other users can follow a user’s profile to see the content that they publish. Instagram provides each user with a main feed where they can scroll through their friend’s media, as well as a search and explore page, where users can find and browse content from anyone on the app.  

### Framewrok
 * Node.js 
 * Express
 * Docker
 * MySQL
 * MongoDB

## 1. Design a RESTful API for Instagram application
### Users
 * Users can create/edit/delete posts, comment and like other posts, create Instagram stories and reels, and so on. 
 * If we delete a user, it will delete the posts, comments and likes that belong to the corresponding user.
 * When posting a new user to users table, check the user’s id duplication first.
   * User id
   * User name
   * User password
   * Email (option)  
### Posts
 * If user deletes a post, it will delete the comments and likes that belong to the corresponding post.
 * When a post/like/comment is deleted, the user’s id should be checked first.
   * Post id
   * User id
   * caption
### Comments
 * Review is not empty.
   * Comment id
   * User id
   * Post id
   * Review
### Likes
 * One user can’t like a post more than once. 
 * If a user cancels a like, the like will be deleted. This is the reason why we don’t have a PUT operation.
   * Like id
   * User id
   * Post id
   * Like

## 2. Implement a server for Instagram API
Implement a server for Instagram using Node.js and Express. 
 * Instagram server API implement a route for each of the API endpoints in the design created above.
 * Any API endpoint with a parameterized route perform basic verification of the specified route parameters.
 * Each API endpoint respond with an appropriate HTTP status code and, when needed, a response body.
 * API endpoints have paginated responses where appropriate.
 * This server run on the TCP port specified by the PORT environment variable.

## 3. Use MySQL database to power Instagram API
This project uses docker container to store application data. Created MySQL image, network, and volume in docker. Then, created fours tables in database. Last, set the environment variables when launching database container.
 * Uss MySQL database to store application data.
 * Use foreign keys to link posts to their corresponding user.
 * Use foreign keys to link comments and likes to their corresponding posts.

## 4. Enable JWT-based user logins and implement a user data access endpoint
This project have enabled user registration for application, implement a new POST /users/login API endpoint that allows a registered user to log in by sending their username and password. If the username/password combination is valid, this project responds with a JWT token, which the user can then send with future requests to authenticate themselves. The JWT token payload should contain the user's ID and it should expire after 24 hours.
 * If a user attempts to log in with an invalid username or password, you should respond with a 401 error.

## 5. Require authorization to perform certain API actions
Once users can log in, modify Instagram API so that it requires clients to authenticate users to implement the following authorization scheme:
  * Only an authorized user can see their own user information.
  * Only an authorized user can create new photos, reviews, and like.
  * Only an authorized user can modify or delete their own photos, reviews, and like.

## 6. Rate limiting
 * Requests that do not come from an authenticated user are rate-limited on a per-IP address basis. These unauthenticated requests can be made at a rate of 5 requests per minute.
 * Requests that come from an authenticated user are rate-limited on a per-user basis. These authenticated requests can be made at a rate of 10 requests per minute.

## 7. Store uploaded photo data in GridFS
The API to store those image files in GridFS in the MongoDB database that's already powering the API. Photo metadata corresponding the image files should be stored alongside the files themselves.
 * GET /user/{id}
 * GET /photos/{id}

## 8. Use RabbitMQ to generate new image sizes offline
This API use RabbitMQ to facilitate the generation of multiple resized versions of every image. 
 * Implement a RabbitMQ consumer that generates multiple sizes for a given image. User should specifically use information from each message it processes to fetch a newly-uploaded photo file from GridFS and generate multiple smaller, resized versions of that photo file.
