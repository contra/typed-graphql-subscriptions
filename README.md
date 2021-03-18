# `typed-graphql-subscriptions`

> Type-safe PubSub wrapper for GraphQL subscriptions

## Installation

```
npm install typed-graphql-subscriptions
```

## Usage

Create a TypeScript type mapping the name of each PubSub channel to a [Tuple](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-1-3.html#tuple-types) that represents the arguments that will be passed to `publish`.

```ts
type Channels = {
  announcementCreated: [{ body: string }];
};
```

More commonly, you want to utilize a composite name for your channel where `chatMessageReceived:42` and `chatMessageReceived:43` are separate channels but share the same type for the payload. We can define the types for these channels like this:

```ts
type Channels = {
  announcementCreated: [{ body: string }];
  chatMessageReceived: [number, { body: string }];
};
```

Create a PubSub instance and pass it to `TypedPubSub`'s contructor, making sure to include the generic type variable:

```ts
import { PubSub } from "graphql-subscriptions";
import { TypedPubSub } from "typed-graphql-subscriptions";

const pubSub = new PubSub();
const typedPubSub = new TypedPubSub<Channels>(pubSub);
```

> Note: You can use any PubSub implementation you like (for example, [this one](https://github.com/Surnet/graphql-amqp-subscriptions)), as long as it implements `PubSubEngine`.

Now you can safely invoke `subscribe` using either two or three arguments:

```ts
typedPubSub.publish("announcementCreated", {
  body: "Site is down for maintenance.",
});

typedPubSub.publish("chatMessageReceived", 42, { message: "Hello." });
```

The `asyncIterator` method is called similarly:

```ts
typedPubSub.asyncIterator("announcementCreated");

typedPubSub.asyncIterator("chatMessageReceived", 42);
```
