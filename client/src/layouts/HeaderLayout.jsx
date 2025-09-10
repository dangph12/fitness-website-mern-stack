import React from 'react';
import logo from '../assets/logo.png';

function HeaderLayout() {
  return (
    <header className="bg-[#F5F2EC] text-[#3067B6] px-6 py-3 flex items-center justify-between rounded-2xl">
      <div className="flex items-center space-x-0.5">
        <img src={logo} alt="Logo" className="w-28 h-28" />
        <span className="font-bold text-2xl mb-2">F-Fitness</span>
      </div>

      <nav className="flex space-x-9 font-bold">
        <div href="#features" className="hover:text-gray-300">Features</div>
        <div href="#solutions" className="hover:text-gray-300">Solutions</div>
        <div href="#resources" className="hover:text-gray-300">Resources</div>
        <div href="#pricing" className="hover:text-gray-300">Pricing</div>
      </nav>

      <button className="bg-yellow-400 text-black px-5 py-2 rounded-full font-medium hover:bg-yellow-500 transition">
        Join Now
      </button>
    </header>
  );
}

export default HeaderLayout;
