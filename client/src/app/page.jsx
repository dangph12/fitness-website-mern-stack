import React from 'react';
import BannerLayout from '~/layouts/BannerLayout';
import CategoryBannerLayout from '~/layouts/CategoryBannerLayout';
import PlanCoursesLayout from '~/layouts/PlanCoursesLayout';
import UserFeedbackLayout from '~/layouts/UserFeedbackLayout';

const Page = () => {
  return (
   <>
    <BannerLayout/>
    <CategoryBannerLayout/>
    <UserFeedbackLayout/>
    <PlanCoursesLayout/>
   </>
  );
};

export default Page;
