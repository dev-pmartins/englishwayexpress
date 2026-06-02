import { useState } from "react";

const LS_KEY = "ewe_student_languages";
const VALID_CODES = ["en", "es", "de", "fr", "it"];

const readFromStorage = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(LS_KEY));
    if (!Array.isArray(saved)) return [];
    return [...new Set(saved.filter((c) => VALID_CODES.includes(c)))];
  } catch {
    return [];
  }
};

export function useStudentLanguages() {
  const [languages, setLanguages] = useState(readFromStorage);

  const saveLanguages = (langs) => {
    const clean = [...new Set(langs.filter((c) => VALID_CODES.includes(c)))];
    setLanguages(clean);
    localStorage.setItem(LS_KEY, JSON.stringify(clean));
  };

  return { languages, saveLanguages };
}
