import { useSettings } from "@/providers";
import clsx from "clsx";
import dynamic from "next/dynamic";
import p5Types from "p5"; //Import this for typechecking and intellisense
import { useRef, useState } from "react";

// Will only import `react-p5` on client-side
const Sketch = dynamic(
  () =>
    import("react-p5").then((mod) => {
      // importing sound lib ONLY AFTER REACT-P5 is loaded
      require("p5/lib/addons/p5.sound");
      // returning react-p5 default export
      return mod.default;
    }),
  {
    ssr: false,
  }
);

export default function Page() {
  //See annotations in JS for more information
  const [p5Instance, setP5Instance] = useState<p5Types>();
  const ref = useRef<p5Types>(null);
  const settings = useSettings();
  console.log(settings.tool);

  // auto runs once at start of program

  const setup = (p5: p5Types, canvasParentRef: Element) => {
    const width = p5.windowWidth - 300;
    p5.createCanvas(width, p5.windowHeight).parent(canvasParentRef);
    setP5Instance(p5);
    p5.background(255);
  };

  // auto loops continuously
  const draw = (p5: p5Types) => {
    let px = p5.pmouseX;
    let py = p5.pmouseY;
    let x = p5.mouseX;
    let y = p5.mouseY;

    p5.stroke(settings.selectedColor);
    p5.strokeWeight(settings.tool);
    p5.line(px, py, x, y);
  };

  const clearCanvas = () => {
    p5Instance?.clear();
  };

  return (
    <div className=" grid h-screen w-screen grid-cols-[300px_2fr] bg-white">
      <div className=" flex flex-col border-r border-black bg-zinc-400 py-2 px-2">
        <h2 className=" mb-4  text-center font-bold">Drawing Tools</h2>
        <button
          id="clearCanvas"
          type="button"
          className="mb-4 rounded-full border border-black p-2  hover:bg-yellow-200"
          onClick={() => clearCanvas()}
        >
          Clear canvas
        </button>
        <div className="mb-8 flex items-center justify-center gap-4">
          <button
            type="button"
            className={clsx(
              "h-fit w-fit rounded-full border border-black p-2  hover:bg-yellow-200",
              { "bg-yellow-200": settings.tool === 4 }
            )}
            onClick={() => {
              settings.setMode(4);
              settings.setSelectedColor("#000000");
            }}
          >
            ✏️
          </button>
          <button
            type="button"
            className={clsx(
              " h-fit w-fit rounded-full border border-black p-2 hover:bg-yellow-200",
              { "bg-yellow-200": settings.tool === 10 }
            )}
            onClick={() => {
              settings.setMode(10);
              settings.setSelectedColor("#000000");
            }}
          >
            🖌️
          </button>
        </div>
        <div className="mb-8 flex items-center justify-center gap-3">
          <h2>Select Color :</h2>
          <input
            type="color"
            onChange={(evt) =>
              settings.setSelectedColor(evt.currentTarget.value)
            }
          />
        </div>
        <div className="mb-8 flex items-center justify-center gap-4">
          <button
            type="button"
            className={clsx(
              " h-fit w-fit rounded-full border border-black p-2 hover:bg-yellow-200",
              { "bg-yellow-200": settings.tool === 20 }
            )}
            onClick={() => {
              settings.setMode(20);
              settings.setSelectedColor("#ffffff");
            }}
          >
            🧹
          </button>
          <button
            type="button"
            className={clsx(
              " h-fit w-fit rounded-full border border-black p-2 hover:bg-yellow-200"
            )}
          >
            🪣
          </button>
        </div>
        <div className="mb-8 flex items-center justify-center gap-4">
          <button
            type="button"
            className={clsx(
              " h-fit w-fit rounded-full border border-black p-2 hover:bg-yellow-200"
            )}
          >
            🇦
          </button>
          <button
            type="button"
            className={clsx(
              " h-fit w-fit rounded-full border border-black p-2 hover:bg-yellow-200"
            )}
          >
            🔍
          </button>
        </div>

        <div className="mt-auto mb-8 flex flex-col items-center justify-center gap-4">
          <h2 className="font-bold ">Drawing Goal</h2>
          <picture>
            <img
              src="https://www.nyip.edu/images/cms/photo-articles/the-best-place-to-focus-in-a-landscape.jpg"
              alt="Drawing Goal"
              width={500}
              height={500}
            />
          </picture>
        </div>
      </div>
      <Sketch setup={setup} draw={draw} />
    </div>
  );
}

// p5.js Web Editor - how to draw and change color and font of color

// let dcolor
// let tool = 0
// let rbutton
// let ybutton
// let bmbutton
// let pmbutton

// function setup() {
//   dcolor = color(0,0,255)
//   createCanvas(900, 900);
//   background(220);
//   rbutton = createButton("R")
//   rbutton.position(0,0)
//   rbutton.mousePressed(redColor)
//   bmbutton = createButton("BM")
//   bmbutton.position(20,20)
//   bmbutton.mousePressed(brushMode)
//   pmbutton = createButton("PM")
//   pmbutton.position(60,20)
//   pmbutton.mousePressed(pencilMode)
//   ybutton = createButton("Y")
//   ybutton.position(30,0)
//   ybutton.mousePressed(yellowColor)

// }

// function redColor (){
//   dcolor = color(255,0,0)
// }

// function yellowColor (){
//   dcolor = color(255,255,0)
// }

// function pencilMode () {
//   tool = 4
// }

// function brushMode () {
//   tool = 10
// }

// function draw() {
// let px = pmouseX
// let py = pmouseY
// let x = mouseX
// let y = mouseY

//   stroke(dcolor)
//   strokeWeight(tool)
//   line(px,py,x,y)

// }
