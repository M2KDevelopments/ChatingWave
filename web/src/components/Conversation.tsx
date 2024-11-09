import { IMessage } from '../interfaces/message'
import { IPhone } from '../interfaces/phone'
import FacebookConversation from './Conversations/FacebookConversation'
import InstagramConversation from './Conversations/InstagramConversation'
import IphoneConversation from './Conversations/IphoneConversation'
import TwitterConversation from './Conversations/TwitterConversation'
import WhatsappConversation from './Conversations/WhatsappConversation'

function Conversation(props: IPhone) {


    const onUpdateMessage = async (msg: IMessage) => {
        const message = await swal({
            title: `Update the message`,
            icon: `icon`,
            content: {
                element: `textarea`,
                attributes: {
                    value: msg.text,
                    placeholder: "Enter the message here..."
                }
            },
            buttons: ['Cancel', 'Save']
        });

        if (!message) return;

        const index = props.messages.findIndex(m => m.id == (msg.id || ""));
        props.messages[index].text = message || "";
        props.setMessages([...props.messages]);
    }

    if (props.platform === 'whatsapp') return <WhatsappConversation {...props} onUpdateMessage={onUpdateMessage} />
    if (props.platform === 'facebook') return <FacebookConversation {...props} onUpdateMessage={onUpdateMessage} />
    if (props.platform === 'twitter') return <TwitterConversation {...props} onUpdateMessage={onUpdateMessage} />
    if (props.platform === 'instagram') return <InstagramConversation {...props} onUpdateMessage={onUpdateMessage} />
    if (props.platform === 'iphone') return <IphoneConversation {...props} onUpdateMessage={onUpdateMessage} />
    return null
}

export default Conversation