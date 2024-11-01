export interface IMessage {
    id: string,
    text: string,
    time: string, // e.g 13:24 or 04:24
    name: string,
    me: boolean,
    replyId?: string, // used to reference a previous message
    image?: string,
    reactions: Array<string>, // list of emojis
    read?: boolean,
    delay?: number,//in seconds
    opacity: number,//in seconds
    scale: number,//in seconds
    profileImage: string,
}