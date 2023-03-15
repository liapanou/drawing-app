import { useSettings } from "@/providers";
import clsx from "clsx";
import dynamic from "next/dynamic";
import { default as p5Types } from "p5";
import { useEffect, useRef, useState } from "react";

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
  const [val, setVal] = useState<boolean | null>(null);
  const ref = useRef<p5Types>(null);
  const settings = useSettings();
  const menuRef = useRef<HTMLDivElement>(null);
  const textInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  let canvas: p5Types.Element | HTMLCanvasElement;
  let menuWidthRef = useRef(0);
  let width: number;

  useEffect(() => {
    const menu = menuRef.current;
    if (menu) {
      menuWidthRef.current = menu.clientWidth;
    }
  }, [menuRef]);

  // auto runs once at start of program

  const setup = (p5: p5Types, canvasParentRef: Element) => {
    if (menuRef.current) {
      width = p5.windowWidth - menuWidthRef.current; // set the width of the canvas to be the windows.width - menu.width
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

  const ValidateEmail = (email: string) => {
    var validRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (email === "") {
      setVal(null);
    }
    if (email.match(validRegex)) {
      setVal(true);
    } else {
      setVal(false);
    }
  };

  console.log(emailInputRef.current?.checked);
  return (
    <div className=" grid h-screen w-screen grid-cols-[300px_2fr] bg-white ">
      <div
        ref={menuRef}
        className=" flex flex-col border-r border-black bg-zinc-400 py-2 px-2"
      >
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
              " h-fit w-fit rounded-full border border-black p-2 hover:bg-yellow-200",
              { "bg-yellow-200": settings.tool === 10 }
            )}
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
              " h-fit w-fit rounded-full border border-black p-2 hover:bg-yellow-200",
              { "bg-yellow-200": fillBg }
            )}
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
        <div className="mb-8 flex items-center justify-center gap-4">
          <button
            type="button"
            className={clsx(
              "h-fit w-fit rounded-full border border-black p-2  hover:bg-yellow-200",
              { "bg-yellow-200": settings.tool === 4 }
            )}
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
              " h-fit w-fit rounded-full border border-black p-2 hover:bg-yellow-200",
              { "bg-yellow-200": settings.tool === 9 }
            )}
            onClick={() => {
              setErase(false);
              setFillBg(false);
              settings.setMode(9);
            }}
          >
            🖌️
          </button>
        </div>
        <div className="mb-8 flex items-center justify-center gap-4">
          {/* The button to open modal */}
          <label
            htmlFor="my-modal-5"
            onClick={() => {
              if (!textInputRef.current) return;
              textInputRef.current.checked = true;
              settings.setMode(0);
              setFillBg(false);
            }}
            className={clsx(
              "btn1 h-fit w-fit   border border-black bg-transparent p-2 hover:bg-yellow-200",
              {
                "bg-yellow-200": settings.tool === 0 && fillBg === false,
              }
            )}
          >
            🇦
          </label>

          {/* Put this part before </body> tag */}
          <input type="checkbox" id="my-modal-5" className="modal-toggle" />
          <div className="modal">
            <div className="modal-box z-50">
              <h3 className="mb-4 text-lg font-bold">
                Write what you like here :
              </h3>
              <input
                ref={textInputRef}
                checked={textInputRef?.current?.checked}
                type="text"
                onChange={(evt) => settings.setText(evt.currentTarget.value)}
                className=" w-full border border-black"
              />
              <div className="modal-action">
                <button
                  onClick={() => {
                    settings.setText("");
                    if (textInputRef.current) {
                      textInputRef.current.value = "";
                    }
                  }}
                  className="btn"
                >
                  Erase
                </button>

                <label
                  htmlFor="my-modal-5"
                  className="btn"
                  onClick={() => {
                    if (!textInputRef.current) return;
                    textInputRef.current.checked = false;
                  }}
                >
                  Submit
                </label>
              </div>
            </div>
          </div>
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
        <button
          id="saveCanvas"
          type="button"
          className="btn mb-4 w-auto rounded-full border border-black bg-transparent p-2  hover:bg-yellow-200"
          onClick={() => {
            p5Instance?.saveCanvas(canvas, "my-drawing", "png"); // saves and downloads the drawing in your device
          }}
        >
          💾
        </button>

        <div className="flex  flex-col items-center justify-center">
          <h2 className="mb-4">Share your drawing :</h2>
          {/* The button to open modal */}
          <label
            htmlFor="my-modal-6"
            onClick={() => {
              if (!emailInputRef.current) return;
              emailInputRef.current.checked = true;
              settings.setMode(2);
              setFillBg(false);
            }}
            className={clsx(
              "btn1 h-fit w-fit   border border-black bg-transparent p-2 hover:bg-yellow-200",
              { "bg-yellow-200": emailInputRef.current?.checked }
            )}
          >
            📧
          </label>

          {/* Put this part before </body> tag */}
          <input type="checkbox" id="my-modal-6" className="modal-toggle" />
          <div className="modal">
            <div className="modal-box z-50">
              <div className="emailBox">
                <label
                  htmlFor="emailAddress"
                  className="mb-4 text-lg font-bold"
                >
                  Write the email which you want to send your drawing :
                </label>
                <input
                  ref={emailInputRef}
                  checked={emailInputRef?.current?.checked}
                  type="email"
                  id="emailAddress"
                  placeholder="example@email.com"
                  required
                  onChange={(evt) => {
                    settings.setEmail(evt.currentTarget.value);
                  }}
                  className={clsx(
                    " w-full border border-black",
                    {
                      "border-red-700": val === false,
                    },
                    {
                      "border-green-600": val === true,
                    }
                  )}
                />
              </div>
              <div className={clsx("mt-2", { hidden: val === null })}>
                {val ? (
                  <label className="text-green-600">Valid email address!</label>
                ) : (
                  <label className="text-red-700">Invalid email address!</label>
                )}
              </div>

              <div className="modal-action">
                <button
                  onClick={() => {
                    settings.setEmail("");
                    if (emailInputRef.current) {
                      emailInputRef.current.value = "";
                    }
                  }}
                  className="btn"
                >
                  Erase
                </button>
                <label
                  htmlFor="my-modal-6"
                  className="btn"
                  onClick={() => {
                    ValidateEmail(settings.email);
                    if (val === null) return;
                    if (val === false) {
                    }
                    setTimeout(() => {
                      if (!emailInputRef.current) return;
                      emailInputRef.current.checked = false;
                    });
                  }}
                >
                  Submit
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-auto mb-8 flex flex-col items-center justify-center gap-4">
          <h2 className="font-bold ">Drawing Goal</h2>
          <div className="blinking-border">
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
      </div>
      <div>
        <Sketch
          setup={setup}
          draw={draw}
          mousePressed={() => {
            if (textInputRef?.current?.checked === true) return;
            textMode();
          }}
        />
      </div>
    </div>
  );
}
