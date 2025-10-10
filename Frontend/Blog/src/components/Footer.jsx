// ...existing code...
import React from "react";

const Footer = () => {
  return (
    <footer className="border-t mt-20">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl md:text-3xl font-bold mb-4 font-serif">
              BLOGIFY SPACE
            </h3>
            <p className="text-sm md:text-base text-gray-600 mb-4 max-w-md">
              Discover a world of insights, inspiration and innovation. Your
              destination for stories that matter.
            </p>
          </div>
          <div>
            <h4 className="text-lg md:text-xl font-semibold mb-4">
              Categories
            </h4>
            <ul className="space-y-2 text-sm md:text-base text-gray-600">
              <li>
                <a href="#" className="hover:text-gray-900 transition-colors">
                  Sports
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-900 transition-colors">
                  Anime
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-900 transition-colors">
                  Horror
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-900 transition-colors">
                  Fashion
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-900 transition-colors">
                  Gaming
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t pt-8 text-center text-sm text-gray-600">
          <p>© 2025 BLOGIFY SPACE. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
// ...existing code...
