export interface PostType {
    _id: string,
    user: string,
    text: string,
    link: string
    postTime: string,
    comments: Array<string>,
    image: string,
    likes: Array<string>
}

export interface TokenType {
    user: UserType,
    token: string,
    message: string,
}

export interface UserType {
    _id: string,
    firstName: string,
    lastName: string,
    email: string,
    gender: string,
    birthday: string,
    accountCreationDate: string,
    password: string,
    bio: string,
    facebookId: string,
    friends: Array<string>,
    profilePhoto: string,
    posts: Array<string>,
    friendRequests: Array<string>
    outGoingFriendRequests: Array<string>
    savedPosts: Array<string>
}

export interface CommentType{
    _id: string
    user: string
    text: string
    commentTime: string
    replies: Array<string>
    likes: Array<string>
}

export interface ImgurType{
    link: string
}

export interface DataType {
    message: string
    post: PostType
    id: string
    token: TokenType
    user: UserType
    users: Array<UserType>
    posts: Array<PostType>
    ids: Array<string>
    comment: CommentType
    data: ImgurType
}

export interface RespType {
    data: DataType
}

export interface loginRespType{
    accessToken: string
    data: DataType
}