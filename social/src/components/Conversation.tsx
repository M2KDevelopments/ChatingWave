import { IMessage } from '../interfaces/message'
import { IPhone } from '../interfaces/phone'
import FacebookConversation from './Conversations/FacebookConversation'
import InstagramConversation from './Conversations/InstagramConversation'
import IphoneConversation from './Conversations/IphoneConversation'
import TwitterConversation from './Conversations/TwitterConversation'
import WhatsappConversation from './Conversations/WhatsappConversation'
import swal from 'sweetalert';

function Conversation(props: IPhone) {


    const onUpdateMessage = async (msg: IMessage) => {
        const choice = await swal({
            title: `Edit Conversation`,
            text: `What do you want to do?`,
            icon: 'info',
            buttons: {
                no: {
                    value: false,
                    text: "Cancel"
                },
                remove: {
                    value: "remove",
                    text: "Delete Message"
                },
                update: {
                    value: "update",
                    text: "Change Message"
                }
            }
        })


        if (!choice) return;

        if (choice == 'update') {
            const message = window.prompt('Update the message', msg.text);
            if (!message) return;
            const index = props.messages.findIndex(m => m.id == (msg.id || ""));
            props.messages[index].text = message || "";
            props.setMessages([...props.messages]);
        } else if (choice == 'remove') {
            props.setMessages(props.messages.filter((m) => m.id != (msg.id || "")));
        }
    }

    if (props.platform === 'whatsapp') return <WhatsappConversation {...props} onUpdateMessage={onUpdateMessage} />
    if (props.platform === 'facebook') return <FacebookConversation {...props} onUpdateMessage={onUpdateMessage} />
    if (props.platform === 'twitter') return <TwitterConversation {...props} onUpdateMessage={onUpdateMessage} />
    if (props.platform === 'instagram') return <InstagramConversation {...props} onUpdateMessage={onUpdateMessage} />
    if (props.platform === 'iphone') return <IphoneConversation {...props} onUpdateMessage={onUpdateMessage} />
    return null
}

export default Conversation