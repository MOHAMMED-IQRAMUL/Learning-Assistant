import React, { useState } from 'react';
import Image from 'next/image';


const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="bg-gray-800 p-4">
            <div className="container mx-auto flex justify-between items-center">
                <div className="text-white text-lg font-bold">
                    AI Learning Assistant</div>
                <div className="block lg:hidden">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="text-white focus:outline-none"
                    >
                        <svg
                            className="h-6 w-6"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path d="M4 6h16M4 12h16m-7 6h7" />
                        </svg>
                    </button>
                </div>
                <div className={`w-full lg:flex lg:items-center lg:w-auto ${isOpen ? 'block' : 'hidden'}`}>
                    <ul className="lg:flex lg:space-x-4">
                        <li>
                            <a href="#" className="block text-white py-2 px-4 hover:bg-gray-700 rounded">
                                Home
                            </a>
                        </li>
                        <li>
                            <a href="#" className="block text-white py-2 px-4 hover:bg-gray-700 rounded">
                                About
                            </a>
                        </li>
                        <li>
                            <a href="#" className="block text-white py-2 px-4 hover:bg-gray-700 rounded">
                                Services
                            </a>
                        </li>
                        <li>
                            <a href="#" className="block text-white py-2 px-4 hover:bg-gray-700 rounded">
                                Contact
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;