import { useEffect, useRef, useState } from "react"
import domtoimage from 'dom-to-image';

function App() {

  const [image, setImage] = useState();
  const ref = useRef()

  useEffect(() => {
    document.body.style.overflow = 'hidden';
  }, [])

  const onImage = async () => {
    const images = [];
    const max = 500;
    const h1 = document.querySelector('h1');
    for (let i = 0; i < max; i++) {
      h1.style.left = `${i}px`;
      const img = await domtoimage.toPng(ref.current);
      images.push(img)
      setImage(img);
    }
  }

  return (
    <div className="overflow-hidden">
      <div className="h-screen">
        <img src={image} />
        <button onClick={onImage} className="px-6 py-2 text-lg rounded-lg text-white bg-amber-600 shadow-xl cursor-pointer">Generate Image</button>
      </div>
      <main ref={ref} className="w-screen h-screen">
        <img src="vite.svg" />
        <div className="relative w-screen p-5 bg-green-600">
          <h1 className="relative text-3xl white">Chatting Wave</h1>
        </div>
      </main>
    </div>
  )
}

export default App
