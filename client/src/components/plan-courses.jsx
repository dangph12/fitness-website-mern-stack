import { motion } from 'framer-motion';
import React from 'react';

import { Button } from '~/components/ui/button';

const plans = [
  {
    title: 'Free Plan',
    price: '$0 per month',
    color: '#57A5E7',
    buttonColor: '#2F4A7E',
    buttonHoverColor: '#1A3552',
    features: [
      'No credit card required',
      'Manage up to 10 members',
      'Access basic gym analytics',
      'Limited trainer scheduling tools',
      'Free support',
      'Track gym revenue'
    ],
    buttonText: 'Get Started',
    buttonLink: '/'
  },
  {
    title: 'Pro Plan',
    price: '$49 per month',
    color: '#4CAF50',
    buttonColor: '#4CAF50',
    buttonHoverColor: '#388E3C',
    features: [
      'Manage up to 100 members',
      'Advanced gym analytics',
      'Unlimited trainer scheduling tools',
      'Custom member insights',
      'Priority support',
      'Integrated marketing tools'
    ],
    buttonText: 'Get Started',
    buttonLink: '/'
  },
  {
    title: 'Enterprise Plan',
    price: '***',
    color: '#FF9800',
    buttonColor: '#FF9800',
    buttonHoverColor: '#FB8C00',
    features: [
      'Unlimited members',
      'Personalized dashboard',
      'Custom reporting and analytics',
      'Dedicated account manager',
      '24/7 priority support',
      'API integrations and more'
    ],
    buttonText: "Let's Talk",
    buttonLink: '/'
  }
];

const PlanCourses = () => {
  return (
    <div className='bg-white text-gray-800 min-h-screen py-16'>
      <div className='text-center mb-12'>
        <h1 className='text-5xl font-extrabold text-[#2F4A7E] mb-4'>
          Easy For Your Bank Account
        </h1>
        <p className='text-xl text-gray-600 max-w-xl mx-auto'>
          Our flexible pricing options ensure you have access to the features
          you need, without breaking the bank. Choose the right plan for your
          business today!
        </p>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-6 lg:px-24'>
        {plans.map((plan, index) => (
          <motion.div
            key={index}
            className='bg-white p-8 rounded-xl shadow-lg w-full transform transition-all hover:scale-105 hover:shadow-2xl'
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, amount: 0.2 }}
          >
            <h2 className='text-3xl font-semibold text-[#2F4A7E] mb-6'>
              {plan.title}
            </h2>
            <p
              className='text-2xl font-bold'
              style={{ color: plan.color }}
              mb-6
            >
              {plan.price}
            </p>
            <ul className='text-lg space-y-4 text-gray-600 mb-6'>
              {plan.features.map((feature, featureIndex) => (
                <li key={featureIndex}>{feature}</li>
              ))}
            </ul>
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <Button
                to={plan.buttonLink}
                style={{ backgroundColor: plan.buttonColor }}
                className='text-white py-3 px-8 rounded-full text-center w-full transition-transform duration-300'
                onMouseEnter={e =>
                  (e.currentTarget.style.backgroundColor =
                    plan.buttonHoverColor)
                }
                onMouseLeave={e =>
                  (e.currentTarget.style.backgroundColor = plan.buttonColor)
                }
              >
                {plan.buttonText}
              </Button>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PlanCourses;
