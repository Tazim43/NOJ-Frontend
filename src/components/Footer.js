import Link from "next/link";
import { FaGithub, FaTwitter, FaLinkedin, FaFacebook } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-950 text-gray-400 py-10 px-4 border-t border-gray-800">
      <div className="max-w-7xl mx-auto">
        {/* Grid layout for sections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center md:text-left">
          {/* Brand & Description */}
          <div>
            <h2 className="text-2xl font-semibold text-white mb-2">NaiveOJ</h2>
            <p className="text-sm leading-relaxed">
              NaiveOJ is a modern platform for coding challenges, mock
              interviews, and contests - built to empower future engineers.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-medium text-white mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:text-teal-400 transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-teal-400 transition"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-teal-400 transition">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-teal-400 transition"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-medium text-white mb-3">
              Connect with Us
            </h3>
            <div className="flex justify-center md:justify-start space-x-5 text-2xl">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-teal-400 transition"
              >
                <FaGithub />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-teal-400 transition"
              >
                <FaTwitter />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-teal-400 transition"
              >
                <FaLinkedin />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-teal-400 transition"
              >
                <FaFacebook />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 mt-10 pt-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()}{" "}
          <span className="text-white font-medium">NaiveOJ</span>. All rights
          reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
