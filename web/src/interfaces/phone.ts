import { IMessage } from "./message";

export interface IPhone {


    id: string,
    // Phone Settings
    width: number,
    height: number,
    platform: "whatsapp" | "facebook" | "twitter" | "instagram" | "tiktok" | 'iphone' | string,
    lightmode?: true | boolean,
    messages: Array<IMessage>,

    // Phone Status Settings
    battery?: 1 | 2 | 3 | 4,
    wifi?: 0 | 1 | 2 | 3,
    network?: 1 | 2 | 3 | 4,
    time?: string,

    // App Bar Settings
    name: string,
    image?: string,
    online?: true | boolean,

    // scrolling
    scrollY: number,
    noScrollBar: boolean,

    //function
    setMessages: (messages: Array<IMessage>) => void,
    hoverIndex: number,
    setHoverIndex: (index: number) => void,
}