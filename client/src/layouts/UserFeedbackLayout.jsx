import React from 'react';
import { FaStar, FaUserAlt } from 'react-icons/fa';

const feedbacks = [
  {
    name: 'John Cena',
    role: 'Gym Owner',
    feedback: "I’ve seen massive improvements in my gym’s performance thanks to the expert trainers. Highly recommend!",
    rating: 4.9,
    icon: <FaUserAlt className="text-4xl text-blue-500" />, // Placeholder icon
  },
  {
    name: 'Maria Gomez',
    role: 'Personal Trainer',
    feedback: "The trainers are dedicated and professional. My gym members love them!",
    rating: 4.9,
    icon: <FaUserAlt className="text-4xl text-green-500" />,
  },
  {
    name: 'David Lee',
    role: 'Gym Manager',
    feedback: "Excellent trainers, fantastic customer support. Couldn’t ask for more!",
    rating: 4.9,
    icon: <FaUserAlt className="text-4xl text-red-500" />,
  },
  {
    name: 'Marvin McKinney',
    role: 'Fitness Coach',
    feedback: "The trainers have transformed my workout routine! I’m more motivated than ever.",
    rating: 4.9,
    icon: <FaUserAlt className="text-4xl text-yellow-500" />,
  },
  {
    name: 'Esther Howard',
    role: 'Gym Owner',
    feedback: "Great results from dedicated trainers! My gym has flourished.",
    rating: 4.9,
    icon: <FaUserAlt className="text-4xl text-purple-500" />,
  },
];

function UserFeedbackLayout() {
  return (
    <div className="bg-black text-white min-h-screen p-10">
      <h1 className="text-4xl font-bold text-center mb-12">What Our Clients Say</h1>
      <p className="text-center mb-8 text-xl">Hear from gym owners and fitness enthusiasts who trust our trainers to help them reach their fitness goals. Their feedback inspires us to continue delivering top-tier services.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {feedbacks.map((feedback, index) => (
          <div key={index} className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center mr-4">
                {feedback.icon}
              </div>
              <div>
                <h3 className="text-xl font-semibold">{feedback.name}</h3>
                <p className="text-sm text-gray-400">{feedback.role}</p>
              </div>
            </div>
            <p className="mt-4 text-lg">{feedback.feedback}</p>
            <div className="flex items-center mt-4">
              {[...Array(5)].map((_, idx) => (
                <FaStar key={idx} className={`text-yellow-400 ${idx < Math.floor(feedback.rating) ? 'fill-current' : ''}`} />
              ))}
              <span className="ml-2 text-yellow-400">{feedback.rating}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserFeedbackLayout;
