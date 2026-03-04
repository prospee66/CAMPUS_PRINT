import { useState } from 'react';
import { MapPin, Phone, Mail, MessageCircle, Clock, Send, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill in all required fields');
      return;
    }
    // In production: POST to backend / SendGrid
    toast.success('Message sent! We\'ll get back to you within 24 hours.');
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="section-title">Contact & Support</h1>
          <p className="section-subtitle">We're here to help. Reach us any way you prefer.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-5">Send Us a Message</h2>

            {sent ? (
              <div className="text-center py-8">
                <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={28} className="text-accent" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Message Received!</h3>
                <p className="text-gray-500 text-sm">We'll respond to your email within 24 hours.</p>
                <button onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }); }} className="btn-outline mt-4 text-sm">
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="label">Full Name *</label>
                    <input id="name" type="text" placeholder="Kofi Mensah" value={form.name}
                      onChange={e => set('name', e.target.value)} className="input" required />
                  </div>
                  <div>
                    <label htmlFor="email" className="label">Email Address *</label>
                    <input id="email" type="email" placeholder="you@uni.edu.gh" value={form.email}
                      onChange={e => set('email', e.target.value)} className="input" required />
                  </div>
                </div>
                <div>
                  <label htmlFor="subject" className="label">Subject</label>
                  <input id="subject" type="text" placeholder="e.g. Order issue, Refund request" value={form.subject}
                    onChange={e => set('subject', e.target.value)} className="input" />
                </div>
                <div>
                  <label htmlFor="message" className="label">Message *</label>
                  <textarea
                    id="message"
                    rows={5}
                    placeholder="Describe your issue or question in detail..."
                    value={form.message}
                    onChange={e => set('message', e.target.value)}
                    className="input resize-none"
                    required
                  />
                </div>
                <button type="submit" className="btn-primary w-full justify-center">
                  <Send size={16} /> Send Message
                </button>
              </form>
            )}
          </div>

          {/* Info Panel */}
          <div className="space-y-4">
            {/* Quick contact cards */}
            {[
              {
                icon: MapPin,
                title: 'Visit Us',
                desc: 'Student Services Building, Room 12\nUniversity of Ghana, Legon',
                color: 'text-primary-600 bg-primary-50',
              },
              {
                icon: Phone,
                title: 'Call Us',
                desc: '+233 24 400 0000',
                link: 'tel:+233244000000',
                color: 'text-emerald-600 bg-emerald-50',
              },
              {
                icon: Mail,
                title: 'Email Us',
                desc: 'hello@printhub.com',
                link: 'mailto:hello@printhub.com',
                color: 'text-amber-600 bg-amber-50',
              },
            ].map((c, i) => (
              <div key={i} className="card flex items-start gap-4">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${c.color}`}>
                  <c.icon size={20} />
                </div>
                <div>
                  <p className="font-semibold text-gray-800 mb-0.5">{c.title}</p>
                  {c.link ? (
                    <a href={c.link} className="text-sm text-gray-600 hover:text-primary-600 transition-colors">{c.desc}</a>
                  ) : (
                    <p className="text-sm text-gray-600 whitespace-pre-line">{c.desc}</p>
                  )}
                </div>
              </div>
            ))}

            {/* WhatsApp */}
            <div className="card bg-green-50 border-green-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-green-100">
                    <MessageCircle size={20} className="text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">WhatsApp Support</p>
                    <p className="text-sm text-gray-500">Fastest response — usually within minutes</p>
                  </div>
                </div>
                <a
                  href="https://wa.me/233244000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                >
                  Chat Now
                </a>
              </div>
            </div>

            {/* Opening Hours */}
            <div className="card">
              <div className="flex items-center gap-2 mb-3">
                <Clock size={16} className="text-primary-600" />
                <h3 className="font-semibold text-gray-800">Opening Hours</h3>
              </div>
              <div className="space-y-1 text-sm">
                {[
                  ['Monday – Friday', '7:00 AM – 8:00 PM'],
                  ['Saturday', '9:00 AM – 5:00 PM'],
                  ['Sunday', '10:00 AM – 3:00 PM'],
                  ['Public Holidays', 'Closed'],
                ].map(([day, hours]) => (
                  <div key={day} className="flex justify-between">
                    <span className="text-gray-600">{day}</span>
                    <span className="font-medium text-gray-800">{hours}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
