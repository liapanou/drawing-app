import { useT } from "@/Hook/useT";
import { useSettings } from "@/providers";
import clsx from "clsx";
import dynamic from "next/dynamic";
import { default as p5Types } from "p5";
import { useRef, useState } from "react";

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
  const [textModal, setTextModal] = useState<boolean>(false);

  const [emailModal, setEmailModal] = useState<boolean>(false);
  const [image, setImage] = useState<string>("/images/northern lights.jpeg");
  const settings = useSettings();
  const menuRef = useRef<HTMLDivElement>(null);
  let canvas: p5Types.Element | HTMLCanvasElement;
  let menuWidthRef = useRef(0);
  let width: number;
  const t = useT(); // passes to the component the translation function

  // useEffect(() => {
  //   const menu = menuRef.current;
  //   if (menu) {
  //     menuWidthRef.current = menu.clientWidth;
  //   }
  // }, [menuRef]);

  // gets random image from a list
  function getRandomImage() {
    // get random index value
    const randomIndex = Math.floor(Math.random() * arr.length);

    // get random item
    const item = arr[randomIndex];

    setImage(item);
  }

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
    if (textModal || emailModal) return;

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

  // makes text
  const textMode = () => {
    if (!settings.text) return;
    if (!p5Instance) return;
    let x = p5Instance.mouseX;
    let y = p5Instance.mouseY;
    p5Instance.textSize(32);
    p5Instance.fill(settings.selectedColor);
    p5Instance.text(settings.text, x, y);

    settings.setText("");
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
        <h2 className=" mb-6  text-center font-bold">{t("drawingTools")}</h2>
        <button
          id="clearCanvas"
          type="button"
          className=" mb-8 rounded-full border border-black p-2 hover:bg-yellow-200"
          onClick={() => clearCanvas()}
        >
          {t("clearCanvas")}
        </button>

        <div className="flex items-center justify-center gap-4 xl:mb-4 2xl:mb-8">
          <button
            type="button"
            className={clsx(
              "hovertext h-fit w-fit rounded-full border border-black p-2 hover:bg-yellow-200",
              { "bg-yellow-200": settings.tool === 10 }
            )}
            data-hover={t("eraser")}
            onClick={() => {
              setErase(true);
              settings.setMode(10);
            }}
          >
            🧹
          </button>
          {/* The button to open modal */}
          <label
            htmlFor="my-modal-5"
            onClick={(e) => {
              e.stopPropagation();
              settings.setMode(0);
              setTextModal(true);
            }}
            className={clsx(
              "hovertext btn1 h-fit w-fit   border border-black bg-transparent p-2 hover:bg-yellow-200",
              {
                "bg-yellow-200": settings.text,
              }
            )}
            data-hover={t("text")}
          >
            🇦
          </label>
          {/* Put this part before </body> tag */}
          <div className={clsx("modal", { "modal-open": textModal })}>
            <div className="modal-box z-50">
              <label
                htmlFor="my-modal-5"
                onClick={() => setTextModal(false)}
                className="btn-sm btn absolute right-2 top-2 border-none bg-transparent text-black hover:bg-transparent"
              >
                ✕
              </label>
              <form
                onSubmit={(evt) => {
                  evt.stopPropagation();
                  evt.preventDefault(); // stops the rerender of the page which is caused when you submit the form
                  setTextModal(false);
                }}
              >
                <label className="block">
                  <label
                    htmlFor="tetx"
                    className="mb-4 block text-lg font-bold"
                  >
                    {t("labelOfTextModal")}
                  </label>
                  <input
                    type="text"
                    onChange={(evt) =>
                      settings.setText(evt.currentTarget.value)
                    }
                    value={settings?.text ?? ""}
                    className=" input h-10 w-full rounded-lg border border-black"
                    required
                  />
                </label>

                <div className="modal-action">
                  <button
                    type="reset"
                    onClick={() => {
                      settings.setText("");
                    }}
                    className="btn"
                  >
                    {t("clear")}
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    type="submit"
                    className="btn"
                  >
                    Ok
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className=" flex items-center justify-center gap-4 xl:mb-4 2xl:mb-8">
          <button
            type="button"
            className={clsx(
              " hovertext h-fit w-fit rounded-full border border-black p-2  hover:bg-yellow-200",
              { "bg-yellow-200": settings.tool === 4 }
            )}
            data-hover={t("pencil")}
            onClick={() => {
              setErase(false);
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
            data-hover={t("paintBrush")}
            onClick={() => {
              setErase(false);
              settings.setMode(9);
            }}
          >
            🖌️
          </button>
        </div>

        <div className="flex flex-col items-center  justify-center gap-3 xl:mb-4 2xl:mb-8">
          <h2 className="mb-2 2xl:mb-4">{t("selectColor")}</h2>
          <input
            type="color"
            className="hovertext"
            data-hover={t("colorPallete")}
            onChange={(evt) =>
              settings.setSelectedColor(evt.currentTarget.value)
            }
          />
        </div>
        <div className="mb-4 flex  flex-col items-center justify-center 2xl:mb-8">
          <h2 className="mb-2 2xl:mb-8">{t("saveOrShare")}</h2>
          <div className="flex gap-2">
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

            {/* The button to open modal */}
            <label
              htmlFor="my-modal-6"
              onClick={() => {
                settings.setMode(0);
                setEmailModal(true);
              }}
              className={clsx(
                " hovertext btn1 mb-4 h-fit   w-fit border border-black bg-transparent p-2 hover:bg-yellow-200",
                { "bg-yellow-200": emailModal }
              )}
              data-hover={t("email")}
            >
              📧
            </label>

            {/* Put this part before </body> tag */}
            <div className={clsx("modal", { "modal-open": emailModal })}>
              <div className="modal-box z-50">
                <label
                  htmlFor="my-modal-6"
                  onClick={() => setEmailModal(false)}
                  className="btn-sm btn absolute right-2 top-2 border-none bg-transparent text-black hover:bg-transparent"
                >
                  ✕
                </label>
                <form
                  onSubmit={(evt) => {
                    evt.preventDefault(); // stops the rerender of the page which is caused when you submit the form
                    setEmailModal(false);
                  }}
                >
                  <label className="block">
                    <label
                      htmlFor="email"
                      className="mb-2 block text-lg font-bold"
                    >
                      {t("labelOfEmailModal")}
                    </label>

                    <input
                      type="email"
                      className="peer block w-full rounded-md border border-black bg-white px-3 py-2 placeholder-slate-400 shadow-sm   focus:outline-none focus:ring-1 focus:invalid:border-pink-500 focus:invalid:ring-pink-500 disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-500 disabled:shadow-none sm:text-sm"
                      placeholder="you@example.com"
                      required
                    />
                    <p className="invisible mt-2 text-sm text-pink-600 peer-invalid:visible">
                      {t("falseEmailAddress")}
                    </p>
                  </label>

                  <div className="modal-action">
                    <button type="reset" className="btn">
                      {t("clear")}
                    </button>
                    <button type="submit" className="btn">
                      Ok
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        <div className=" flex flex-col items-center justify-center gap-4 ">
          <h2 className="font-bold ">{t("drawingGoal")}</h2>
          <div className="blinking-border mb-2 h-40 w-fit   ">
            {/* The button to open modal */}
            <label htmlFor="my-modal-3" className="hover:cursor-zoom-in">
              <picture>
                <img
                  src={image}
                  alt="Drawing Goal"
                  className="h-full w-full object-contain"
                />
              </picture>
            </label>
          </div>

          <button
            className=" flex h-fit  w-full items-center justify-center rounded-full  border border-black p-2 font-bold text-black hover:bg-yellow-200"
            type="button"
            onClick={() => getRandomImage()}
          >
            <span className="text-lg ">{t("next")}</span>
            <span className="mb-1 text-center text-2xl">→</span>
          </button>

          {/* Put this part before </body> tag */}
          <input type="checkbox" id="my-modal-3" className="modal-toggle" />
          <div className="modal">
            <div className="modal-box relative h-fit w-fit ">
              <label
                htmlFor="my-modal-3"
                className="btn-sm btn absolute right-2 top-2 border-none bg-transparent text-black hover:bg-transparent"
                onClick={() => settings.setMode(0)}
              >
                ✕
              </label>
              <br />
              <picture>
                <img className="h-max w-max " src={image} alt="Drawing Goal" />
              </picture>
            </div>
          </div>
        </div>
      </div>
      <div>
        <Sketch
          mouseClicked={() => {
            textMode();
          }}
          setup={setup}
          draw={draw}
        />
      </div>
    </div>
  );
}
