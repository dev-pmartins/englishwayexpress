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
  "fale-conosco": "fale_conosco",
  "trabalhe-conosco": "trabalhe_conosco"
};

const API_BASE = import.meta.env.VITE_API_URL ?? "";

function LeadForm({ source }) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState(initialState);
  const [status, setStatus] = useState("idle");
  const [feedback, setFeedback] = useState("");
  const [captchaToken, setCaptchaToken] = useState(null);
  const recaptchaRef = useRef(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value
    }));
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
      const payload = {
        ...formData,
        category: SOURCE_TO_CATEGORY[source] ?? "fale_conosco",
        ...(captchaToken ? { recaptcha_token: captchaToken } : {})
      };

      const response = await fetch(`${API_BASE}/api/contacts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        const firstError = Object.values(body.errors ?? {})?.[0]?.[0];
        throw new Error(firstError ?? "API error");
      }

      setStatus("success");
      setFeedback(t("formSuccess"));
      setFormData(initialState);
      setCaptchaToken(null);
      recaptchaRef.current?.reset();
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
        {source === "trabalhe-conosco" ? t("formWorkTitle") : t("formContactTitle")}
      </h3>
      <form className="lead-form" onSubmit={handleSubmit}>
        <label>
          {t("formName")}
          <input
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          {t("formEmail")}
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          {t("formPhone")}
          <input
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
          />
        </label>

        <label>
          {t("formMessage")}
          <textarea
            name="message"
            rows={5}
            value={formData.message}
            onChange={handleChange}
            required
          />
        </label>

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
          <p className={`form-feedback ${status === "success" ? "ok" : "error"}`}>
            {feedback}
          </p>
        ) : null}
      </form>
    </section>
  );
}

export default LeadForm;
