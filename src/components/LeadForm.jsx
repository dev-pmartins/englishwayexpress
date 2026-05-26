import { useState } from "react";
import { useTranslation } from "react-i18next";

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

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setStatus("sending");
    setFeedback("");

    try {
      const payload = {
        ...formData,
        category: SOURCE_TO_CATEGORY[source] ?? "fale_conosco"
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
    } catch (err) {
      setStatus("error");
      setFeedback(err.message !== "API error" ? err.message : t("formError"));
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
