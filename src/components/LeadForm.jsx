import { useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useTranslation } from "react-i18next";

const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY ?? "";

const initialState = {
  name: "",
  email: "",
  phone: "",
  message: ""
};

const SOURCE_TO_CATEGORY = {
  "fale-conosco":    "fale_conosco",
  "trabalhe-conosco": "trabalhe_conosco"
};

const API_BASE = import.meta.env.VITE_API_URL ?? "";

function LeadForm({ source }) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState(initialState);
  const [cvFile, setCvFile]     = useState(null);
  const [status, setStatus]     = useState("idle");
  const [feedback, setFeedback] = useState("");
  const [captchaToken, setCaptchaToken] = useState(null);
  const recaptchaRef = useRef(null);
  const fileInputRef = useRef(null);

  const isWorkForm = source === "trabalhe-conosco";

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0] ?? null;
    if (file && file.type !== "application/pdf") {
      setFeedback(t("formCvPdfOnly", "Apenas arquivos PDF são aceitos."));
      setStatus("error");
      event.target.value = "";
      setCvFile(null);
      return;
    }
    setFeedback("");
    setStatus("idle");
    setCvFile(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (RECAPTCHA_SITE_KEY && !captchaToken) {
      setStatus("error");
      setFeedback(t("formCaptchaRequired"));
      return;
    }

    setStatus("sending");
    setFeedback("");

    try {
      const category = SOURCE_TO_CATEGORY[source] ?? "fale_conosco";

      let body;
      let headers = {};

      if (isWorkForm && cvFile) {
        const fd = new FormData();
        fd.append("category", category);
        fd.append("name",     formData.name);
        fd.append("email",    formData.email);
        if (formData.phone)   fd.append("phone",   formData.phone);
        if (formData.message) fd.append("message", formData.message);
        fd.append("attachments[]", cvFile);
        if (captchaToken)     fd.append("recaptcha_token", captchaToken);
        body = fd;
      } else {
        headers["Content-Type"] = "application/json";
        body = JSON.stringify({
          ...formData,
          category,
          ...(captchaToken ? { recaptcha_token: captchaToken } : {})
        });
      }

      const response = await fetch(`${API_BASE}/api/contacts`, { method: "POST", headers, body });

      if (!response.ok) {
        const resBody = await response.json().catch(() => ({}));
        const firstError = Object.values(resBody.errors ?? {})?.[0]?.[0];
        throw new Error(firstError ?? "API error");
      }

      setStatus("success");
      setFeedback(t("formSuccess"));
      setFormData(initialState);
      setCvFile(null);
      setCaptchaToken(null);
      recaptchaRef.current?.reset();
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      setStatus("error");
      setFeedback(err.message !== "API error" ? err.message : t("formError"));
      recaptchaRef.current?.reset();
      setCaptchaToken(null);
    }
  };

  return (
    <section className="form-card" aria-live="polite">
      <h3 className="section-title section-title-small">
        {isWorkForm ? t("formWorkTitle") : t("formContactTitle")}
      </h3>
      <form className="lead-form" onSubmit={handleSubmit}>
        <label>
          {t("formName")}
          <input name="name" type="text" value={formData.name} onChange={handleChange} required placeholder={t("formNamePlaceholder", "Seu nome completo")} />
        </label>

        <label>
          {t("formEmail")}
          <input name="email" type="email" value={formData.email} onChange={handleChange} required placeholder={t("formEmailPlaceholder", "seu@email.com")} />
        </label>

        <label>
          {t("formPhone")}
          <input name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder={t("formPhonePlaceholder", "(00) 00000-0000")} />
        </label>

        <label>
          {t("formMessage")}
          <textarea name="message" rows={5} value={formData.message} onChange={handleChange} required placeholder={t("formMessagePlaceholder", isWorkForm ? "Conte um pouco sobre você e sua experiência..." : "Como podemos ajudar?")} />
        </label>

        {isWorkForm && (
          <label className="lead-form-file-label">
            {t("formCvLabel", "Currículo (PDF)")}
            <div className="lead-form-file-wrapper">
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileChange}
                className="lead-form-file-input"
              />
              {cvFile && (
                <span className="lead-form-file-name">
                  📄 {cvFile.name}
                  <button
                    type="button"
                    className="lead-form-file-remove"
                    onClick={() => { setCvFile(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                  >✕</button>
                </span>
              )}
            </div>
            <small className="lead-form-file-hint">{t("formCvHint", "Opcional · Somente PDF · Máx. 10 MB")}</small>
          </label>
        )}

        <button type="submit" disabled={status === "sending" || (RECAPTCHA_SITE_KEY && !captchaToken)}>
          {status === "sending" ? t("formSending") : t("formSubmit")}
        </button>

        {RECAPTCHA_SITE_KEY && (
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey={RECAPTCHA_SITE_KEY}
            onChange={(token) => setCaptchaToken(token)}
            onExpired={() => setCaptchaToken(null)}
          />
        )}

        {feedback ? (
          <p className={`form-feedback ${status === "success" ? "ok" : "error"}`}>{feedback}</p>
        ) : null}
      </form>
    </section>
  );
}

export default LeadForm;
