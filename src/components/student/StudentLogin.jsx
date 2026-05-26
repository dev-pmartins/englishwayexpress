import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useStudentAuth } from "../../contexts/StudentAuthContext";

export default function StudentLogin() {
  const { t } = useTranslation();
  const { login, loading } = useStudentAuth();

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
    } catch (err) {
      const msg =
        err?.errors?.email?.[0] ??
        err?.message ??
        t("studentLoginError");
      setError(msg);
    }
  };

  return (
    <div className="student-login-wrap">
      <div className="form-card student-login-card">
        <h2 className="section-title section-title-small">{t("studentLoginTitle")}</h2>
        <p className="student-login-hint">{t("studentLoginHint")}</p>

        <form className="lead-form" onSubmit={handleSubmit}>
          <label>
            {t("formEmail")}
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </label>

          <label>
            {t("studentPassword")}
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </label>

          <button type="submit" disabled={loading}>
            {loading ? t("studentLoggingIn") : t("studentLoginSubmit")}
          </button>

          {error && <p className="form-feedback error">{error}</p>}
        </form>
      </div>
    </div>
  );
}
