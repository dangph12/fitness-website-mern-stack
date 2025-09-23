import React from 'react';
import { FaFacebookF, FaGithub, FaInstagram, FaTwitter } from 'react-icons/fa';

function Footer() {
  return (
    <footer className='bg-blue-900 text-white px-10 py-12 rounded-xl'>
      <div className='max-w-7xl mx-auto'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8 mb-10'>
          <div>
            <div className='flex items-center space-x-2 mb-4'>
              <span className='font-bold text-4xl'>F-FITNESS</span>
            </div>
            <ul className='space-y-2 text-sm'>
              <li>
                <a href='#'>About</a>
              </li>
              <li>
                <a href='#'>Features</a>
              </li>
              <li>
                <a href='#'>Works</a>
              </li>
              <li>
                <a href='#'>Career</a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className='font-semibold mb-4'>Help</h3>
            <ul className='space-y-2 text-sm'>
              <li>
                <a href='#'>Customer Support</a>
              </li>
              <li>
                <a href='#'>Delivery Details</a>
              </li>
              <li>
                <a href='#'>Terms & Conditions</a>
              </li>
              <li>
                <a href='#'>Privacy Policy</a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className='font-semibold mb-4'>Resources</h3>
            <ul className='space-y-2 text-sm'>
              <li>
                <a href='#'>Free eBooks</a>
              </li>
              <li>
                <a href='#'>Development Tutorial</a>
              </li>
              <li>
                <a href='#'>How to - Blog</a>
              </li>
              <li>
                <a href='#'>YouTube Playlist</a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className='font-semibold mb-4'>Extra Links</h3>
            <ul className='space-y-2 text-sm'>
              <li>
                <a href='#'>Customer Support</a>
              </li>
              <li>
                <a href='#'>Delivery Details</a>
              </li>
              <li>
                <a href='#'>Terms & Conditions</a>
              </li>
              <li>
                <a href='#'>Privacy Policy</a>
              </li>
            </ul>
          </div>
        </div>

        <div className='border-t border-blue-800 pt-6 flex flex-col md:flex-row md:items-center md:justify-between text-sm'>
          <div className='flex space-x-5 mb-4 md:mb-0'>
            <FaTwitter className='hover:text-gray-300 cursor-pointer' />
            <FaFacebookF className='hover:text-gray-300 cursor-pointer' />
            <FaInstagram className='hover:text-gray-300 cursor-pointer' />
            <FaGithub className='hover:text-gray-300 cursor-pointer' />
          </div>

          <div className='flex space-x-6 mb-4 md:mb-0'>
            <a href='#'>Privacy Policy</a>
            <a href='#'>Terms & Conditions</a>
            <a href='#'>Support</a>
          </div>

          <p className='text-gray-300 text-xs'>
            © Copyright 2025, All Rights Reserved by Postcraft
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
