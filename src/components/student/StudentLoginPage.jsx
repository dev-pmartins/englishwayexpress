import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Navigate, useNavigate } from "react-router-dom";
import { useStudentAuth } from "../../contexts/StudentAuthContext";

export default function StudentLoginPage() {
  const { t } = useTranslation();
  const { login, loading, isAuthenticated } = useStudentAuth();
  const navigate = useNavigate();

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");

  if (isAuthenticated) {
    return <Navigate to="/area-do-aluno" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      navigate("/area-do-aluno", { replace: true });
    } catch (err) {
      const msg =
        err?.errors?.email?.[0] ??
        err?.message ??
        t("studentLoginError");
      setError(msg);
    }
  };

  return (
    <div className="student-login-page">
      {/* Hero (left) */}
      <div className="student-login-hero">
        <div className="student-login-hero-inner">
          <div className="student-login-logo-row">
            <img src="/logo-englishwayexpress.png" alt="English Way Express" />
          </div>
          <h1 className="student-login-headline">{t("studentLoginTitle")}</h1>
          <p className="student-login-tagline">{t("studentLoginTagline")}</p>

          <ul className="student-login-features">
            <li>📚 {t("studentFeature1")}</li>
            <li>🎯 {t("studentFeature2")}</li>
            <li>📎 {t("studentFeature3")}</li>
          </ul>
        </div>
      </div>

      {/* Form (right) */}
      <div className="student-login-form-panel">
        <div className="student-login-form-inner">
          <h2 className="student-login-form-title">{t("studentLoginFormTitle")}</h2>
          <p className="student-login-form-hint">{t("studentLoginHint")}</p>

          <form className="student-login-form" onSubmit={handleSubmit}>
            <div className="student-field">
              <label htmlFor="sl-email">{t("formEmail")}</label>
              <input
                id="sl-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                autoComplete="email"
              />
            </div>

            <div className="student-field">
              <label htmlFor="sl-password">{t("studentPassword")}</label>
              <input
                id="sl-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div className="student-login-error" role="alert">
                {error}
              </div>
            )}

            <button
              className="student-login-btn"
              type="submit"
              disabled={loading}
            >
              {loading ? t("studentLoggingIn") : t("studentLoginSubmit")}
            </button>
          </form>

          <p className="student-login-contact-hint">
            {t("studentLoginContactHint")}{" "}
            <a href="/fale-conosco">{t("studentLoginContactLink")}</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
