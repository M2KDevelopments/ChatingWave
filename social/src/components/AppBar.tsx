import { IPhone } from '../interfaces/phone'
import FacebookAppBar from './AppBars/FacebookAppBar'
import InstagramAppBar from './AppBars/InstagramAppBar'
import IphoneAppBar from './AppBars/IphoneAppBar'
import TwitterAppBar from './AppBars/TwitterAppBar'
import WhatsappAppBar from './AppBars/WhatsappAppBar'
import swal from 'sweetalert';

function AppBar(props: IPhone) {

  const onUpdateChatName = async () => {
    const name = await swal({
      title: `Update Chat Name`,
      text: 'Enter the chat name',
      icon: 'info',
      content: {
        element: 'input',
        attributes: {
          value: props.name
        }
      },
      buttons: ['Cancel', 'Update']
    });

    if (!name) return;
    props.setChatName(name);
  }

  if (props.platform === 'whatsapp') return <WhatsappAppBar {...props} chatImage={props.image!} onUpdateChatName={onUpdateChatName} />
  if (props.platform === 'facebook') return <FacebookAppBar {...props} chatImage={props.image!} onUpdateChatName={onUpdateChatName} />
  if (props.platform === 'twitter') return <TwitterAppBar {...props} chatImage={props.image!} onUpdateChatName={onUpdateChatName} />
  if (props.platform === 'instagram') return <InstagramAppBar {...props} chatImage={props.image!} onUpdateChatName={onUpdateChatName} />
  if (props.platform === 'iphone') return <IphoneAppBar {...props} chatImage={props.image!} onUpdateChatName={onUpdateChatName} />
  return null
}

export default AppBar