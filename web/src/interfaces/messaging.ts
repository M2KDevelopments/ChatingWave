import { IPhone } from "./phone";

export interface IMessaging extends IPhone {
    messageImage: string,
    onAddMessage: (messageText: string) => void,
    onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void,
}