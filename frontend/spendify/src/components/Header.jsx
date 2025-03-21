import { Button } from "./ui/Button"

function Header() {
  return (
    <header className="container mx-auto py-6 px-4 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-full bg-blue-500"></div>
        <span className="font-bold text-xl text-black">IncomeTracker</span>
      </div>
      <div className="flex items-center gap-4">
        <nav className="hidden md:flex gap-6">
          <a href="#features" className="text-sm font-medium hover:text-blue-500 transition-colors">
            Features
          </a>
          <a href="#how-it-works" className="text-sm font-medium hover:text-blue-500 transition-colors">
            How It Works
          </a>
          <a href="#testimonials" className="text-sm font-medium hover:text-blue-500 transition-colors">
            Testimonials
          </a>
        </nav>
        <Button variant="outline" className="hidden md:inline-flex">
          Log in
        </Button>
        <Button>Sign up</Button>
      </div>
    </header>
  )
}

export default Header

