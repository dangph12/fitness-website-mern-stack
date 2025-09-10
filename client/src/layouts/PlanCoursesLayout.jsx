import React from 'react';
import { Button } from '~/components/ui/button';

const PlanCoursesLayout = () => {
  return (
    <div className="bg-white text-gray-800 min-h-screen py-16">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-extrabold text-[#2F4A7E] mb-4">Easy For Your Bank Account</h1>
        <p className="text-xl text-gray-600 max-w-xl mx-auto">Our flexible pricing options ensure you have access to the features you need, without breaking the bank. Choose the right plan for your business today!</p>
      </div>

      <div className="flex justify-center gap-12 px-6 lg:px-24">
        <div className="bg-white p-8 rounded-xl shadow-lg w-80 transform transition-all hover:scale-105 hover:shadow-2xl">
          <h2 className="text-3xl font-semibold text-[#2F4A7E] mb-6">Free Plan</h2>
          <p className="text-2xl font-bold text-[#57A5E7] mb-6">$0 per month</p>
          <ul className="text-lg space-y-4 text-gray-600 mb-6">
            <li>No credit card required</li>
            <li>Manage up to 10 members</li>
            <li>Access basic gym analytics</li>
            <li>Limited trainer scheduling tools</li>
            <li>Free support</li>
            <li>Track gym revenue</li>
          </ul>
          <Button href="#" className="bg-[#2F4A7E] text-white py-3 px-8 rounded-full text-center w-full transition-transform duration-300 hover:bg-[#1A3552]">Get Started</Button>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-lg w-80 transform transition-all hover:scale-105 hover:shadow-2xl">
          <h2 className="text-3xl font-semibold text-[#2F4A7E] mb-6">Pro Plan</h2>
          <p className="text-2xl font-bold text-[#4CAF50] mb-6">$49 per month</p>
          <ul className="text-lg space-y-4 text-gray-600 mb-6">
            <li>Manage up to 100 members</li>
            <li>Advanced gym analytics</li>
            <li>Unlimited trainer scheduling tools</li>
            <li>Custom member insights</li>
            <li>Priority support</li>
            <li>Integrated marketing tools</li>
          </ul>
          <Button href="#" className="bg-[#4CAF50] text-white py-3 px-8 rounded-full text-center w-full transition-transform duration-300 hover:bg-[#388E3C]">Get Started</Button>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-lg w-80 transform transition-all hover:scale-105 hover:shadow-2xl">
          <h2 className="text-3xl font-semibold text-[#2F4A7E] mb-6">Enterprise Plan</h2>
          <p className="text-2xl font-bold text-[#FF9800] mb-6">***</p>
          <ul className="text-lg space-y-4 text-gray-600 mb-6">
            <li>Unlimited members</li>
            <li>Personalized dashboard</li>
            <li>Custom reporting and analytics</li>
            <li>Dedicated account manager</li>
            <li>24/7 priority support</li>
            <li>API integrations and more</li>
          </ul>
          <Button href="#" className="bg-[#FF9800] text-white py-3 px-8 rounded-full text-center w-full transition-transform duration-300 hover:bg-[#FB8C00]">Let's Talk</Button>
        </div>
      </div>
    </div>
  );
};

export default PlanCoursesLayout;
