import { useStudentAuth } from "../../contexts/StudentAuthContext";
import { Navigate, useLocation } from "react-router-dom";
import StudentHub from "./StudentHub";
import StudentLanguagePage from "./StudentLanguagePage";

const VALID_LANG_CODES = ["en", "es", "de", "fr", "it"];

// /area-do-aluno   — public: shows language banner hub
// /area-do-aluno/{lang} — protected: requires login to view posts
export default function StudentArea() {
  const { isAuthenticated } = useStudentAuth();
  const location = useLocation();

  const match = location.pathname.match(/^\/area-do-aluno\/([a-z]{2})$/);
  const langCode = match?.[1];

  if (langCode && VALID_LANG_CODES.includes(langCode)) {
    if (!isAuthenticated) {
      return <Navigate to="/area-do-aluno/login" replace />;
    }
    return <StudentLanguagePage langCode={langCode} />;
  }

  return <StudentHub />;
}
