import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-white py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-500 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} TaskFlow. All rights reserved.
          </div>
          <div className="flex space-x-6">
            <Link href="#">
              <a className="text-gray-500 hover:text-gray-700 transition-colors">
                Privacy Policy
              </a>
            </Link>
            <Link href="#">
              <a className="text-gray-500 hover:text-gray-700 transition-colors">
                Terms of Service
              </a>
            </Link>
            <Link href="#">
              <a className="text-gray-500 hover:text-gray-700 transition-colors">
                Contact Us
              </a>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
