import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import axiosInstance from '~/lib/axios-instance';

const UserStreak = ({ userId: propUserId, size = 40 }) => {
  const auth = useSelector(state => state.auth);
  const userId =
    propUserId ||
    auth?.userProfile?._id ||
    auth?.user?._id ||
    auth?.userProfile?.id ||
    auth?.user?.id;

  const [streak, setStreak] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const gradientId = useMemo(
    () => `flame_${Math.random().toString(36).slice(2, 9)}`,
    []
  );

  useEffect(() => {
    if (!userId) return;
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(
          `/api/histories/streak/user/${userId}`
        );
        const s = res?.data?.data?.streak ?? 0;
        if (mounted) setStreak(Number(s));
      } catch {
        if (mounted) setStreak(0);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [userId]);

  // Color tiers
  const { gradientColor1, gradientColor2, textColor, isActive, legendary } =
    useMemo(() => {
      if (!streak || streak <= 0)
        return {
          gradientColor1: '#cccccc',
          gradientColor2: '#9e9e9e',
          textColor: '#9e9e9e',
          isActive: false,
          legendary: false
        };

      if (streak <= 7)
        return {
          gradientColor1: '#ff4c0d',
          gradientColor2: '#fc9502',
          textColor: '#ff7b2f',
          isActive: true,
          legendary: false
        };

      if (streak <= 30)
        return {
          gradientColor1: '#ff4c0d',
          gradientColor2: '#fc9502',
          textColor: '#ff442f',
          isActive: true,
          legendary: false
        };

      if (streak <= 60)
        return {
          gradientColor1: '#9C27B0',
          gradientColor2: '#CE93D8',
          textColor: '#9a67ff',
          isActive: true,
          legendary: false
        };

      return {
        gradientColor1: '#ff4c0d',
        gradientColor2: '#fce202',
        textColor: '#ff6bf4',
        isActive: true,
        legendary: true
      };
    }, [streak]);

  const flameStyle = {
    transformOrigin: 'center bottom',
    transition: 'transform 240ms ease, filter 240ms ease',
    transform: isActive ? 'scale(1.05)' : 'scale(1)',
    filter: legendary
      ? 'drop-shadow(0 0 12px rgba(255,140,255,0.35))'
      : 'drop-shadow(0 4px 8px rgba(0,0,0,0.15))',
    animation: legendary ? 'legendGlow 2.5s infinite linear' : undefined
  };

  return (
    <div className='w-full max-w-5xl mx-auto mt-10'>
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 12,
          fontFamily: 'Inter, sans-serif'
        }}
      >
        <style>{`
          @keyframes legendGlow {
            0%,100% { filter: drop-shadow(0 0 10px rgba(255,140,255,0.25)); }
            50% { filter: drop-shadow(0 0 18px rgba(255,140,255,0.55)); }
          }
        `}</style>

        <svg
          xmlns='http://www.w3.org/2000/svg'
          width={size}
          height={size}
          viewBox='-33 0 255 255'
          preserveAspectRatio='xMidYMid'
          style={flameStyle}
        >
          <defs>
            <linearGradient
              id={gradientId}
              gradientUnits='userSpaceOnUse'
              x1='94.141'
              y1='255'
              x2='94.141'
              y2='0.188'
            >
              <stop offset='0' stopColor={gradientColor1} />
              <stop offset='1' stopColor={gradientColor2} />
            </linearGradient>
          </defs>

          <g id='fire'>
            {/* Outer flame */}
            <path
              d='M187.899,164.809 C185.803,214.868 144.574,254.812 94.000,254.812 C42.085,254.812 -0.000,211.312 -0.000,160.812 C-0.000,154.062 -0.121,140.572 10.000,117.812 C16.057,104.191 19.856,95.634 22.000,87.812 C23.178,83.513 25.469,76.683 32.000,87.812 C35.851,94.374 36.000,103.812 36.000,103.812 C36.000,103.812 50.328,92.817 60.000,71.812 C74.179,41.019 62.866,22.612 59.000,9.812 C57.662,5.384 56.822,-2.574 66.000,0.812 C75.352,4.263 100.076,21.570 113.000,39.812 C131.445,65.847 138.000,90.812 138.000,90.812 C138.000,90.812 143.906,83.482 146.000,75.812 C148.365,67.151 148.400,58.573 155.999,67.813 C163.226,76.600 173.959,93.113 180.000,108.812 C190.969,137.321 187.899,164.809 187.899,164.809 Z'
              fill={`url(#${gradientId})`}
              fillRule='evenodd'
            />

            {/* Mid flame */}
            <path
              d='M94.000,254.812 C58.101,254.812 29.000,225.711 29.000,189.812 C29.000,168.151 37.729,155.000 55.896,137.166 C67.528,125.157 78.415,111.722 83.042,102.172 C83.953,100.292 86.026,90.495 94.000,101.966 C98.752,109.130 98.000,115.416 98.000,115.416 C98.000,115.416 109.000,106.523 118.000,91.726 C125.121,80.000 130.000,89.812 130.000,89.812 C130.000,89.812 134.753,127.148 143.643,140.328 C150.166,150.000 159.000,167.390 159.000,189.812 C159.000,225.711 129.898,254.812 94.000,254.812 Z'
              fill={legendary ? '#fce202' : gradientColor2}
              opacity={legendary ? 0.95 : 0.75}
              fillRule='evenodd'
            />

            {/* Inner flame */}
            <path
              d='M95.000,183.812 C104.250,183.812 104.250,200.941 116.000,223.812 C123.824,239.041 112.121,254.812 95.000,254.812 C77.879,254.812 69.000,240.933 69.000,223.812 C69.000,206.692 85.750,183.812 95.000,183.812 Z'
              fill='#fff4a0'
              opacity='0.9'
              fillRule='evenodd'
            />
          </g>
        </svg>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start'
          }}
        >
          <span
            style={{
              fontSize: Math.round(size * 0.8),
              fontWeight: 700,
              color: textColor,
              lineHeight: 1
            }}
          >
            Your streak: {loading ? '…' : (streak ?? 0)}
            {streak === 0 || streak === 1 ? ' day' : ' days'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default UserStreak;
