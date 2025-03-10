import { IPhone } from '../../interfaces/phone'
import { IMessage } from '../../interfaces/message';
import bgWA from '../../assets/bg-whatsapp.png';
import { IoCheckmarkDoneSharp } from "react-icons/io5";
import { IoCheckmarkOutline } from "react-icons/io5";
import { useMemo } from 'react';

const heightPercentage = 83 / 100.0;
const replyMessageHeightPercentage = 13 / 100.0;


interface IConvo extends IPhone {
    onUpdateMessage: (message: IMessage) => void;
}


function IphoneConversation(props: IConvo) {

    const fontSize = 21 * (props.height / 1280);


    const messageMap = useMemo(() => {
        const map = new Map<string, IMessage>();
        for (const msg of props.messages) map.set(msg.id, msg);
        return map;
    }, [props.messages]);


    return (
        <div id={`conversation-${props.id}`} aria-label="conversation" className='w-full flex flex-col gap-2 p-3' style={{ overflowY: props.noScrollBar ? "hidden" : "scroll", height: props.height * heightPercentage, backgroundColor: props.lightmode ? "#efeae2" : "#494847", backgroundImage: `url('${bgWA}')` }}>
            {
                props.messages.map((msg, index) =>
                    <div
                        style={{
                            marginTop: index > 0 && props.messages[index - 1].me != msg.me ? 20 : 0,
                            background: msg.me ? "#d9fdd3" : "white",
                            alignSelf: msg.me ? "end" : "auto", marginBottom: msg.reactions.length ? 22 : 0,
                            opacity: msg.opacity,
                            scale: msg.scale,
                            top: props.scrollY,
                        }}
                        className='relative text-gray-900 max-w-[80%] rounded-lg shadow-lg flex flex-col p-2'
                        id={`msg-${props.id}-${msg.id}`} // msg-preview-{id} or msg-phone-{id}
                        key={msg.id + index}>

                        {/* Reply UI */}
                        {msg.replyId && messageMap.get(msg.replyId) ?
                            <div style={{ borderColor: messageMap.get(msg.replyId)!.me ? "#15803d" : "#7e22ce", background: msg.me ? "#d1f4cc" : "#f5f5f5" }} className='border-l-4 rounded-md flex'>
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
                        <span style={{ fontSize: fontSize }} className='flex gap-2 absolute bottom-0 right-2 text-sm font-thin text-gray-500'>
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
                                <div style={{ fontSize: fontSize, left: msg.me ? undefined : 4, right: msg.me ? 4 : undefined }} className='w-fit absolute -bottom-7 rounded-full px-2 bg-white shadow-sm flex justify-center items-center gap-2'>
                                    {msg.reactions.filter((_r, i: number) => i < 3).map((emoji, i) => <span key={i + "emoji"}>{emoji}</span>)}
                                    {msg.reactions.length > 1 ? <span>{msg.reactions.length}</span> : null}
                                </div>
                                : null}
                        </div>


                    </div>
                )
            }
        </div>
    )
}

export default IphoneConversation