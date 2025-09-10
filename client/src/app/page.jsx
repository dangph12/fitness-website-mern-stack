import React from 'react';
import BannerLayout from '~/layouts/BannerLayout';
import CategoryBannerLayout from '~/layouts/CategoryBannerLayout';
import UserFeedbackLayout from '~/layouts/UserFeedbackLayout';

const Page = () => {
  return (
   <>
    <BannerLayout/>
    <CategoryBannerLayout/>
    <UserFeedbackLayout/>
   </>
  );
};

export default Page;
