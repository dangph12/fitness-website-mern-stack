import React from 'react';

import PlanBanner from '~/components/plan-banner';
import PlanListPublic from '~/components/public-plan-list';

function page() {
  return (
    <div>
      <PlanBanner />
      <PlanListPublic />
    </div>
  );
}

export default page;
