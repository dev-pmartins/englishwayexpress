import { StudentAuthProvider, useStudentAuth } from "../../contexts/StudentAuthContext";
import StudentLogin from "./StudentLogin";
import StudentModules from "./StudentModules";

function StudentAreaInner() {
  const { isAuthenticated } = useStudentAuth();
  return isAuthenticated ? <StudentModules /> : <StudentLogin />;
}

export default function StudentArea() {
  return (
    <StudentAuthProvider>
      <StudentAreaInner />
    </StudentAuthProvider>
  );
}
