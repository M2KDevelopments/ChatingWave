import { useEffect, useState } from "react"
import Phone from "./components/Phone";
import { IMessage } from "./interfaces/message";


function App() {

  const [size, setSize] = useState({ width: 500, height: 889 });
  const [messages, setMessages] = useState([] as Array<IMessage>)

  useEffect(() => {
    // Todo Automatically adjust as the window resizes
    setSize({ width: 500, height: 889 });

    // Set Messages
    setMessages([
      {
        id: "1",
        me: false,
        reactions: [],
        text: "Hello there how are you doing?",
        time: "12:24",
        name: "Emily Bank"
      },
      {
        id: "2",
        me: true,
        reactions: [],
        text: "Hello there how are you doing?",
        time: "12:25",
        name: "Me",
        image: "https://images.pexels.com/photos/886521/pexels-photo-886521.jpeg?auto=compress&cs=tinysrgb&w=600"
      },
      {
        id: "3",
        me: true,
        reactions: ["🫡"],
        text: "Hello there how are you doing?\nHello there how are you doing?\nHello there how are you doing? Hello there how are you doing? Hello there how are you doing?",
        time: "12:28",
        name: "Me",
        replyId: "1",
        read: true,
      },

      {
        id: "4",
        me: false,
        reactions: [],
        text: "Hello there how are you doing?",
        time: "12:24",
        name: "Emily Bank"
      },
      {
        id: "5",
        me: true,
        reactions: [],
        text: "Hello there how are you doing?",
        time: "12:25",
        name: "Me",
        image: "https://images.pexels.com/photos/886521/pexels-photo-886521.jpeg?auto=compress&cs=tinysrgb&w=600"
      },
      {
        id: "6",
        me: true,
        reactions: ["🫡"],
        text: "Hello there how are you doing?\nHello there how are you doing?\nHello there how are you doing? Hello there how are you doing? Hello there how are you doing?",
        time: "12:28",
        name: "Me",
        replyId: "1",
        read: true,
      },

      {
        id: "7",
        me: false,
        reactions: [],
        text: "Hello there how are you doing?",
        time: "12:24",
        name: "Emily Bank"
      },
      {
        id: "8",
        me: true,
        reactions: [],
        text: "Hello there how are you doing?",
        time: "12:25",
        name: "Me",
        image: "https://images.pexels.com/photos/886521/pexels-photo-886521.jpeg?auto=compress&cs=tinysrgb&w=600"
      },
      {
        id: "9",
        me: true,
        reactions: ["🫡"],
        text: "Hello there how are you doing?\nHello there how are you doing?\nHello there how are you doing? Hello there how are you doing? Hello there how are you doing?",
        time: "12:28",
        name: "Me",
        replyId: "1",
        read: true,
      }
    ]);
  }, [])

  return (
    <main className="flex w-screen h-screen overflow-hidden">
      <section className="w-1/3 flex justify-center flex-col m-auto items-center align-middle p-4">
        <Phone
          name="Emily Banks"
          width={size.width}
          height={size.height}
          platform="whatsapp"
          lightmode={true}
          messages={messages}
        />
      </section>
      <section className="w-2/3 bg-slate-300">

      </section>
    </main>
  )
}

export default App
