import { useLocation } from "react-router-dom";
import StudentHub from "./StudentHub";
import StudentLanguagePage from "./StudentLanguagePage";

const VALID_LANG_CODES = ["en", "es", "de", "fr", "it"];

// /area-do-aluno   — public: language banner hub
// /area-do-aluno/{lang} — public posts + protected materials section inside
export default function StudentArea() {
  const location = useLocation();

  const match = location.pathname.match(/^\/area-do-aluno\/([a-z]{2})$/);
  const langCode = match?.[1];

  if (langCode && VALID_LANG_CODES.includes(langCode)) {
    return <StudentLanguagePage langCode={langCode} />;
  }

  return <StudentHub />;
}
