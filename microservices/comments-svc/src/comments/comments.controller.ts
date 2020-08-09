import Aigle from 'aigle'

import { Controller, Inject } from '@nestjs/common'
import { GrpcMethod } from '@nestjs/microservices'

import { Metadata } from 'grpc'
import { get, isEmpty, isNil } from 'lodash'

import { ICount, IQuery } from '../commons/commons.interface'
import { ICommentsService, ICommentUpdateInput } from './comments.interface'
import { IFindPayload } from '../commons/cursor-pagination.interface'

import { Comment } from './comment.model'
import { CommentDto } from './comment.dto'

const { map } = Aigle

@Controller()
export class CommentsController {
  constructor(
    @Inject('CommentsService')
    private readonly service: ICommentsService
  ) {}

  @GrpcMethod('CommentsService', 'find')
  async find(query: IQuery): Promise<IFindPayload<Comment>> {
    const { results, cursors } = await this.service.find({
      attributes: !isEmpty(query.select) ? ['id'].concat(query.select) : undefined,
      where: !isEmpty(query.where) ? JSON.parse(query.where) : undefined,
      order: !isEmpty(query.orderBy) ? query.orderBy : undefined,
      limit: !isNil(query.limit) ? query.limit : 25,
      before: !isEmpty(query.before) ? query.before : undefined,
      after: !isEmpty(query.after) ? query.after : undefined
    })

    const result: IFindPayload<Comment> = {
      edges: await map(results, async (comment: Comment) => ({
        node: comment,
        cursor: Buffer.from(JSON.stringify([comment.id])).toString('base64')
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

  @GrpcMethod('CommentsService', 'findById')
  async findById({ id }): Promise<Comment> {
    const result: Comment = await this.service.findById(id)
    if (isEmpty(result)) throw new Error('Record not found.')

    return result
  }

  @GrpcMethod('CommentsService', 'findOne')
  async findOne(query: IQuery): Promise<Comment> {
    const result: Comment = await this.service.findOne({
      attributes: !isEmpty(query.select) ? query.select : undefined,
      where: !isEmpty(query.where) ? JSON.parse(query.where) : undefined
    })
    if (isEmpty(result)) throw new Error('Record not found.')

    return result
  }

  @GrpcMethod('CommentsService', 'count')
  async count(query: IQuery): Promise<ICount> {
    const count: number = await this.service.count({
      where: !isEmpty(query.where) ? JSON.parse(query.where) : undefined
    })
    return { count }
  }

  @GrpcMethod('CommentsService', 'create')
  async create(data: CommentDto): Promise<Comment> {
    const result: Comment = await this.service.create(data)
    return result
  }

  @GrpcMethod('CommentsService', 'update')
  async update(input: ICommentUpdateInput, metadata: Metadata): Promise<Comment> {
    const { id, data } = input
    const user: string = get(metadata.getMap(), 'user', '').toString()
    const comment: Comment = await this.service.findById(id)

    if (isEmpty(comment)) throw new Error(`Comment record with ID ${id} not found.`)

    if (comment.author !== user) throw new Error('You are not allowed to modify this comment.')

    const result: Comment = await this.service.update(id, data)
    return result
  }

  @GrpcMethod('CommentsService', 'destroy')
  async destroy(query: IQuery): Promise<ICount> {
    const count: number = await this.service.destroy({
      where: !isEmpty(query.where) ? JSON.parse(query.where) : undefined
    })
    return { count }
  }
}
