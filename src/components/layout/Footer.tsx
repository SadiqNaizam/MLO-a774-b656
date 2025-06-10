import React from 'react';
import { Link } from 'react-router-dom'; // Assuming react-router-dom is used

const Footer: React.FC = () => {
  console.log("Rendering Footer");
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-4">
          <Link to="/about" className="text-sm text-gray-600 hover:text-primary">About Us</Link>
          <Link to="/contact" className="text-sm text-gray-600 hover:text-primary">Contact</Link>
          <Link to="/privacy" className="text-sm text-gray-600 hover:text-primary">Privacy Policy</Link>
          <Link to="/terms" className="text-sm text-gray-600 hover:text-primary">Terms of Service</Link>
          {/* Add more links as needed */}
        </div>
        <p className="text-sm text-gray-500">
          &copy; {currentYear} YourAppName. All rights reserved.
        </p>
        {/* Optional: Add social media icons or other footer elements */}
      </div>
    </footer>
  );
};

export default Footer;