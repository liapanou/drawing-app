import { useRouter } from "next/router";
type Locale = "en" | "el";

type Key =
  | "drawingTools"
  | "clearCanvas"
  | "eraser"
  | "text"
  | "pencil"
  | "paintBrush"
  | "selectColor"
  | "colorPallete"
  | "saveOrShare"
  | "email"
  | "drawingGoal"
  | "next"
  | "labelOfTextModal"
  | "clear"
  | "labelOfEmailModal"
  | "falseEmailAddress";

const translations: Record<Locale, Record<Key, string>> = {
  en: {
    drawingTools: "Drawing Tools",
    clearCanvas: "Clear Canvas",
    eraser: "eraser",
    text: "text",
    pencil: "pencil",
    paintBrush: "paint brush",
    selectColor: "select Color",
    colorPallete: "color palette",
    saveOrShare: "Save or Share",
    email: "email",
    drawingGoal: "Drawing Goal",
    next: "Next",
    labelOfTextModal: "Write what you like here :",
    clear: "Clear",
    labelOfEmailModal: "Email",
    falseEmailAddress: "Please provide a valid email address.",
  },
  el: {
    drawingTools: "Εργαλεία Σχεδίασης",
    clearCanvas: "Καθαρισμός Καμβά",
    eraser: "γόμα",
    text: "κείμενο",
    pencil: "μολύβι",
    paintBrush: "πινέλο",
    selectColor: "Επίλεξε Χρώμα",
    colorPallete: "παλέτα χρωμάτων",
    saveOrShare: "Αποθήκευση ή Αποστολή",
    email: "ηλ. ταχυδρομείο",
    drawingGoal: "Σχεδιαστικός Στόχος",
    next: "Επόμενο",
    labelOfTextModal: "Γράψτε ότι θέλετε εδώ :",
    clear: "Καθαρισμoς",
    labelOfEmailModal: "Ηλ. Διεύθυνση",
    falseEmailAddress: "Παρακαλώ γράψτε μια έγκυρη ηλ. διεύθυνση.",
  },
};

export function useT() {
  const router = useRouter();
  const locale = router.locale as "en" | "el";

  const t = (key: Key) =>
    translations[locale][key] === ""
      ? `to be translated: ${key}`
      : translations[locale][key];

  return t;
}

// sets the translation attribute to the app - you should also look at the app & document page and at the next.config.js
