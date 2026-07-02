import { useEffect, useState } from "react";
import { publicApi } from "../api/publicApi";

const LS_KEY = "ewe_student_languages";

const readFromStorage = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(LS_KEY));
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
};

export function useStudentLanguages() {
  const [languages, setLanguages] = useState(readFromStorage);
  const [availableCodes, setAvailableCodes] = useState([]);

  useEffect(() => {
    publicApi.getLanguages()
      .then(body => {
        const langs = body.data ?? body;
        setAvailableCodes(Array.isArray(langs) ? langs.map(l => l.code) : []);
      })
      .catch(() => {});
  }, []);

  const saveLanguages = (langs) => {
    const validCodes = availableCodes.length > 0 ? availableCodes : langs;
    const clean = [...new Set(langs.filter(c => validCodes.includes(c)))];
    setLanguages(clean);
    localStorage.setItem(LS_KEY, JSON.stringify(clean));
  };

  return { languages, saveLanguages, availableCodes };
}
