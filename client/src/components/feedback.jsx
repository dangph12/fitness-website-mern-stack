import React from 'react';
import { FaStar, FaUserAlt } from 'react-icons/fa';

const feedbacks = [
  {
    name: 'John Cena',
    role: 'Gym Owner',
    feedback:
      'I’ve seen massive improvements in my gym’s performance thanks to the expert trainers. Highly recommend!',
    rating: 4.9,
    icon: <FaUserAlt className='text-3xl text-blue-500' />
  },
  {
    name: 'Maria Gomez',
    role: 'Personal Trainer',
    feedback:
      'The trainers are dedicated and professional. My gym members love them!',
    rating: 4.9,
    icon: <FaUserAlt className='text-3xl text-green-500' />
  },
  {
    name: 'David Lee',
    role: 'Gym Manager',
    feedback:
      'Excellent trainers, fantastic customer support. Couldn’t ask for more!',
    rating: 4.9,
    icon: <FaUserAlt className='text-3xl text-red-500' />
  },
  {
    name: 'Marvin McKinney',
    role: 'Fitness Coach',
    feedback:
      'The trainers have transformed my workout routine! I’m more motivated than ever.',
    rating: 4.9,
    icon: <FaUserAlt className='text-3xl text-yellow-500' />
  },
  {
    name: 'Esther Howard',
    role: 'Gym Owner',
    feedback: 'Great results from dedicated trainers! My gym has flourished.',
    rating: 4.9,
    icon: <FaUserAlt className='text-3xl text-purple-500' />
  },
  {
    name: 'Esther Howard',
    role: 'Gym Owner',
    feedback: 'Great results from dedicated trainers! My gym has flourished.',
    rating: 4.9,
    icon: <FaUserAlt className='text-3xl text-purple-500' />
  }
];

function Feedback() {
  return (
    <div className='bg-gray-100 text-gray-900 min-h-screen p-35'>
      <h1 className='text-4xl font-bold text-center mb-10 text-[#3067B6]'>
        What Our Clients Say
      </h1>
      <p className='text-center mb-10 text-lg text-[#3067B6]'>
        Hear from gym owners and fitness enthusiasts who trust our trainers to
        help them reach their fitness goals. Their feedback inspires us to
        continue delivering top-tier services.
      </p>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
        {feedbacks.map((feedback, index) => (
          <div
            key={index}
            className='bg-white p-6 rounded-xl shadow-xl hover:shadow-2xl transition-shadow duration-300 ease-in-out'
          >
            <div className='flex items-center'>
              <div className='w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mr-5 shadow-lg'>
                {feedback.icon}
              </div>
              <div>
                <h3 className='text-xl font-semibold text-[#3067B6]'>
                  {feedback.name}
                </h3>
                <p className='text-sm text-[#3067B6]'>{feedback.role}</p>
              </div>
            </div>
            <p className='mt-4 text-md text-gray-700'>{feedback.feedback}</p>
            <div className='flex items-center mt-4'>
              {[...Array(5)].map((_, idx) => (
                <FaStar
                  key={idx}
                  className={`text-yellow-400 ${idx < Math.floor(feedback.rating) ? 'fill-current' : ''}`}
                />
              ))}
              <span className='ml-2 text-yellow-400'>{feedback.rating}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Feedback;
