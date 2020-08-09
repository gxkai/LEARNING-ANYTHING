import Aigle from 'aigle'

import { Controller, Inject } from '@nestjs/common'
import { GrpcMethod } from '@nestjs/microservices'

import { Metadata } from 'grpc'
import { get, isEmpty, isNil } from 'lodash'

import { ICount, IQuery } from '../commons/commons.interface'
import { IPostsService, IPostUpdateInput } from './posts.interface'
import { IFindPayload } from '../commons/cursor-pagination.interface'

import { Post } from './post.model'
import { PostDto } from './post.dto'

const { map } = Aigle

@Controller()
export class PostsController {
  constructor(
    @Inject('PostsService')
    private readonly service: IPostsService
  ) {}

  @GrpcMethod('PostsService', 'find')
  async find(query: IQuery): Promise<IFindPayload<Post>> {
    const { results, cursors } = await this.service.find({
      attributes: !isEmpty(query.select) ? ['id'].concat(query.select) : undefined,
      where: !isEmpty(query.where) ? JSON.parse(query.where) : undefined,
      order: !isEmpty(query.orderBy) ? query.orderBy : undefined,
      limit: !isNil(query.limit) ? query.limit : 25,
      before: !isEmpty(query.before) ? query.before : undefined,
      after: !isEmpty(query.after) ? query.after : undefined
    })

    const result: IFindPayload<Post> = {
      edges: await map(results, async (post: Post) => ({
        node: post,
        cursor: Buffer.from(JSON.stringify([post.id])).toString('base64')
      })),
      pageInfo: {
        startCursor: cursors.before || '',
        endCursor: cursors.after || '',
        hasNextPage: cursors.hasNext || false,
        hasPreviousPage: cursors.hasPrevious || false
      }
    }
    return result
  }

  @GrpcMethod('PostsService', 'findById')
  async findById({ id }): Promise<Post> {
    const result: Post = await this.service.findById(id)
    if (isEmpty(result)) throw new Error('Record not found.')

    return result
  }

  @GrpcMethod('PostsService', 'findOne')
  async findOne(query: IQuery): Promise<Post> {
    const result: Post = await this.service.findOne({
      attributes: !isEmpty(query.select) ? query.select : undefined,
      where: !isEmpty(query.where) ? JSON.parse(query.where) : undefined
    })
    if (isEmpty(result)) throw new Error('Record not found.')

    return result
  }

  @GrpcMethod('PostsService', 'count')
  async count(query: IQuery): Promise<ICount> {
    const count: number = await this.service.count({
      where: !isEmpty(query.where) ? JSON.parse(query.where) : undefined
    })
    return { count }
  }

  @GrpcMethod('PostsService', 'create')
  async create(data: PostDto): Promise<Post> {
    const result: Post = await this.service.create(data)
    return result
  }

  @GrpcMethod('PostsService', 'update')
  async update(input: IPostUpdateInput, metadata: Metadata): Promise<Post> {
    const { id, data } = input
    const user: string = get(metadata.getMap(), 'user', '').toString()
    const post: Post = await this.service.findById(id)

    if (isEmpty(post)) throw new Error(`Post record with ID ${id} not found.`)

    if (post.author !== user) throw new Error('You are not allowed to modify this post.')

    const result: Post = await this.service.update(id, data)
    return result
  }

  @GrpcMethod('PostsService', 'destroy')
  async destroy(query: IQuery): Promise<ICount> {
    const count: number = await this.service.destroy({
      where: !isEmpty(query.where) ? JSON.parse(query.where) : undefined
    })
    return { count }
  }
}
