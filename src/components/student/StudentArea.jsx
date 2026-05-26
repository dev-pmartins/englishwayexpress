import { useStudentAuth } from "../../contexts/StudentAuthContext";
import { Navigate } from "react-router-dom";
import StudentModules from "./StudentModules";

// /area-do-aluno — protected; redirects to login if not authenticated
export default function StudentArea() {
  const { isAuthenticated } = useStudentAuth();

  if (!isAuthenticated) {
    return <Navigate to="/area-do-aluno/login" replace />;
  }

  return <StudentModules />;
}
