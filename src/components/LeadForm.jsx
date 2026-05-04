import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

const initialState = {
  name: "",
  email: "",
  phone: "",
  message: ""
};

function LeadForm({ source }) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState(initialState);
  const [status, setStatus] = useState("idle");
  const [feedback, setFeedback] = useState("");

  const webhookUrl = useMemo(
    () => import.meta.env.VITE_GOOGLE_SHEETS_WEBHOOK_URL,
    []
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!webhookUrl) {
      setStatus("error");
      setFeedback(t("formMissingWebhook"));
      return;
    }

    setStatus("sending");
    setFeedback("");

    try {
      const payload = {
        ...formData,
        source,
        locale: navigator.language,
        sentAt: new Date().toISOString()
      };

      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error("Webhook error");
      }

      setStatus("success");
      setFeedback(t("formSuccess"));
      setFormData(initialState);
    } catch {
      setStatus("error");
      setFeedback(t("formError"));
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

        <button type="submit" disabled={status === "sending"}>
          {status === "sending" ? t("formSending") : t("formSubmit")}
        </button>

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
