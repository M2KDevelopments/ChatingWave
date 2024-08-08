import { useEffect } from "react"

function App() {

  useEffect(() => {
    // draw on canvas
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');


  }, [])

  return (
    <div>
      <main>
        <canvas id="canvas" width="1280" height="720"></canvas>
      </main>
    </div>
  )
}

export default App
