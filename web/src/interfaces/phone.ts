export interface IPhone {

    // Phone Settings
    width: number,
    height: number,
    platform: "whatsapp" | "facebook" | "twitter" | "instagram" | "tiktok",
    lightmode?: true | boolean,


    // Phone Status Settings
    battery?: 1 | 2 | 3 | 4,
    wifi?: 0 | 1 | 2 | 3,
    network?: 1 | 2 | 3 | 4,
    time?: string,

    // App Bar Settings
    name: string,
    image?: string,
    online?: true | boolean,

}