import { Link } from 'react-router-dom';
import {
  Upload, CreditCard, Package, Printer, Palette, BookOpen,
  ScanLine, Layers, ChevronDown, Star, CheckCircle2, ArrowRight
} from 'lucide-react';
import { useState } from 'react';

const steps = [
  { icon: Upload, title: 'Upload Document', desc: 'Drag & drop your PDF, DOCX, PPTX or image files. Up to 10 files per order.' },
  { icon: Printer, title: 'Choose Options', desc: 'Select paper size, color mode, binding, number of copies, and delivery method.' },
  { icon: CreditCard, title: 'Pay & Collect', desc: 'Pay securely via card or mobile money. Collect at our desk or get campus delivery.' },
];

const services = [
  { icon: Printer, title: 'B&W Printing', desc: 'From GH₵ 0.50/page', color: 'bg-blue-50 text-primary-600' },
  { icon: Palette, title: 'Color Printing', desc: 'From GH₵ 2.00/page', color: 'bg-emerald-50 text-emerald-600' },
  { icon: BookOpen, title: 'Binding', desc: 'Spiral from GH₵ 5.00', color: 'bg-amber-50 text-amber-600' },
  { icon: ScanLine, title: 'Scanning', desc: 'GH₵ 0.50/page', color: 'bg-purple-50 text-purple-600' },
  { icon: Layers, title: 'Bulk Orders', desc: '10% off 100+ pages', color: 'bg-rose-50 text-rose-600' },
  { icon: Package, title: 'Campus Delivery', desc: 'Flat GH₵ 3.00 fee', color: 'bg-teal-50 text-teal-600' },
];

const testimonials = [
  { name: 'Abena K.', school: 'University of Ghana', rating: 5, text: 'Saved me so much time! I upload from my room and collect on my way to lectures. Game changer.' },
  { name: 'Kwame A.', school: 'KNUST', rating: 5, text: 'Color printing quality is amazing. Submitted my project report and it looked super professional.' },
  { name: 'Ama O.', school: 'Ashesi University', rating: 5, text: 'The bulk discount is real! Printed 200 pages for my thesis and saved a good amount. Highly recommend.' },
  { name: 'Kofi M.', school: 'UCC', rating: 4, text: 'Fast service, great pricing. The order tracking is very convenient — I knew exactly when to pick up.' },
];

const faqs = [
  { q: 'What file formats do you accept?', a: 'We accept PDF, Word (.doc/.docx), PowerPoint (.ppt/.pptx), Excel (.xls/.xlsx), and images (JPG/PNG). PDF is recommended for best print quality.' },
  { q: 'How long does printing take?', a: 'Standard orders are ready within 30–60 minutes. Bulk orders (100+ pages) may take up to 2 hours. You will receive a notification when your order is ready.' },
  { q: 'Is my payment secure?', a: 'Yes. All payments are processed through Paystack, a PCI-DSS compliant payment gateway. We never store your card details.' },
  { q: 'What if I am not happy with my print?', a: 'If there is a quality issue on our end, we will reprint your order for free. Contact us within 24 hours of collection with photos of the issue.' },
  { q: 'Can I cancel my order?', a: 'You can cancel within 5 minutes of payment if printing has not started. After that, we are unable to issue refunds as printing will have begun.' },
];

export default function Home() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-800 via-primary-700 to-primary-600 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block bg-white/20 text-white text-sm font-medium px-4 py-1.5 rounded-full mb-5">
            🎓 Trusted by 10,000+ students across campus
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-5 leading-tight">
            Print Smarter.<br />
            <span className="text-blue-200">No Queues. Ever.</span>
          </h1>
          <p className="text-lg sm:text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Upload your documents online, configure your print settings, pay securely, and collect when ready — all without waiting in line.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/order" className="bg-white text-primary-700 px-8 py-3.5 rounded-xl font-bold text-base hover:bg-blue-50 transition-colors inline-flex items-center gap-2 justify-center">
              <Upload size={18} /> Upload & Print Now
            </Link>
            <Link to="/pricing" className="border-2 border-white/60 text-white px-8 py-3.5 rounded-xl font-bold text-base hover:bg-white/10 transition-colors inline-flex items-center gap-2 justify-center">
              View Pricing <ArrowRight size={18} />
            </Link>
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-6 text-sm text-blue-200">
            <span className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-emerald-300" /> PDF, DOCX, PPTX, Images</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-emerald-300" /> Paystack Secured</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-emerald-300" /> Campus Delivery Available</span>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto text-center mb-12">
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">Three simple steps from upload to print</p>
        </div>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((s, i) => (
            <div key={i} className="card text-center relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                {i + 1}
              </div>
              <div className="w-14 h-14 rounded-2xl bg-primary-50 flex items-center justify-center mx-auto mb-4 mt-2">
                <s.icon size={26} className="text-primary-600" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">{s.title}</h3>
              <p className="text-gray-500 text-sm">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto text-center mb-12">
          <h2 className="section-title">Our Services</h2>
          <p className="section-subtitle">Everything you need for your campus documents</p>
        </div>
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-4">
          {services.map((s, i) => (
            <div key={i} className="card hover:shadow-md transition-shadow cursor-default">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>
                <s.icon size={22} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{s.title}</h3>
              <p className="text-sm text-gray-500">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="section-title">Simple, Transparent Pricing</h2>
            <p className="section-subtitle">No hidden fees. What you see is what you pay.</p>
          </div>
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full text-sm">
              <thead className="bg-primary-600 text-white">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold">Service</th>
                  <th className="text-center px-4 py-3 font-semibold">Price (GHS)</th>
                  <th className="text-left px-4 py-3 font-semibold">Notes</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['A4 B&W Print', '0.50 / pg', 'Single-sided'],
                  ['A4 B&W Print', '0.80 / pg', 'Double-sided'],
                  ['A4 Color Print', '2.00 / pg', 'Single-sided'],
                  ['A4 Color Print', '3.50 / pg', 'Double-sided'],
                  ['A3 B&W Print', '1.00 / pg', '—'],
                  ['A3 Color Print', '4.00 / pg', '—'],
                  ['Spiral Binding', '5.00', 'Per document'],
                  ['Bulk 100+ pages', '10% off', 'Auto-applied'],
                ].map(([svc, price, note], i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-3 font-medium text-gray-800">{svc}</td>
                    <td className="px-4 py-3 text-center text-primary-600 font-bold">{price}</td>
                    <td className="px-4 py-3 text-gray-500">{note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="text-center mt-6">
            <Link to="/pricing" className="btn-primary">
              Full Pricing & Calculator <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 bg-gradient-to-br from-primary-50 to-blue-50">
        <div className="max-w-5xl mx-auto text-center mb-12">
          <h2 className="section-title">What Students Say</h2>
          <p className="section-subtitle">Thousands of happy students across campus</p>
        </div>
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-5">
          {testimonials.map((t, i) => (
            <div key={i} className="card">
              <div className="flex gap-1 mb-3">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} size={16} className="text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-4 italic">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-sm">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.school}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="section-title">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-3">
            {faqs.map((f, i) => (
              <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
                <button
                  className="w-full flex items-center justify-between px-5 py-4 text-left font-medium text-gray-800 hover:bg-gray-50 transition-colors"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  aria-expanded={openFaq === i}
                >
                  {f.q}
                  <ChevronDown
                    size={18}
                    className={`shrink-0 text-gray-400 transition-transform ${openFaq === i ? 'rotate-180' : ''}`}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4 text-gray-600 text-sm">{f.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-14 px-4 bg-primary-700 text-white text-center">
        <h2 className="text-3xl font-bold mb-3">Ready to print smarter?</h2>
        <p className="text-blue-200 mb-7">Join thousands of students who skip the queue every day.</p>
        <Link to="/order" className="bg-white text-primary-700 px-8 py-3.5 rounded-xl font-bold text-base hover:bg-blue-50 transition-colors inline-flex items-center gap-2">
          <Upload size={18} /> Get Started Now
        </Link>
      </section>
    </div>
  );
}
