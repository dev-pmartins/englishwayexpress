import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import ptBR from "./locales/pt-BR.json";
import enUS from "./locales/en-US.json";
import enGB from "./locales/en-GB.json";
import esES from "./locales/es-ES.json";
import frFR from "./locales/fr-FR.json";
import itIT from "./locales/it-IT.json";
import deDE from "./locales/de-DE.json";

const resources = {
  "pt-BR": { translation: ptBR },
  "en-US": { translation: enUS },
  "en-GB": { translation: enGB },
  "es-ES": { translation: esES },
  "fr-FR": { translation: frFR },
  "it-IT": { translation: itIT },
  "de-DE": { translation: deDE }
};

i18n.use(initReactI18next).init({
  resources,
  lng: "pt-BR",
  fallbackLng: "pt-BR",
  interpolation: {
    escapeValue: false
  }
});

export default i18n;
