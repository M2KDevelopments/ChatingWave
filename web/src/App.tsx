import { useEffect, useState } from "react"
import Phone from "./components/Phone"

function App() {

  const [size, setSize] = useState({ width: 500, height: 889 });

  useEffect(() => {
    // Todo Automatically adjust as the window resizes
    setSize({ width: 500, height: 889 });
  }, [])

  return (
    <main className="flex w-screen h-screen overflow-hidden">
      <section className="w-1/3 flex justify-center flex-col m-auto items-center align-middle p-4">
        <Phone
          name="Emily"
          width={size.width}
          height={size.height}
          platform="whatsapp"
          lightmode={true}
        />
      </section>
      <section className="w-2/3 bg-slate-300">

      </section>
    </main>
  )
}

export default App
