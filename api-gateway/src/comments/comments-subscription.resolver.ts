import { Inject } from '@nestjs/common'
import { Resolver, Subscription } from '@nestjs/graphql'
import { PubSub } from 'graphql-subscriptions'

import { Comment } from '../graphql/typings'

@Resolver()
export class CommentsSubscriptionResolver {
  constructor(
    @Inject('PubSubService')
    private readonly pubSubService: PubSub,
  ) {}

  @Subscription('commentAdded', {
    resolve: (value: Comment) => value,
    filter: (payload: Comment, variables: Record<string, any>) => payload.post === variables.post
  })
  commentAdded(): AsyncIterator<unknown, any, undefined> {
    return this.pubSubService.asyncIterator('commentAdded')
  }
}
