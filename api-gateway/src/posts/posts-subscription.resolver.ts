import { Inject } from '@nestjs/common'
import { Resolver, Subscription } from '@nestjs/graphql'
import { PubSub } from 'graphql-subscriptions'

@Resolver()
export class PostsSubscriptionResolver {
  constructor(
    @Inject('PubSubService')
    private readonly pubSubService: PubSub
  ) {}

  @Subscription('postAdded', {
    resolve: (value: Comment) => value
  })
  postAdded(): AsyncIterator<unknown, any, undefined> {
    return this.pubSubService.asyncIterator('postAdded')
  }
}
