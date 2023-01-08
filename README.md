## Tech Choices

This is the backend for a simple messenger application using [Nest.js](https://github.com/nestjs/nest). I was set on using Next.js for the frontend, a decision which is discussed in the frontend repository's README. Therefore, we have a few options to provide the necessary two-way communication for our app. The most straightforward of these would be a third-party provider, such as Pusher or Ably, or perhaps even something like Supabase. It would be necessary to use one of these services if we were to use built-in Next.js API routes, since these are meant to be serverless/edge functions and can’t maintain a WebSocket connection under typical deployment circumstances. However, turning to one of these services would remove a lot of the interesting work this project has to offer, so I don’t feel like they’d be the right approach in our case despite being the simplest option. This removes Next.js API routes and the aforementioned third-party providers as options, so let’s move on.

If we’re not going to use a third-party service, what are we left with? At its most basic level, the real time two-way communications we require are almost always implemented with WebSockets. I think this barebones route would provide an interesting project with many opportunities for learning, so let’s go from here. The most basic way to set up WebSockets manually would likely be with a custom Express.js server, which would be perfect for a rudimentary messenger application. However, we are working with a limited time frame, and I’d really like to build something extensible. This is where Nest.js comes in. It is built on top of Express.js and provides a more “batteries included” approach so we can quickly develop a well-architected application. I actually haven’t used it in a couple years, but I recall it being a valuable tool for building very scalable and testable applications in one of my previous roles. I also remember it having particularly good integrations with Socket.io and TypeORM. This should be perfect for getting us up and running with WebSockets and a database in a reasonable time frame while still providing a lot of flexibility.

## Description

Now that we’ve decided on Nest.js with Socket.io and TypeORM integrations, let’s think about how to actually structure the application. To meet our messaging needs, I believe we’ll need three primary data entities. These include users, messages, and rooms to connect the users and messages. I think the usage of rooms is particularly important, since it allows us to connect more than two users to a series of messages should we chose to do so in the future. In terms of an actual database, we can leverage the Nest.js/TypeORM synchronize feature with SQLite to simply generate a database according to our specifications when we start the server.

We’ll mostly be sending and receiving data via WebSockets to keep things simple, but we can implement some REST API endpoints too. These include getting a list of other users and a pseudo-auth endpoint to get or create a user based on a given username. The advantage of using REST endpoints for these in particular is that it facilitates the use of SSR on the frontend, which is particularly important in terms of having our pseudo-auth implementation ready to go when the page loads.

Finally, let’s discuss the actual application of WebSockets for this app. When a user connects, we will emit a message from the client to the server with their user id, which will allow us to associate the id of the user with the id of the WebSocket client in the database. With this information, we essentially have an “address” for other clients to send messages to in real time. We can also do the inverse when a client disconnects and clear the socket id of the relevant user, which will enable showing online status indicators on the frontend.

Of course, we’ll need WebSocket listeners to create rooms and send messages as well. To keep things simple, when a user is selected as a recipient on the frontend, we can send both the sender id and recipient id to the backend. We’ll use this to either get an existing room shared by the two if there is one or create and return a new one if needed. We’d need to do this a bit differently if we were implementing groups of >2 people in terms of differentiating private and group rooms, but we won’t worry about that right now for the sake of time. As for sending messages, we can emit a message with body text, a room id, and a sender id from the frontend. Then, we can use this information to create a message in the database and fetch the room with its corresponding users to emit the message to other frontend clients in real time With that, we’ve got a basic yet functional messaging app.

## Future Considerations

There are a lot of ways we could improve this application if time constraints permitted. I jotted down some things that come to mind below.

- Add proper test coverage, especially around the chat gateway and more complex services
- Potentially leverage Socket.io's concept of rooms to send messages to rooms, rather than all the individuals in a room
- Update code which assumes two users per room to allow >2 people to chat at once
- Implement pagination, since we obviously we don't want to load thousands of messages or users at once
- Add thoughtful error handling, as there are a lot of opportunities in an app like this for unexpected things to happen
- More intentional separation between modules and layers
- Optimize for fewer database transactions
- Add a real authentication system instead of just going off usernames
- Add additional information to data models, like tracking parent messages to facilitate direct replies
- Consider better clean up around things like socket ids just in case they go out of sync with the frontend

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
