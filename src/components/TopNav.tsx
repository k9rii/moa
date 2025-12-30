import { User } from 'lucide-react';

interface TopNavProps {
  onHomeClick: () => void;
  onProfileClick: () => void;
}

export function TopNav({ onHomeClick, onProfileClick }: TopNavProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-gray-100 z-50">
      <div className="h-full max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Logo */}
        <button 
          onClick={onHomeClick}
          className="text-2xl tracking-tight hover:opacity-70 transition-opacity"
        >
          MOA
        </button>

        {/* Profile Icon */}
        <button
          onClick={onProfileClick}
          className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-100 to-blue-100 flex items-center justify-center transition-all duration-200 hover:scale-105 hover:shadow-md"
        >
          <User className="w-5 h-5 text-violet-400" />
        </button>
      </div>
    </nav>
  );
}
