import emily from './emily.jpg';
import you from './you.png';

export const CHATNAME = "Chating Wave";
export const PERSONNAME = "Emily";

export const MESSAGES = [
    {
        id: "1",
        me: false,
        text: "Hi! What is Chating Wave?",
        time: "10:00",
        name: PERSONNAME,
        reactions: [],
        scale: 1,
        opacity: 1,
        profileImage: emily
    },
    {
        id: "2",
        me: true,
        text: "Hi Emily! Chating Wave is an app that lets you simulate chat conversations, like WhatsApp and Facebook Messenger, for storytelling or fun projects.",
        time: "10:01",
        name: "Me",
        image: emily,
        reactions: [],
        scale: 1,
        opacity: 1,
        profileImage: you
    },
    {
        id: "3",
        me: false,
        text: "Oh, that sounds interesting! Can I generate screenshots with it?",
        time: "10:02",
        name: PERSONNAME,
        reactions: [],
        scale: 1,
        opacity: 1,
        profileImage: emily
    },
    {
        id: "4",
        me: true,
        text: "Yes, you can! You can create both screenshots and videos of the simulated conversations.",
        time: "10:03",
        name: "Me",
        reactions: ["👍"],
        scale: 1,
        opacity: 1,
        profileImage: you
    },
    {
        id: "5",
        me: false,
        text: "Can I customize the messages?",
        time: "10:04",
        name: PERSONNAME,
        reactions: [],
        scale: 1,
        opacity: 1,
        profileImage: emily
    },
    {
        id: "6",
        me: true,
        text: "Absolutely! You can customize the text, images, reactions, timestamps, and even who is sending the message.",
        time: "10:05",
        name: "Me",
        reactions: [],
        scale: 1,
        opacity: 1,
        profileImage: you
    },
    {
        id: "7",
        me: false,
        text: "That’s awesome! Is it free to use?",
        time: "10:06",
        name: PERSONNAME,
        reactions: [],
        scale: 1,
        opacity: 1,
        profileImage: emily
    },
    {
        id: "8",
        me: true,
        text: "The basic features are free, but we also offer premium options for advanced customization.",
        time: "10:07",
        name: "Me",
        reactions: ["😊"],
        scale: 1,
        opacity: 1,
        profileImage: you
    },
    {
        id: "9",
        me: false,
        text: "Thanks for the info! I’ll definitely try it out.",
        time: "10:08",
        name: PERSONNAME,
        reactions: ["👏"],
        scale: 1,
        opacity: 1,
        profileImage: emily
    }
];