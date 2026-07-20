import { useState } from "react";
import {
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaGithub,
  FaFacebook,
  FaLinkedin,
} from "react-icons/fa";

import "./Contact.css";

function Contact() {
  // 1. Loading state ကို သတ်မှတ်ခြင်း
  const [loading, setLoading] = useState(false);
  
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // 2. Submit လုပ်သည့် function (Loading logic ပါဝင်သည်)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.subject || !form.message) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true); // Loading စတင်ခြင်း

    // ၁.၅ စက္ကန့် နှောင့်နှေးခြင်း (Demo အနေဖြင့်)
    await new Promise((resolve) => setTimeout(resolve, 1500));

    alert("Message Sent Successfully!");

    setLoading(false); // Loading ပြီးဆုံးခြင်း

    // Form ကို အလွတ်ပြန်ဖြစ်စေခြင်း
    setForm({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  };

  return (
    <section className="contact-page">
      <div className="contact-header">
        <h1>Contact Us</h1>
        <p>
          We'd love to hear from you.
          Feel free to contact us anytime.
        </p>
      </div>

      <div className="contact-container">
        {/* Contact Form */}
        <form className="contact-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
          />
          <input
            type="text"
            name="subject"
            placeholder="Subject"
            value={form.subject}
            onChange={handleChange}
          />
          <textarea
            rows="6"
            name="message"
            placeholder="Your Message"
            value={form.message}
            onChange={handleChange}
          />

          {/* 3. Loading ပေါ်မူတည်၍ ခလုတ်ကို ထိန်းချုပ်ခြင်း */}
          <button type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>

        {/* Contact Info */}
        <div className="contact-info">
          <h2>Contact Information</h2>
          <p><FaEnvelope /> your@email.com</p>
          <p><FaPhoneAlt /> +95 9 123 456 789</p>
          <p><FaMapMarkerAlt /> Yangon, Myanmar</p>
          
          <div className="social-links">
            <a href="#"><FaGithub /></a>
            <a href="#"><FaFacebook /></a>
            <a href="#"><FaLinkedin /></a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;