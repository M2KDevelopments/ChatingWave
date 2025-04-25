import { IPhone } from "./phone";

export interface IAppBar extends IPhone {
    chatImage: string;
    setChatImage(chatImage: string): void;
    onUpdateChatName: () => void,
}