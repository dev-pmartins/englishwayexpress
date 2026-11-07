import { useLocation } from "react-router-dom";
import StudentHub from "./StudentHub";
import StudentLanguagePage from "./StudentLanguagePage";
import StudentPostPage from "./StudentPostPage";
import StudentComplementaryPage from "./StudentComplementaryPage";
import StudentTipsPage from "./StudentTipsPage";
import StudentPracticePage from "./StudentPracticePage";
import StudentMaterialPage from "./StudentMaterialPage";

const LANG_CODE_PATTERN = /^[a-z]{2}(-[A-Z]{2})?$/;

// /area-do-aluno                        — public: hub with content sections
// /area-do-aluno/complementary-material — public/auth: complementary materials
// /area-do-aluno/{lang}                 — public: posts + materials (auth-gated)
// /area-do-aluno/{lang}/{slug}          — public: single post page
export default function StudentArea() {
  const location = useLocation();

  const isComplementary = location.pathname === "/area-do-aluno/complementary-material";
  const isTips          = location.pathname === "/area-do-aluno/tips";
  const isPractice      = location.pathname === "/area-do-aluno/practice";
  const materialMatch   = location.pathname.match(/^\/area-do-aluno\/material\/([^/]+)$/);
  const postMatch = location.pathname.match(/^\/area-do-aluno\/([a-z]{2}(?:-[A-Z]{2})?)\/([^/]+)$/);
  const langMatch = location.pathname.match(/^\/area-do-aluno\/([a-z]{2}(?:-[A-Z]{2})?)$/);

  let content;
  if (isComplementary) {
    content = <StudentComplementaryPage />;
  } else if (isTips) {
    content = <StudentTipsPage />;
  } else if (isPractice) {
    content = <StudentPracticePage />;
  } else if (materialMatch) {
    content = <StudentMaterialPage slug={materialMatch[1]} />;
  } else if (postMatch && LANG_CODE_PATTERN.test(postMatch[1])) {
    content = <StudentPostPage langCode={postMatch[1]} slug={postMatch[2]} />;
  } else if (langMatch && LANG_CODE_PATTERN.test(langMatch[1])) {
    content = <StudentLanguagePage langCode={langMatch[1]} />;
  } else {
    content = <StudentHub />;
  }

  return content;
}
