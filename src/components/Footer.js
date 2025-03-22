import Link from "next/link";
import { FaGithub, FaTwitter, FaLinkedin, FaFacebook } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-6 px-4">
      <div className="max-w-6xl mx-auto text-center">
        {/* Links */}
        <div className="flex justify-center space-x-6 mb-4">
          <Link href="/terms" className="hover:text-teal-400 transition">
            Terms of Service
          </Link>
          <Link href="/privacy" className="hover:text-teal-400 transition">
            Privacy Policy
          </Link>
          <Link href="/contact" className="hover:text-teal-400 transition">
            Contact Us
          </Link>
        </div>

        {/* Social Media Icons */}
        <div className="flex justify-center space-x-6 mt-4">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition text-2xl"
          >
            <FaGithub />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition text-2xl"
          >
            <FaTwitter />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition text-2xl"
          >
            <FaLinkedin />
          </a>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition text-2xl"
          >
            <FaFacebook />
          </a>
        </div>

        {/* Copyright */}
        <p className="text-sm text-gray-500 mt-4">
          © {new Date().getFullYear()} NaiveOJ. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
