import { IMessage } from '../interfaces/message';
import { IPhone } from '../interfaces/phone';
import FacebookMessaging from './Messaging/FacebookMessaging';
import InstagramMessaging from './Messaging/InstagramMessaging';
import IphoneMessaging from './Messaging/IphoneMessaging';
import TwitterMessaging from './Messaging/TwitterMessaging';
import WhatsappMessaging from './Messaging/WhatsappMessaging';
import { toast } from 'react-toastify'
import emily from '../assets/emily.jpg';
import youImage from '../assets/you.png';
import { useState } from 'react';


function Messaging(props: IPhone) {

    const [messageImage, setMessageImage] = useState("");


    const onAddMessage = async (messageText: string) => {

        if (messageText.trim() == '') return;
        const d = new Date()
        const h = d.getHours() < 10 ? `0${d.getHours()}` : d.getHours()
        const m = d.getMinutes() < 10 ? `0${d.getMinutes()}` : d.getMinutes();
        const messageTime = `${h}:${m}`;
        const message = {
            id: crypto.randomUUID(),
            me: props.indexPerson == -1,
            reactions: [],
            text: messageText,
            time: messageTime,
            image: messageImage,
            name: props.indexPerson == -1 ? "Me" : props.people[props.indexPerson].name,
            read: true,
            scale: 1,
            opacity: 1,
            profileImage: props.indexPerson == -1 ? youImage : props.people[props.indexPerson].image || emily,
        } as IMessage;
        props.setMessages([...props.messages, message]);
        setMessageImage("");

    }


    const onImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files?.length) {
            const file = e.target.files[0];
            if (file.type.includes("image")) {
                const url = URL.createObjectURL(file);
                setMessageImage(url);
            } else {
                toast.error('Please upload an image');
            }
        }
    }

    if (props.platform === 'whatsapp') return <WhatsappMessaging {...props} onAddMessage={onAddMessage} messageImage={messageImage} onImageUpload={onImageUpload} />
    if (props.platform === 'facebook') return <FacebookMessaging {...props} onAddMessage={onAddMessage} messageImage={messageImage} onImageUpload={onImageUpload} />
    if (props.platform === 'twitter') return <TwitterMessaging {...props} onAddMessage={onAddMessage} messageImage={messageImage} onImageUpload={onImageUpload} />
    if (props.platform === 'instagram') return <InstagramMessaging {...props} onAddMessage={onAddMessage} messageImage={messageImage} onImageUpload={onImageUpload} />
    if (props.platform === 'iphone') return <IphoneMessaging {...props} onAddMessage={onAddMessage} messageImage={messageImage} onImageUpload={onImageUpload} />
    return null
}

export default Messaging