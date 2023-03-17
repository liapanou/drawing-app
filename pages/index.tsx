import { useSettings } from "@/providers";
import clsx from "clsx";
import dynamic from "next/dynamic";
import { default as p5Types } from "p5";
import { useMemo, useRef, useState } from "react";

// gets random image from a list
function getRandomImage() {
  const arr: string[] = [
    "/images/northern lights.jpeg",
    "/images/1456237268.jpg",
    "/images/greece-meteora.jpeg",
    "/images/Most-beautiful-places-in-Greece.jpg",
    "/images/Rhodes.jpg",
    "/images/Santorini-min.jpg",
    "/images/screen-shot-2018-07-11-at-5-06-55-pm-1531343396.png",
    "/images/shutterstock_282952640-1024x683.jpg",
    "/images/the-best-place-to-focus-in-a-landscape.jpg",
    "/images/Zakynthos-Navagio-bay-Greek-island.jpg",
    "/images/greece-in-pictures-beautfiul-places-to-photograph-mykonose-windmill.jpg",
  ];

  // get random index value
  const randomIndex = Math.floor(Math.random() * arr.length);

  // get random item
  const item = arr[randomIndex];

  return item;
}

// makes a toast when you submit an email

// const myPromise = function();

// toast.promise(myPromise, {
//   loading: "Loading",
//   success: "Your drawing has been sent successfully",
//   error: "Unsuccessful submission of your drawing",
// });

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
  const [erase, setErase] = useState<boolean>(false);
  const [fillBg, setFillBg] = useState<boolean>(false);
  const [textModal, setTextModal] = useState<boolean>(false);
  const [emailModal, setEmailModal] = useState<boolean>(false);
  const ref = useRef<p5Types>(null);
  const settings = useSettings();
  const menuRef = useRef<HTMLDivElement>(null);
  const randomImage = useMemo(() => getRandomImage(), []); // change image when the page redenders
  let canvas: p5Types.Element | HTMLCanvasElement;
  let menuWidthRef = useRef(0);
  let width: number;

  // useEffect(() => {
  //   const menu = menuRef.current;
  //   if (menu) {
  //     menuWidthRef.current = menu.clientWidth;
  //   }
  // }, [menuRef]);

  // auto runs once at start of program

  const setup = (p5: p5Types, canvasParentRef: Element) => {
    if (menuRef.current) {
      width = p5.windowWidth - 300; // set the width of the canvas to be the windows.width - menu.width
      canvas = p5.createCanvas(width, p5.windowHeight).parent(canvasParentRef);
      setP5Instance(p5);
      p5.background("#fff");
    }
  };

  // auto loops continuously
  // the specific draw rules say that you can draw lines when the mouse is pressed
  const draw = (p5: p5Types) => {
    let px = p5.pmouseX;
    let py = p5.pmouseY;
    let x = p5.mouseX;
    let y = p5.mouseY;

    if (p5.mouseIsPressed === true) {
      p5.stroke(erase ? "#fff" : settings.selectedColor); // set the correct color depending on the state of erase
      p5.strokeWeight(settings.tool);
      p5.line(p5.floor(px), p5.floor(py), p5.floor(x), p5.floor(y));
    }
  };

  // start of rules of paint backet
  const floodFill = (
    p5: p5Types,
    x: number,
    y: number,
    targetColor: any,
    fillColor: any
  ) => {
    x = p5.mouseX;
    y = p5.mouseY;
    console.log("floodFill called with", x, y, targetColor, fillColor);
    const currentColor = p5.get(x, y);
    if (!compareColors(currentColor, targetColor)) {
      return; // stop if the current color is not the target color
    }
    p5.set(x, y, fillColor); // fill the current pixel with the fill color
    floodFill(p5, x + 1, y, targetColor, fillColor); // fill the right neighbor
    floodFill(p5, x - 1, y, targetColor, fillColor); // fill the left neighbor
    floodFill(p5, x, y + 1, targetColor, fillColor); // fill the bottom neighbor
    floodFill(p5, x, y - 1, targetColor, fillColor); // fill the top neighbor
  };

  const compareColors = (c1: any, c2: any) => {
    // compare two color values as arrays of [R, G, B, A]
    let currentColor = c1;
    let targetColor = c2;
    if (!p5Instance) {
      return false;
    }
    // compare colors and return result
    for (let i = 0; i < 4; i++) {
      if (currentColor[i] !== targetColor[i]) {
        return false;
      }
    }
    return true;
  };

  const colorBacket = () => {
    if (p5Instance && fillBg === true && p5Instance.mouseIsPressed === true) {
      let x = p5Instance.mouseX;
      let y = p5Instance.mouseY;
      const targetColor = p5Instance.get(p5Instance.mouseX, p5Instance.mouseY);
      console.log(targetColor);
      const fillColor = p5Instance.color(255, 0, 0);
      console.log(targetColor);
      floodFill(
        p5Instance,
        p5Instance.mouseX,
        p5Instance.mouseY,
        targetColor,
        fillColor
      );
    }
  };

  // end of rules of paint backet

  // makes text
  const textMode = () => {
    let x = p5Instance?.mouseX;
    let y = p5Instance?.mouseY;
    if (p5Instance && settings.tool === 0) {
      let x = p5Instance.mouseX;
      let y = p5Instance.mouseY;
      p5Instance.textSize(32);
      p5Instance.text(settings.text, x, y);
      p5Instance.fill(settings.selectedColor);
    }
  };

  // clears the canvas
  const clearCanvas = () => {
    p5Instance?.clear();
  };

  return (
    <div className=" grid h-screen w-screen grid-cols-[300px_2fr]  overflow-hidden bg-white ">
      <div
        ref={menuRef}
        className=" flex flex-col border-r border-black bg-zinc-400 py-2 px-2"
      >
        <h2 className=" mb-4  text-center font-bold">Drawing Tools</h2>
        <button
          id="clearCanvas"
          type="button"
          className=" mb-4 rounded-full border border-black p-2 hover:bg-yellow-200"
          onClick={() => clearCanvas()}
        >
          Clear canvas
        </button>

        <div className="flex items-center justify-center gap-4 xl:mb-4 2xl:mb-8">
          <button
            type="button"
            className={clsx(
              "hovertext h-fit w-fit rounded-full border border-black p-2 hover:bg-yellow-200",
              { "bg-yellow-200": settings.tool === 10 }
            )}
            data-hover="eraser"
            onClick={() => {
              setErase(true);
              setFillBg(false);
              settings.setMode(10);
            }}
          >
            🧹
          </button>
          <button
            type="button"
            className={clsx(
              "hovertext h-fit w-fit rounded-full border border-black p-2 hover:bg-yellow-200",
              { "bg-yellow-200": fillBg }
            )}
            data-hover="paint backet"
            onClick={() => {
              setErase(false);
              settings.setMode(0);
              setFillBg(true);

              colorBacket();
            }}
          >
            🪣
          </button>
        </div>
        <div className=" flex items-center justify-center gap-4 xl:mb-4 2xl:mb-8">
          <button
            type="button"
            className={clsx(
              " hovertext h-fit w-fit rounded-full border border-black p-2  hover:bg-yellow-200",
              { "bg-yellow-200": settings.tool === 4 }
            )}
            data-hover="pencil"
            onClick={() => {
              setErase(false);
              setFillBg(false);
              settings.setMode(4);
            }}
          >
            ✏️
          </button>
          <button
            type="button"
            className={clsx(
              " hovertext h-fit w-fit rounded-full border border-black p-2 hover:bg-yellow-200",
              { "bg-yellow-200": settings.tool === 9 }
            )}
            data-hover="paint brush"
            onClick={() => {
              setErase(false);
              setFillBg(false);
              settings.setMode(9);
            }}
          >
            🖌️
          </button>
        </div>
        <div className=" flex items-center justify-center gap-4 xl:mb-4 2xl:mb-8">
          {/* The button to open modal */}
          <label
            htmlFor="my-modal-5"
            onClick={() => {
              settings.setMode(0);
              setTextModal(true);
              setFillBg(false);
            }}
            className={clsx(
              "hovertext btn1 h-fit w-fit   border border-black bg-transparent p-2 hover:bg-yellow-200",
              {
                "bg-yellow-200": textModal,
              }
            )}
            data-hover="text"
          >
            🇦
          </label>

          {/* Put this part before </body> tag */}

          <div className={clsx("modal", { "modal-open": textModal })}>
            <div className="modal-box z-50">
              <form
                onSubmit={(evt) => {
                  evt.preventDefault(); // stops the rerender of the page which is caused when you submit the form
                  setTextModal(false);
                }}
              >
                <label className="block">
                  <label
                    htmlFor="tetx"
                    className="mb-4 block text-lg font-bold"
                  >
                    Write what you like here :
                  </label>
                  <input
                    type="text"
                    onChange={(evt) =>
                      settings.setText(evt.currentTarget.value)
                    }
                    className=" h-10 w-full rounded-lg border border-black"
                  />
                </label>

                <div className="modal-action">
                  <input
                    type="reset"
                    onClick={() => {
                      settings.setText("");
                    }}
                    className="btn"
                  />

                  <input type="submit" className="btn" />
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center  justify-center gap-3 xl:mb-4 2xl:mb-8">
          <h2 className="mb-2 2xl:mb-4">Select Color :</h2>
          <input
            type="color"
            className="hovertext"
            data-hover="color palette"
            onChange={(evt) =>
              settings.setSelectedColor(evt.currentTarget.value)
            }
          />
        </div>
        <div className="mb-4 flex  flex-col items-center justify-center 2xl:mb-8">
          <h2 className="mb-2 2xl:mb-4">Save your drawing :</h2>
          <button
            id="saveCanvas"
            type="button"
            className={clsx(
              " h-fit w-fit rounded-full border border-black p-2 hover:bg-yellow-200"
            )}
            onClick={() => {
              p5Instance?.saveCanvas(canvas, "my-drawing", "png"); // saves and downloads the drawing in your device
            }}
          >
            💾
          </button>
        </div>

        <div className=" flex flex-col items-center justify-center">
          <h2 className="mb-2 2xl:mb-4">Share your drawing :</h2>
          {/* The button to open modal */}
          <label
            htmlFor="my-modal-6"
            onClick={() => {
              settings.setMode(0);
              setEmailModal(true);
              setFillBg(false);
            }}
            className={clsx(
              " hovertext btn1 h-fit w-fit   border border-black bg-transparent p-2 hover:bg-yellow-200",
              { "bg-yellow-200": emailModal }
            )}
            data-hover="email"
          >
            📧
          </label>
          {/* <Toaster /> */}

          {/* Put this part before </body> tag */}

          <div className={clsx("modal", { "modal-open": emailModal })}>
            <div className="modal-box z-50">
              <form
                onSubmit={(evt) => {
                  evt.preventDefault(); // stops the rerender of the page which is caused when you submit the form
                  setEmailModal(false);
                }}
              >
                <label className=" block">
                  <label
                    htmlFor="email"
                    className="mb-2 block text-lg font-bold"
                  >
                    Email :
                  </label>

                  <input
                    type="email"
                    className="peer block w-full rounded-md border border-black bg-white px-3 py-2 placeholder-slate-400 shadow-sm   focus:outline-none focus:ring-1 focus:valid:border-green-600 focus:valid:ring-green-600 focus:invalid:border-pink-500 focus:invalid:ring-pink-500 disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-500 disabled:shadow-none sm:text-sm"
                    placeholder="you@example.com"
                  ></input>
                  <p className="invisible mt-2 text-sm text-pink-600 peer-invalid:visible">
                    Please provide a valid email address.
                  </p>
                </label>

                <div className="modal-action">
                  <input type="reset" className="btn" />
                  <input type="submit" className="btn" />
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="mt-auto flex flex-col items-center justify-center gap-4 xl:mb-36 2xl:mb-8">
          <h2 className="font-bold ">Drawing Goal</h2>
          <div className="blinking-border">
            {/* The button to open modal */}
            <label htmlFor="my-modal-3">
              <picture>
                <img
                  src={randomImage}
                  alt="Drawing Goal"
                  width={500}
                  height={500}
                />
              </picture>
            </label>
            {/* Put this part before </body> tag */}
            <input type="checkbox" id="my-modal-3" className="modal-toggle" />
            <div className="modal">
              <div className="modal-box relative h-fit w-fit ">
                <label
                  htmlFor="my-modal-3"
                  className="btn-sm btn absolute right-2 top-2 border-none bg-transparent text-black hover:bg-transparent"
                >
                  ✕
                </label>
                <br />
                <picture>
                  <img
                    className="h-max w-max "
                    src={randomImage}
                    alt="Drawing Goal"
                  />
                </picture>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <Sketch
          setup={setup}
          draw={draw}
          mousePressed={() => {
            if (textModal) return;
            if (textModal === false && settings.tool === 0) textMode();
          }}
        />
      </div>
    </div>
  );
}
