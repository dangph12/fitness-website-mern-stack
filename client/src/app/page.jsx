import React from 'react';
import banner from '../assets/banner-1.png';
import { Button } from '~/components/ui/button';

const Page = () => {
  return (
    <div className="relative text-center p-19">
      <img src={banner} alt="Healthy Lifestyle" className="w-full h-auto" />
      <Button 
        className="absolute top-7/9 left-7/9 transform -translate-x-10/50 -translate-y-/50 py-8 px-8 bg-[#F5F2EC] text-[#3067B6] rounded-2xl cursor-pointer text-xl font-bold"
      >
        Join Now
      </Button>
    </div>
  );
};

export default Page;
