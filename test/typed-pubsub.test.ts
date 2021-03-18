import { Chance } from "chance";
import { PubSub } from "graphql-subscriptions";
import { TypedPubSub } from "../lib";

type PubSubPublishArgsByKey = {
  announcementCreated: [{ body: string }];
  chatMessageReceived: [number, { message: string }];
};

const chance = Chance();

describe("Basic functionality", () => {
  test("Publishes and subscribes using a simple key", async () => {
    const typedPubSub = new TypedPubSub<PubSubPublishArgsByKey>(new PubSub());
    const asyncIterator = typedPubSub.asyncIterator("announcementCreated");
    const sentAnnouncements = [
      chance.sentence(),
      chance.sentence(),
      chance.sentence(),
    ];

    setTimeout(() => {
      typedPubSub.publish("announcementCreated", {
        body: sentAnnouncements[0],
      });
      typedPubSub.publish("announcementCreated", {
        body: sentAnnouncements[1],
      });
      typedPubSub.publish("announcementCreated", {
        body: sentAnnouncements[2],
      });
    });

    const receivedAnnouncements = [
      (await asyncIterator.next()).value.body,
      (await asyncIterator.next()).value.body,
      (await asyncIterator.next()).value.body,
    ];

    expect(receivedAnnouncements).toEqual(sentAnnouncements);
  });

  test("Publishes and subscribes using a composite key", async () => {
    const typedPubSub = new TypedPubSub<PubSubPublishArgsByKey>(new PubSub());
    const asyncIterator = typedPubSub.asyncIterator("chatMessageReceived", 42);
    const sentMessages = [
      chance.sentence(),
      chance.sentence(),
      chance.sentence(),
    ];

    setTimeout(() => {
      typedPubSub.publish("chatMessageReceived", 42, {
        message: sentMessages[0],
      });
      typedPubSub.publish("chatMessageReceived", 42, {
        message: sentMessages[1],
      });
      typedPubSub.publish("chatMessageReceived", 42, {
        message: sentMessages[2],
      });
    });

    const receivedMessages = [
      (await asyncIterator.next()).value.message,
      (await asyncIterator.next()).value.message,
      (await asyncIterator.next()).value.message,
    ];

    expect(receivedMessages).toEqual(sentMessages);
  });
});
