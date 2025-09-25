import React from 'react';

import Banner from '~/components/banner';
import CategoryBanner from '~/components/category-banner';
import Features from '~/components/features';
import Feedback from '~/components/feedback';
import IntroIcon from '~/components/intro-icon';
import IntroSection from '~/components/intro-section';
import PlanCourses from '~/components/plan-courses';

function Page() {
  return (
    <div>
      <Banner />
      <Features />
      <IntroSection />
      <IntroIcon />
      <CategoryBanner />
      <Feedback />
      <PlanCourses />
    </div>
  );
}

export default Page;
