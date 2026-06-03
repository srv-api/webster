import { useState } from "react";
import "./FAQ.css";

export default function FAQ({ faqRef, t }) {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqs = [
    {
      question: t.faqQ1 || "Apa itu PostTest?",
      answer: t.faqA1 || "PostTest adalah platform pembelajaran interaktif yang membantu siswa belajar melalui kuis, battle real-time, dan materi belajar yang menarik.",
    },
    {
      question: t.faqQ2 || "Apakah PostTest gratis?",
      answer: t.faqA2 || "Ya, PostTest menyediakan versi gratis dengan fitur dasar. Kami juga memiliki paket premium untuk fitur yang lebih lengkap.",
    },
    {
      question: t.faqQ3 || "Bagaimana cara memulai?",
      answer: t.faqA3 || "Cukup daftar akun gratis, pilih mata pelajaran yang ingin dipelajari, dan mulai kerjakan post-test atau ikuti battle.",
    },
    {
      question: t.faqQ4 || "Apakah ada sertifikat?",
      answer: t.faqA4 || "Ya, Anda akan mendapatkan sertifikat digital setelah menyelesaikan post-test dengan nilai memuaskan.",
    },
    {
      question: t.faqQ5 || "Bisa digunakan di mobile?",
      answer: t.faqA5 || "Tentu! PostTest tersedia di web, iOS, dan Android sehingga Anda bisa belajar kapan saja dan di mana saja.",
    },
  ];

  return (
    <section ref={faqRef} className="faq">
      <div className="faq-container">
        <div className="faq-header">
          <span className="faq-badge">FAQ</span>
          <h2 className="faq-title">
            Frequently Asked<span className="faq-highlight"> Questions</span>
          </h2>
          <p className="faq-description">
            Find answers to common questions about PostTest platform
          </p>
        </div>

        <div className="faq-list">
          {faqs.map((item, index) => (
            <div
              key={index}
              className={`faq-item ${activeIndex === index ? "active" : ""}`}
              onClick={() => toggleFAQ(index)}
            >
              <div className="faq-question">
                <span className="faq-question-text">{item.question}</span>
                <span className="faq-icon">
                  {activeIndex === index ? "−" : "+"}
                </span>
              </div>

              <div className="faq-answer-wrapper">
                {activeIndex === index && (
                  <div className="faq-answer">
                    <p>{item.answer}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}