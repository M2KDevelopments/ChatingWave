import { IPhone } from '../interfaces/phone'
import AppBar from './AppBar';
import Conversation from './Conversation';
import Messaging from './Messaging';
import NetworkStatus from './NetworkStatus';

const styles = {
    borderStyle: "solid",
    borderWidth: 5,
    borderColor: "lightgray",
    borderRadius: 8,
} as React.CSSProperties

function Phone(props: IPhone) {

    return (
        <div style={props.id == "preview" && !props.fullscreen ? styles : {}}>
            <div id={props.id} className='flex flex-col relative' style={{ width: props.fullscreen ? "100%" : props.width, height: props.fullscreen ? "73vh" : props.height }}>
                <NetworkStatus {...props} />
                <AppBar {...props} />
                <Conversation  {...props} />
                <Messaging {...props} />
            </div>
        </div>
    )
}

export default Phone