import { IPhone } from '../interfaces/phone'
import FacebookConversation from './Conversations/FacebookConversation'
import InstagramConversation from './Conversations/InstagramConversation'
import IphoneConversation from './Conversations/IphoneConversation'
import TwitterConversation from './Conversations/TwitterConversation'
import WhatsappConversation from './Conversations/WhatsappConversation'

function Conversation(props: IPhone) {
    if (props.platform === 'whatsapp') return <WhatsappConversation {...props} />
    if (props.platform === 'facebook') return <FacebookConversation {...props} />
    if (props.platform === 'twitter') return <TwitterConversation {...props} />
    if (props.platform === 'instagram') return <InstagramConversation {...props} />
    if (props.platform === 'iphone') return <IphoneConversation {...props} />
    return null
}

export default Conversation