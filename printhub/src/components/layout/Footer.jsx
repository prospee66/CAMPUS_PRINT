import { Link } from 'react-router-dom';
import { Printer, MapPin, Phone, Mail, Facebook, Twitter, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 font-bold text-xl text-white mb-3">
              <div className="bg-primary-600 text-white p-1.5 rounded-lg">
                <Printer size={20} />
              </div>
              CampusPrint
            </Link>
            <p className="text-sm text-gray-400 mb-4">
              Fast, affordable campus printing. Upload from anywhere, collect when ready.
            </p>
            <div className="flex gap-3">
              <a href="#" aria-label="Facebook" className="hover:text-primary-400 transition-colors"><Facebook size={18} /></a>
              <a href="#" aria-label="Twitter" className="hover:text-primary-400 transition-colors"><Twitter size={18} /></a>
              <a href="#" aria-label="Instagram" className="hover:text-primary-400 transition-colors"><Instagram size={18} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {[['/', 'Home'], ['/order', 'Order Now'], ['/pricing', 'Pricing'], ['/track', 'Track Order'], ['/contact', 'Contact']].map(([to, label]) => (
                <li key={to}>
                  <Link to={to} className="hover:text-primary-400 transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Black & White Printing</li>
              <li>Color Printing</li>
              <li>Spiral Binding</li>
              <li>Hardcover Binding</li>
              <li>Document Scanning</li>
              <li>Bulk Orders</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin size={16} className="mt-0.5 text-primary-400 shrink-0" />
                <span>Student Services Building, Room 12, University Campus</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="text-primary-400" />
                <a href="tel:+233244000000" className="hover:text-primary-400 transition-colors">+233 24 400 0000</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-primary-400" />
                <a href="mailto:hello@campusprint.com" className="hover:text-primary-400 transition-colors">hello@campusprint.com</a>
              </li>
            </ul>
            <div className="mt-4 text-xs text-gray-500">
              <p>Mon – Fri: 7:00 AM – 8:00 PM</p>
              <p>Sat – Sun: 9:00 AM – 5:00 PM</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} CampusPrint. All rights reserved.</p>
          <div className="flex gap-4 mt-3 sm:mt-0">
            <a href="#" className="hover:text-gray-300">Privacy Policy</a>
            <a href="#" className="hover:text-gray-300">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
