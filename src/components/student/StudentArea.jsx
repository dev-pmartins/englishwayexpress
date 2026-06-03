import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import StudentHub from "./StudentHub";
import StudentLanguagePage from "./StudentLanguagePage";
import StudentPostPage from "./StudentPostPage";
import StudentComplementaryPage from "./StudentComplementaryPage";
import StudentTipsPage from "./StudentTipsPage";
import StudentLanguageFilter from "./StudentLanguageFilter";
import StudentLanguageModal from "./StudentLanguageModal";
import { useStudentLanguages } from "../../hooks/useStudentLanguages";

const VALID_LANG_CODES = ["en", "es", "de", "fr", "it"];
const LS_KEY = "ewe_student_languages";

// /area-do-aluno                        — public: hub with content sections
// /area-do-aluno/complementary-material — public/auth: complementary materials
// /area-do-aluno/{lang}                 — public: posts + materials (auth-gated)
// /area-do-aluno/{lang}/{slug}          — public: single post page
export default function StudentArea() {
  const location = useLocation();
  const { saveLanguages } = useStudentLanguages();
  const [showModal, setShowModal] = useState(false);

  // Auto-open modal on first visit (localStorage key never set)
  useEffect(() => {
    if (localStorage.getItem(LS_KEY) === null) {
      setShowModal(true);
    }
  }, []);

  const isComplementary = location.pathname === "/area-do-aluno/complementary-material";
  const isTips          = location.pathname === "/area-do-aluno/tips";
  const postMatch = location.pathname.match(/^\/area-do-aluno\/([a-z]{2})\/([^/]+)$/);
  const langMatch = location.pathname.match(/^\/area-do-aluno\/([a-z]{2})$/);

  let content;
  if (isComplementary) {
    content = <StudentComplementaryPage />;
  } else if (isTips) {
    content = <StudentTipsPage />;
  } else if (postMatch && VALID_LANG_CODES.includes(postMatch[1])) {
    content = <StudentPostPage langCode={postMatch[1]} slug={postMatch[2]} />;
  } else if (langMatch && VALID_LANG_CODES.includes(langMatch[1])) {
    content = <StudentLanguagePage langCode={langMatch[1]} />;
  } else {
    content = <StudentHub />;
  }

  const handleModalConfirm = () => setShowModal(false);
  const handleModalSkip = () => {
    if (localStorage.getItem(LS_KEY) === null) {
      saveLanguages([]);
    }
    setShowModal(false);
  };

  return (
    <>
      <StudentLanguageFilter />
      {content}
      {showModal && (
        <StudentLanguageModal
          onClose={handleModalSkip}
          onConfirm={handleModalConfirm}
          onSkip={handleModalSkip}
        />
      )}
    </>
  );
}
