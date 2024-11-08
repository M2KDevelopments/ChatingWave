import { IPhone } from '../../interfaces/phone'
import { IMessage } from '../../interfaces/message';
import bgWA from '../../assets/bg-whatsapp.png';
import bgWADark from '../../assets/bg-whatsapp-dark.png';
import { IoCheckmarkDoneSharp } from "react-icons/io5";
import { IoCheckmarkOutline } from "react-icons/io5";
import { useMemo, useState } from 'react';
import ModalTextMessage from '../Modals/ModalTextMessage';

const heightPercentage = 83 / 100.0;
const replyMessageHeightPercentage = 13 / 100.0;


function WhatsappConversation(props: IPhone) {

    const fontSize = 21 * (props.height / 1280);
    const [editMessage, setEditMessage] = useState({} as IMessage);


    const messageMap = useMemo(() => {
        const map = new Map<string, IMessage>();
        for (const msg of props.messages) map.set(msg.id, msg);
        return map;
    }, [props.messages]);


    const onRemoveEmoji = (msgIndex: number, index: number) => {
        props.messages[msgIndex].reactions = props.messages[msgIndex].reactions.filter((r, i) => r != null && i != index);
        props.setMessages([...props.messages]);
    }

    return (
        <div id={`conversation-${props.id}`} aria-label="conversation" className='w-full flex flex-col gap-2 p-3' style={{ overflowY: props.noScrollBar ? "hidden" : "scroll", height: props.height * heightPercentage, backgroundColor: props.lightmode ? "#efeae2" : "#0b141b", backgroundImage: props.lightmode ? `url('${bgWA}')` : `url('${bgWADark}')`, }}>
            {
                props.messages.map((msg, index) =>
                    <div
                        onDoubleClick={() => setEditMessage(msg)}
                        style={{
                            marginTop: index > 0 && props.messages[index - 1].me != msg.me ? 20 : 0,
                            background: props.lightmode ? (msg.me ? "#d9fdd3" : "white") : (msg.me ? "#154c37" : "#1f2c34"),
                            alignSelf: msg.me ? "end" : "auto", marginBottom: msg.reactions.length ? 22 : 0,
                            opacity: msg.opacity,
                            scale: msg.scale,
                            top: props.scrollY,
                            color: props.lightmode ? "#111827" : "#fefefe",
                            border: props.hoverIndex == index ? 'solid 2px orange' : undefined
                        }}
                        className='relative  max-w-[80%] rounded-lg shadow-lg flex flex-col p-2 cursor-pointer'
                        id={`msg-${props.id}-${msg.id}`} // msg-preview-{id} or msg-phone-{id}
                        key={msg.id + index}>

                        {/* Reply UI */}
                        {msg.replyId && messageMap.get(msg.replyId) ?
                            <div style={{
                                borderColor: messageMap.get(msg.replyId)!.me ? "#15803d" : "#7e22ce",
                                background: props.lightmode ? (msg.me ? "#d9fdd3" : "#f5f5f5") : (msg.me ? "#0d3727" : "#151c23"),
                            }}

                                className='border-l-4 rounded-md flex'>
                                <div className='flex flex-col gap-2 px-3 overflow-hidden w-[80%] text-ellipsis' style={{ maxHeight: props.height * replyMessageHeightPercentage }}>
                                    <p style={{ color: messageMap.get(msg.replyId)!.me ? "#15803d" : "#7e22ce", fontSize: fontSize }} className='font-bold'>{messageMap.get(msg.replyId)!.me ? "You" : messageMap.get(msg.replyId)!.name}</p>
                                    <p style={{ fontSize: fontSize }} className='font-thin'>{messageMap.get(msg.replyId)!.text}</p>
                                </div>
                                <div className='w-[20%]'>
                                    {messageMap.get(msg.replyId)!.image ?
                                        <img alt={props.name} src={messageMap.get(msg.replyId)!.image} className="w-full h-full rounded-r-md" />
                                        : null}
                                </div>
                            </div>
                            : null
                        }

                        {/* Image */}
                        {msg.image ? <div>
                            <img className='w-full rounded-md' src={msg.image} alt={msg.name} />
                        </div> : null}


                        {/* Actual Message */}
                        <p style={{ fontSize: fontSize }} className='mx-3 mt-2 mb-6'>{msg.text}</p>


                        {/* Time */}
                        <span style={{ fontSize: fontSize, color: props.lightmode ? "#6b7280" : "#659483" }} className='flex gap-2 absolute bottom-0 right-2 text-sm font-thin'>
                            {msg.time}
                            {
                                !msg.me ? null : <>
                                    {msg.read ? <IoCheckmarkDoneSharp color="blue" /> : <IoCheckmarkOutline />}
                                </>
                            }
                        </span>


                        {/* Reactions */}
                        <div className='w-full relative'>
                            {msg.reactions.length ?
                                <div style={{
                                    fontSize: fontSize,
                                    left: msg.me ? undefined : 4,
                                    right: msg.me ? 4 : undefined,
                                    background: props.lightmode ? "white" : "#1f2c34",
                                }} className='w-fit absolute -bottom-7 rounded-full px-2 shadow-sm flex justify-center items-center gap-2'>
                                    {msg.reactions.filter((_r, i: number) => i < 3).map((emoji, i) => <span onClick={() => onRemoveEmoji(index, i)} className='cursor-pointer' key={i + "emoji"}>{emoji}</span>)}
                                    {msg.reactions.length > 1 ? <span>{msg.reactions.length}</span> : null}
                                </div>
                                : null}
                        </div>


                    </div>
                )
            }
            <ModalTextMessage editMessage={editMessage} messages={props.messages} setMessages={props.setMessages} setEditMessage={setEditMessage} />

        </div>
    )
}

export default WhatsappConversation