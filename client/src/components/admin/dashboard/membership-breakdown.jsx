import { Crown, Star } from 'lucide-react';
import React from 'react';

import { Progress } from '~/components/ui/progress';

const MembershipBreakdown = ({ stats }) => {
  const totalUpgrades = stats.vipUpgrades + stats.premiumUpgrades;
  const vipPercentage =
    totalUpgrades > 0 ? (stats.vipUpgrades / totalUpgrades) * 100 : 0;
  const premiumPercentage =
    totalUpgrades > 0 ? (stats.premiumUpgrades / totalUpgrades) * 100 : 0;

  const membershipData = [
    {
      type: 'VIP',
      count: stats.vipUpgrades,
      percentage: vipPercentage,
      icon: Crown,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      progressColor: 'bg-yellow-600'
    },
    {
      type: 'Premium',
      count: stats.premiumUpgrades,
      percentage: premiumPercentage,
      icon: Star,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      progressColor: 'bg-purple-600'
    }
  ];

  if (totalUpgrades === 0) {
    return (
      <div className='flex items-center justify-center h-full text-muted-foreground'>
        No membership upgrades yet
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <span className='text-sm font-medium text-muted-foreground'>
          Total Upgrades
        </span>
        <span className='text-2xl font-bold'>{totalUpgrades}</span>
      </div>

      <div className='space-y-4'>
        {membershipData.map(membership => (
          <div key={membership.type} className='space-y-2'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <div className={`p-2 rounded-lg ${membership.bgColor}`}>
                  <membership.icon className={`h-4 w-4 ${membership.color}`} />
                </div>
                <div>
                  <p className='text-sm font-medium'>{membership.type}</p>
                  <p className='text-xs text-muted-foreground'>
                    {membership.count} upgrades
                  </p>
                </div>
              </div>
              <span className='text-sm font-bold'>
                {membership.percentage.toFixed(1)}%
              </span>
            </div>
            <Progress
              value={membership.percentage}
              className='h-2'
              indicatorClassName={membership.progressColor}
            />
          </div>
        ))}
      </div>

      <div className='pt-4 border-t'>
        <div className='grid grid-cols-2 gap-4 text-center'>
          <div>
            <p className='text-2xl font-bold text-yellow-600'>
              {stats.vipUpgrades}
            </p>
            <p className='text-xs text-muted-foreground'>VIP Members</p>
          </div>
          <div>
            <p className='text-2xl font-bold text-purple-600'>
              {stats.premiumUpgrades}
            </p>
            <p className='text-xs text-muted-foreground'>Premium Members</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembershipBreakdown;
