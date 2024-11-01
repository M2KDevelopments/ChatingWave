import { IPhone } from '../interfaces/phone';
import FacebookMessaging from './Messaging/FacebookMessaging';
import InstagramMessaging from './Messaging/InstagramMessaging';
import IphoneMessaging from './Messaging/IphoneMessaging';
import TwitterMessaging from './Messaging/TwitterMessaging';
import WhatsappMessaging from './Messaging/WhatsappMessaging';

function Messaging(props: IPhone) {

    if (props.platform === 'whatsapp') return <WhatsappMessaging {...props} />
    if (props.platform === 'facebook') return <FacebookMessaging {...props} />
    if (props.platform === 'twitter') return <TwitterMessaging {...props} />
    if (props.platform === 'instagram') return <InstagramMessaging {...props} />
    if (props.platform === 'iphone') return <IphoneMessaging {...props} />
    return null
}

export default Messaging