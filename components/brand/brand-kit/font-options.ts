import {
  DM_Serif_Display,
  Inter,
  Lato,
  Lora,
  Montserrat,
  Nunito,
  Open_Sans,
  Playfair_Display,
  Poppins,
  Roboto,
  Sora,
  Source_Sans_3,
} from "next/font/google";

const dmSerifDisplay = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  preload: false,
});
const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700"],
  preload: false,
});
const lora = Lora({
  subsets: ["latin"],
  weight: ["600", "700"],
  preload: false,
});
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["600", "700"],
  preload: false,
});
const sora = Sora({
  subsets: ["latin"],
  weight: ["600", "700"],
  preload: false,
});
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["600", "700"],
  preload: false,
});
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  preload: false,
});
const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700"],
  preload: false,
});
const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "600"],
  preload: false,
});
const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600"],
  preload: false,
});
const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500"],
  preload: false,
});
const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  weight: ["400", "600"],
  preload: false,
});

export const fontFamilyStyles: Record<string, string> = {
  "DM Serif Display": dmSerifDisplay.style.fontFamily,
  "Playfair Display": playfairDisplay.style.fontFamily,
  Lora: lora.style.fontFamily,
  Poppins: poppins.style.fontFamily,
  Sora: sora.style.fontFamily,
  Montserrat: montserrat.style.fontFamily,
  Inter: inter.style.fontFamily,
  Lato: lato.style.fontFamily,
  "Open Sans": openSans.style.fontFamily,
  Nunito: nunito.style.fontFamily,
  Roboto: roboto.style.fontFamily,
  "Source Sans 3": sourceSans.style.fontFamily,
};
