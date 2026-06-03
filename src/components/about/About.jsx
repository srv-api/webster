import React from 'react';
import './About.css';

const About = () => {
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "University Student",
      avatar: "👩‍🎓",
      text: "PostTest completely changed how I study. The interactive quizzes make learning fun and I've seen a 40% improvement in my test scores!",
      rating: 5,
      date: "2 weeks ago"
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "High School Teacher",
      avatar: "👨‍🏫",
      text: "My students are more engaged than ever. The real-time battles create healthy competition and they actually look forward to post-tests now.",
      rating: 5,
      date: "1 month ago"
    },
    {
      id: 3,
      name: "Emma Davis",
      role: "Medical Student",
      avatar: "👩‍⚕️",
      text: "The study materials and flashcards are a lifesaver. I've recommended PostTest to all my classmates. Best learning platform ever!",
      rating: 5,
      date: "3 weeks ago"
    },
    {
      id: 4,
      name: "James Wilson",
      role: "Parent",
      avatar: "👨‍👧",
      text: "My daughter's grades have improved significantly since using PostTest. She spends hours learning without feeling bored.",
      rating: 5,
      date: "1 week ago"
    },
    {
      id: 5,
      name: "Lisa Anderson",
      role: "Software Engineer",
      avatar: "👩‍💻",
      text: "Perfect for continuous learning. The analytics help me identify weak spots and the daily challenges keep me sharp.",
      rating: 5,
      date: "5 days ago"
    },
    {
      id: 6,
      name: "David Park",
      role: "PhD Candidate",
      avatar: "🎓",
      text: "The depth of content and quality of questions is impressive. A game-changer for exam preparation.",
      rating: 5,
      date: "2 days ago"
    }
  ];

  return (
    <section className="about" id="about">
      <div className="about-container">
        {/* Header */}
        <div className="testimonial-header">
          <h2 className="testimonial-title">
            What Our<span className="highlight"> Learners Say</span>
          </h2>
          <p className="testimonial-description">
            Join thousands of satisfied learners who have transformed their learning experience with PostTest
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="testimonials-grid">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="testimonial-card">
              <div className="testimonial-header-card">
                <div className="testimonial-avatar">
                  <span>{testimonial.avatar}</span>
                </div>
                <div className="testimonial-info">
                  <h3 className="testimonial-name">{testimonial.name}</h3>
                  <p className="testimonial-role">{testimonial.role}</p>
                </div>
                <div className="testimonial-quote">“</div>
              </div>
              
              <p className="testimonial-text">{testimonial.text}</p>
              
              <div className="testimonial-footer">
                <div className="testimonial-stars">
                  {'★'.repeat(testimonial.rating)}
                  {'☆'.repeat(5 - testimonial.rating)}
                </div>
                <span className="testimonial-date">{testimonial.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;