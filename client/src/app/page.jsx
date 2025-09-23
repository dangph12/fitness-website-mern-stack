import React from 'react';

import Banner from '~/components/banner';
import CategoryBanner from '~/components/category-banner';
import Feedback from '~/components/feedback';
import PlanCourses from '~/components/plan-courses';

function Page() {
  return (
    <div>
      <Banner />
      <CategoryBanner />
      <Feedback />
      <PlanCourses />
    </div>
  );
}

export default Page;
