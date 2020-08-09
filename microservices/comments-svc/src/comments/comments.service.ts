import { isEmpty } from 'lodash'
import { Injectable } from '@nestjs/common'
import { FindOptions } from 'sequelize/types'
import { InjectModel } from '@nestjs/sequelize'

import { ICommentsService } from './comments.interface'
import { IFindAndPaginateOptions, IFindAndPaginateResult } from '../commons/find-and-paginate.interface'

import { Comment } from './comment.model'
import { CommentDto } from './comment.dto'

@Injectable()
export class CommentsService implements ICommentsService {
  constructor(
    @InjectModel(Comment)
    private readonly repo: typeof Comment
  ) {}

  async find(query?: IFindAndPaginateOptions): Promise<IFindAndPaginateResult<Comment>> {
    // @ts-ignore
    const result: IFindAndPaginateResult<Comment> = await this.repo.findAndPaginate({
      ...query,
      raw: true,
      paranoid: false
    })
    return result
  }

  async findById(id: string): Promise<Comment> {
    const result: Comment = await this.repo.findByPk(id, {
      raw: true
    })
    return result
  }

  async findOne(query: FindOptions): Promise<Comment> {
    const result: Comment = await this.repo.findOne({
      ...query,
      raw: true
    })
    return result
  }

  async count(query?: FindOptions): Promise<number> {
    const result: number = await this.repo.count(query)
    return result
  }

  async create(commentDto: CommentDto): Promise<Comment> {
    const result: Comment = await this.repo.create(commentDto)
    return result
  }

  async update(id: string, comment: CommentDto): Promise<Comment> {
    const record: Comment = await this.repo.findByPk(id)

    if (isEmpty(record)) throw new Error('Record not found.')

    const result: Comment = await record.update(comment)
    return result
  }

  async destroy(query?: FindOptions): Promise<number> {
    const result: number = await this.repo.destroy(query)
    return result
  }
}
