import { PubSubEngine } from "graphql-subscriptions";
import { PubSubPublishArgsByKey } from "./types";

export class TypedPubSub<
  TPubSubPublishArgsByKey extends PubSubPublishArgsByKey
> {
  private readonly pubSub: PubSubEngine;

  public constructor(pubSub: PubSubEngine) {
    this.pubSub = pubSub;
  }

  public async publish<
    TKey extends Extract<keyof TPubSubPublishArgsByKey, string>
  >(routingKey: TKey, ...args: TPubSubPublishArgsByKey[TKey]): Promise<void> {
    if (args[1] !== undefined) {
      await this.pubSub.publish(`${routingKey}:${args[0] as number}`, args[1]);
    }

    await this.pubSub.publish(routingKey, args[0]);
  }

  public asyncIterator<
    TKey extends Extract<keyof TPubSubPublishArgsByKey, string>
  >(
    ...[routingKey, id]: TPubSubPublishArgsByKey[TKey][1] extends undefined
      ? [TKey]
      : [TKey, TPubSubPublishArgsByKey[TKey][0]]
  ): AsyncIterator<
    TPubSubPublishArgsByKey[TKey][1] extends undefined
      ? TPubSubPublishArgsByKey[TKey][0]
      : TPubSubPublishArgsByKey[TKey][1]
  > {
    return this.pubSub.asyncIterator(
      id === undefined ? routingKey : `${routingKey}:${id as number}`
    );
  }
}
