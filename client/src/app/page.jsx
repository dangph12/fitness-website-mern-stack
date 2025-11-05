import React, { useLayoutEffect } from 'react';

import Banner from '~/components/banner';
import CategoryBanner from '~/components/category-banner';
import Features from '~/components/features';
import Feedback from '~/components/feedback';
import IntroIcon from '~/components/intro-icon';
import IntroSection from '~/components/intro-section';
import PlanCourses from '~/components/plan-courses';

function Page() {
  useLayoutEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'instant'
    });
  }, []);

  return (
    <div>
      <Banner />
      <Features />
      <IntroSection />
      <IntroIcon />
      <PlanCourses />
      <CategoryBanner />
      <Feedback />
    </div>
  );
}

export default Page;
