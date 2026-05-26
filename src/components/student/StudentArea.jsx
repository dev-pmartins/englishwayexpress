import { useLocation } from "react-router-dom";
import StudentHub from "./StudentHub";
import StudentLanguagePage from "./StudentLanguagePage";
import StudentPostPage from "./StudentPostPage";

const VALID_LANG_CODES = ["en", "es", "de", "fr", "it"];

// /area-do-aluno            — public: language banner hub
// /area-do-aluno/{lang}     — public: posts + materials (auth-gated)
// /area-do-aluno/{lang}/{slug} — public: single post page
export default function StudentArea() {
  const location = useLocation();

  const postMatch = location.pathname.match(/^\/area-do-aluno\/([a-z]{2})\/([^/]+)$/);
  if (postMatch && VALID_LANG_CODES.includes(postMatch[1])) {
    return <StudentPostPage langCode={postMatch[1]} slug={postMatch[2]} />;
  }

  const langMatch = location.pathname.match(/^\/area-do-aluno\/([a-z]{2})$/);
  if (langMatch && VALID_LANG_CODES.includes(langMatch[1])) {
    return <StudentLanguagePage langCode={langMatch[1]} />;
  }

  return <StudentHub />;
}
