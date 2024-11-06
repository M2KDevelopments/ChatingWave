import { IPhone } from '../interfaces/phone'
import FacebookAppBar from './AppBars/FacebookAppBar'
import InstagramAppBar from './AppBars/InstagramAppBar'
import IphoneAppBar from './AppBars/IphoneAppBar'
import TwitterAppBar from './AppBars/TwitterAppBar'
import WhatsappAppBar from './AppBars/WhatsappAppBar'

function AppBar(props: IPhone) {

  if (props.platform === 'whatsapp') return <WhatsappAppBar {...props} />
  if (props.platform === 'facebook') return <FacebookAppBar {...props} />
  if (props.platform === 'twitter') return <TwitterAppBar {...props} />
  if (props.platform === 'instagram') return <InstagramAppBar {...props} />
  if (props.platform === 'iphone') return <IphoneAppBar {...props} />
  return null
}

export default AppBar