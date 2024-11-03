import emily from './emily.jpg';
export const MESSAGES = [
    {
        id: "1",
        me: false,
        text: "Hello there how are you doing?",
        time: "12:24",
        name: "Emily Bank",
        reactions: ["🫡", "🫵🏽", "👉🏽", "💯", "🔥"],
        scale: 1,
        opacity: 1,
        profileImage: emily
    },
    {
        id: "2",
        me: true,
        reactions: ["🫡", "🫵🏽", "👉🏽", "💯", "🔥"],
        text: "Hello there how are you doing?",
        time: "12:25",
        name: "Me",
        image: "https://images.pexels.com/photos/886521/pexels-photo-886521.jpeg?auto=compress&cs=tinysrgb&w=600",
        scale: 1,
        opacity: 1,
        profileImage: emily
    },
    {
        id: "3",
        me: true,
        reactions: ["🫡"],
        text: "Hello there how are you doing?\nHello there how are you doing?\nHello there how are you doing? Hello there how are you doing? Hello there how are you doing?",
        time: "12:28",
        name: "Me",
        replyId: "2",
        read: true,
        scale: 1,
        opacity: 1,
        profileImage: emily
    },

    {
        id: "4",
        me: false,
        reactions: [],
        text: "Hello there how are you doing?",
        time: "12:24",
        name: "Emily Bank",
        scale: 1,
        opacity: 1,
        profileImage: emily
    },
    {
        id: "5",
        me: true,
        reactions: [],
        text: "Hello there how are you doing?",
        time: "12:25",
        name: "Me",
        image: "https://images.pexels.com/photos/886521/pexels-photo-886521.jpeg?auto=compress&cs=tinysrgb&w=600",
        scale: 1,
        opacity: 1,
        profileImage: emily
    },
    {
        id: "6",
        me: true,
        reactions: ["🫡"],
        text: "Hello there how are you doing?\nHello there how are you doing?\nHello there how are you doing? Hello there how are you doing? Hello there how are you doing?",
        time: "12:28",
        name: "Me",
        replyId: "1",
        read: true,
        scale: 1,
        opacity: 1,
        profileImage: emily
    },

    {
        id: "7",
        me: false,
        reactions: [],
        text: "Hello there how are you doing?",
        time: "12:24",
        replyId: "1",
        name: "Emily Bank",
        scale: 1,
        opacity: 1,
        profileImage: emily
    },
    {
        id: "8",
        me: true,
        reactions: [],
        text: "Hello there how are you doing?",
        time: "12:25",
        name: "Me",
        image: "https://images.pexels.com/photos/886521/pexels-photo-886521.jpeg?auto=compress&cs=tinysrgb&w=600",
        scale: 1,
        opacity: 1,
        profileImage: emily
    },
    {
        id: "9",
        me: true,
        reactions: ["🫡", "🫡"],
        text: "Hello there how are you doing?\nHello there how are you doing?\nHello there how are you doing? Hello there how are you doing? Hello there how are you doing?",
        time: "12:28",
        name: "Me",
        replyId: "1",
        read: true,
        scale: 1,
        opacity: 1,
        profileImage: emily
    }
]