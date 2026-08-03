import { useState } from "react";
import PageHeader from "../components/PageHeader.jsx";
import Panel from "../components/Panel.jsx";
import FormInput from "../components/FormInput.jsx";
import Toast from "../components/Toast.jsx";

export default function Contact() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, show: false }));
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        showToast("Message Sent Successfully.", "success");

        setFormData({
          fullName: "",
          email: "",
          subject: "",
          message: "",
        });
      } else {
        showToast(data.message || "Failed to send message.", "error");
      }
    } catch (error) {
      showToast(error.message || "An error occurred.", "error");
    }

    setLoading(false);
  };

  return (
    <main className="pageContainer">
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          duration={3000}
          onClose={hideToast}
        />
      )}

      <PageHeader
        title="Contact Support"
        text="Send us your message."
      />

      <Panel>

        <form onSubmit={submitHandler}>

          <div className="formGrid">

            <FormInput
              label="Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Your Name"
            />

            <FormInput
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
            />

            <FormInput
              label="Subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Enter Subject"
            />

            <label className="formGroup full">

              <span>Message</span>

              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Write your message..."
              />

            </label>

          </div>

          <button
            className="btn"
            disabled={loading}
          >
            {loading ? "Sending..." : "Submit Message"}
          </button>

        </form>

      </Panel>

    </main>
  );
}