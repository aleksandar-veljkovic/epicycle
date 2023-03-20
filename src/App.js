import logo from './logo.svg';
import './App.css';
import { createRef, useEffect, useRef, useState } from 'react';

function App() {
  const time = useRef(0);
  const canvasRef = createRef();
  // let r = 80;
  let x = 400;
  let y = 400;
  const drawing = useRef([]);
  const [isAnimated, setIsAnimated] = useState(false);

  // const circles = useRef([{ r: 80, spd: 1 }, { r: 40, spd: -3 }, { r: 20, spd: 6 }, { r: 40, spd: 1 }]); // Turtle
  // const circles = useRef([{ r: 80, spd: 1 }, { r: 20, spd: 8 }]);
  // const circles = useRef([{ r: 80, spd: 1 }, { r: 20, spd: 8 }, { r: 80, spd: -6 }]); // Atom
  // const circles = useRef([{ r: 80, spd: 1 }, { r: 20, spd: 8 }, { r: 80, spd: -6 }]);

  const [circles, setCircles] = useState([{ r: 80, spd: 1 }, { r: 20, spd: 8 }, { r: 80, spd: -6 }]);
  // const [circles, setCircles] = useState([{ r: 80, spd: 1 }, { r: 20, spd: 1.5 }]);

  const drawWhole = () => {
    let points = [];

    for (let t = 0; t < 360; t += 1) {
      let prevPointX = x;
      let prevPointY = y;
      for (let i = 0; i < circles.length; i += 1) {
        const circle = circles[i];
        const { r, spd } = circle;
        prevPointX = prevPointX + r * Math.cos(t * spd % 360 / 180 * Math.PI);
        prevPointY = prevPointY + r * Math.sin(t * spd % 360 / 180 * Math.PI);
      }

      points.push({ x: prevPointX, y: prevPointY });
    }

    const ctx = canvasRef.current.getContext('2d');
    ctx.beginPath();
    ctx.clearRect(0, 0, 800, 800)

    ctx.beginPath();
    ctx.strokeStyle = 'rgba(255,255,0,0.8)';
    ctx.lineWidth = 4;
    // ctx.arc(xPointer, yPointer, r/2, 0, t / 180 * Math.PI, false);
    for (let i = 0; i < points.length; i += 1) {
      console.log(points[i])
      const { x: ptX, y: ptY } = points[i];
      if (i === 0) {
        ctx.moveTo(ptX, ptY);
      }

      console.log(ptX, ptY);
      ctx.lineTo(ptX, ptY);
    }
    ctx.stroke();
  }

  const animate = () => {
    if (!isAnimated) {
      return;
    }
    const t = time.current;
    requestAnimationFrame(animate);
    // requestAnimationFrame(animate);
    if (canvasRef.current != null) {
      // console.log(t);
      const ctx = canvasRef.current.getContext('2d');
      ctx.beginPath();

      ctx.clearRect(0, 0, 800, 800)
      if (t === 0) {
        drawing.current = [];
      }

      let prevPointX = x;
      let prevPointY = y;

      for (let i = 0; i < circles.length; i += 1) {
        ctx.strokeStyle = 'rgba(255,255,255,0.3)';
        ctx.lineWidth = 1;
        const circle = circles[i];
        const { r, spd } = circle;
        // console.log(r, spd);
        ctx.beginPath();
        ctx.arc(prevPointX, prevPointY, r, 0, 2 * Math.PI, false);
        ctx.stroke();
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(255,255,255,0.3)';
        ctx.lineWidth = 2;
        ctx.arc(prevPointX, prevPointY, 2, 0, 2 * Math.PI, false);
        ctx.stroke();
        prevPointX = prevPointX + r * Math.cos(t * spd % 360 / 180 * Math.PI);
        prevPointY = prevPointY + r * Math.sin(t * spd % 360 / 180 * Math.PI);
      }

      drawing.current.push({ x: prevPointX, y: prevPointY });

      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255,255,0,0.8)';
      ctx.lineWidth = 4;
      // ctx.arc(xPointer, yPointer, r/2, 0, t / 180 * Math.PI, false);
      for (let i = 0; i < drawing.current.length; i += 1) {
        const { x: ptX, y: ptY } = drawing.current[i];
        if (i === 0) {
          ctx.moveTo(ptX, ptY);
        }
        ctx.lineTo(ptX, ptY);
      }
      ctx.stroke();
      ctx.lineWidth = 6;
      ctx.strokeStyle = 'rgba(255,255,255,0.6)';
      ctx.beginPath();

      ctx.arc(prevPointX, prevPointY, 3, 0, Math.PI * 2, true); // Outer circle
      ctx.stroke();

      time.current = (t + 1) % 360;
    }
  }

  // useEffect(() => {
  //   if (canvasRef.current != null) {
  //     drawWhole();
  //   }
  // });
  
  useEffect(() => {
    if (!isAnimated) {
      drawWhole();
    } else {
      requestAnimationFrame(animate);
    }
  }, [circles, isAnimated])
  

  return (
    <div className="App">
      <canvas ref={canvasRef} height={800} width={800} />

      

      <div>
      {
        isAnimated ?
          <button onClick={() => {
            const ctx = canvasRef.current.getContext('2d');
            ctx.beginPath();
            ctx.clearRect(0, 0, 800, 800);
            setIsAnimated(false);
          }}>Draw</button>
          :
          <button onClick={() => {
            const ctx = canvasRef.current.getContext('2d');
            ctx.beginPath();
            ctx.clearRect(0, 0, 800, 800);
            time.current = 0;
            setIsAnimated(true)
          }}>Animate</button>
      }
      <br/>
        {
          circles.map((circle, index) => (
            <>
            <button onClick={() => {circles.splice(index, 1); setCircles([...circles])}}>X</button>
            <br/>
              <label>Radius</label>
              <input type="range" min={0.01} defaultValue={circle.r} max={100} step={0.01} onChange={(e) => { circle.r = e.target.value; setCircles([...circles]) }} />
              <br />
              <label>Speed</label>
              <input type="range" min={-10} defaultValue={circle.spd} max={10} step={0.001} onChange={(e) => { circle.spd = e.target.value; setCircles([...circles]) }} />
              <hr></hr>
              <br />
            </>
          ))
        }
        <button onClick={() => setCircles([...circles, {r: 80, spd: 1}])}>+ Add</button>
      </div>
    </div>
  );
}

export default App;
