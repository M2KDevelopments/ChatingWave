import { IPhone } from '../interfaces/phone'
import AppBar from './AppBar';
import Conversation from './Conversation';
import Messaging from './Messaging';
import NetworkStatus from './NetworkStatus';


function Phone(props: IPhone) {

    return (
        <div id={props.id} className='flex flex-col relative' style={{ width: props.width, height: props.height }}>
            <NetworkStatus {...props} />
            <AppBar {...props} />
            <Conversation {...props} />
            <Messaging {...props} />
        </div>
    )
}

export default Phone