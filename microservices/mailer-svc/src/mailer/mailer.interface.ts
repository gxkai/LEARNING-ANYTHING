export interface ISendMailInput {
  template: string
  to: string
  newComment: {
    postAuthor: string
    commentAuthor: string
    comment: string
    post: string
  }
  signup: {
    name: string
  }
  updatePassword: {
    name: string
  }
  updateEmail: {
    name: string
  }
}

export interface ISendMailPayload {
  isSent: boolean
}
