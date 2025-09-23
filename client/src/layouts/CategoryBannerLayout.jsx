import React from 'react';
import { Button } from '~/components/ui/button';
import { FaFistRaised, FaHeartbeat, FaRunning, FaDumbbell, FaBicycle, FaUsers, FaSwimmer, FaFire, FaChild, FaSpa } from 'react-icons/fa';

const categories = [
  { name: 'Boxing', trainers: 12, color: 'bg-red-300', icon: <FaFistRaised className="h-8 w-8 text-white" /> },
  { name: 'Yoga', trainers: 13, color: 'bg-green-300', icon: <FaHeartbeat className="h-8 w-8 text-white" /> },
  { name: 'Cardio', trainers: 14, color: 'bg-blue-300', icon: <FaRunning className="h-8 w-8 text-white" /> },
  { name: 'Strength Training', trainers: 15, color: 'bg-yellow-300', icon: <FaDumbbell className="h-8 w-8 text-white" /> },
  { name: 'Pilates', trainers: 8, color: 'bg-purple-300', icon: <FaHeartbeat className="h-8 w-8 text-white" /> },
  { name: 'CrossFit', trainers: 9, color: 'bg-indigo-300', icon: <FaFire className="h-8 w-8 text-white" /> },
  { name: 'Cycling', trainers: 10, color: 'bg-teal-300', icon: <FaBicycle className="h-8 w-8 text-white" /> },
  { name: 'Martial Arts', trainers: 11, color: 'bg-orange-300', icon: <FaUsers className="h-8 w-8 text-white" /> },
  { name: 'Running', trainers: 7, color: 'bg-pink-300', icon: <FaRunning className="h-8 w-8 text-white" /> },
  { name: 'Zumba', trainers: 6, color: 'bg-red-300', icon: <FaChild className="h-8 w-8 text-white" /> },
  { name: 'Stretching', trainers: 15, color: 'bg-green-300', icon: <FaSpa className="h-8 w-8 text-white" /> },
  { name: 'Swimming', trainers: 10, color: 'bg-blue-300', icon: <FaSwimmer className="h-8 w-8 text-white" /> },
];
function CategoryBannerLayout() {
  return (
     <div className="text-white min-h-screen p-30">
          <h1 className="text-4xl font-bold text-center mb-10 text-[#3067B6]">Workout Categories</h1>
          <p className="text-center mb-10 text-xl text-[#3067B6]">Find workouts tailored to your fitness goals. Choose a category and get started today!</p>
          
          <div className="grid grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <div key={index} className={`flex flex-col items-center ${category.color} p-6 rounded-lg`}>
                {category.icon}
                <h2 className="text-2xl font-semibold mt-4">{category.name}</h2>
                <p className="text-xl mt-2">{category.trainers} Trainers</p>
                <Button className="mt-4 px-6 py-2 bg-white text-black rounded-full">
                  Join Now
                </Button>
              </div>
            ))}
          </div>
        </div>
  )
}

export default CategoryBannerLayout
