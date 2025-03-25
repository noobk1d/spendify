import { Button } from "./ui/Button";
import { Link } from "react-router-dom";
function Header() {
  return (
    <header className="container mx-auto py-6 px-4 flex justify-between items-center">
      <div className="flex items-center">
        <img
          src="/Spendify-removebg-preview.png"
          alt="Spendify Logo"
          className="h-12 w-auto"
        />
      </div>
      <div className="flex items-center gap-4">
        <nav className="hidden md:flex gap-6">
          <a
            href="#features"
            className="text-sm font-medium hover:text-blue-500 transition-colors">
            Features
          </a>
          <a
            href="#how-it-works"
            className="text-sm font-medium hover:text-blue-500 transition-colors">
            How It Works
          </a>
          <a
            href="#testimonials"
            className="text-sm font-medium hover:text-blue-500 transition-colors">
            Testimonials
          </a>
        </nav>
        <Link to="/signin">
          <Button variant="outline" className="hidden md:inline-flex">
            Log in
          </Button>
        </Link>
        <Link to="/signup">
          <Button>Sign up</Button>
        </Link>
      </div>
    </header>
  );
}

export default Header;
