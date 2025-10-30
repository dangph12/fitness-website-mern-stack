import {
  Activity,
  BicepsFlexed,
  Dumbbell,
  Ham,
  TrendingUp,
  Users,
  Utensils
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { UserRegistrationChart } from '~/components/admin/dashboard/user-registration-chart';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import axiosInstance from '~/lib/axios-instance';

const DashboardPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalExercises: 0,
    totalWorkouts: 0,
    totalPlans: 0,
    totalFoods: 0,
    totalMeals: 0,
    totalMuscles: 0,
    totalEquipments: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);

      const [
        usersRes,
        exercisesRes,
        workoutsRes,
        plansRes,
        foodsRes,
        mealsRes,
        musclesRes,
        equipmentsRes
      ] = await Promise.all([
        axiosInstance.get('/api/users', { params: { page: 1, limit: 1 } }),
        axiosInstance.get('/api/exercises', { params: { page: 1, limit: 1 } }),
        axiosInstance.get('/api/workouts', { params: { page: 1, limit: 1 } }),
        axiosInstance.get('/api/plans', { params: { page: 1, limit: 1 } }),
        axiosInstance.get('/api/foods', { params: { page: 1, limit: 1 } }),
        axiosInstance.get('/api/meals', { params: { page: 1, limit: 1 } }),
        axiosInstance.get('/api/muscles', { params: { page: 1, limit: 1 } }),
        axiosInstance.get('/api/equipments', { params: { page: 1, limit: 1 } })
      ]);

      setStats({
        totalUsers: usersRes.data?.data?.totalUsers || 0,
        totalExercises: exercisesRes.data?.data?.totalExercises || 0,
        totalWorkouts: workoutsRes.data?.data?.totalWorkouts || 0,
        totalPlans: plansRes.data?.data?.totalPlans || 0,
        totalFoods: foodsRes.data?.data?.totalCount || 0,
        totalMeals: mealsRes.data?.data?.totalMeals || 0,
        totalMuscles: musclesRes.data?.data?.totalMuscles || 0,
        totalEquipments: equipmentsRes.data?.data?.totalEquipments || 0
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      description: 'Registered users',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      trend: '+12.5%'
    },
    {
      title: 'Exercises',
      value: stats.totalExercises,
      icon: Activity,
      description: 'Exercise library',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      trend: '+8.2%'
    },
    {
      title: 'Workouts',
      value: stats.totalWorkouts,
      icon: Dumbbell,
      description: 'Total workouts',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      trend: '+15.3%'
    },
    {
      title: 'Plans',
      value: stats.totalPlans,
      icon: BicepsFlexed,
      description: 'Workout plans',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      trend: '+5.7%'
    },
    {
      title: 'Foods',
      value: stats.totalFoods,
      icon: Ham,
      description: 'Food database',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      trend: '+20.1%'
    },
    {
      title: 'Meals',
      value: stats.totalMeals,
      icon: Utensils,
      description: 'Meal plans',
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      trend: '+10.9%'
    }
  ];

  const resourceCards = [
    {
      title: 'Muscles',
      value: stats.totalMuscles,
      description: 'Muscle groups tracked',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    },
    {
      title: 'Equipments',
      value: stats.totalEquipments,
      description: 'Equipment types',
      color: 'text-teal-600',
      bgColor: 'bg-teal-50'
    }
  ];

  if (loading) {
    return (
      <div className='space-y-6'>
        <div>
          <h2 className='text-3xl font-bold tracking-tight'>Dashboard</h2>
          <p className='text-muted-foreground'>
            Welcome back, {user?.name || 'Admin'}
          </p>
        </div>
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <div className='h-4 w-24 bg-muted animate-pulse rounded' />
                <div className='h-4 w-4 bg-muted animate-pulse rounded' />
              </CardHeader>
              <CardContent>
                <div className='h-8 w-16 bg-muted animate-pulse rounded mb-2' />
                <div className='h-3 w-32 bg-muted animate-pulse rounded' />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div>
        <h2 className='text-3xl font-bold tracking-tight'>Dashboard</h2>
      </div>

      {/* Main Stats Grid */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {statCards.map((stat, index) => (
          <Card key={index} className='hover:shadow-md transition-shadow'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                {stat.title}
              </CardTitle>
              <div className={`${stat.bgColor} p-2 rounded-md`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {stat.value.toLocaleString()}
              </div>
              <div className='flex items-center justify-between mt-1'>
                <p className='text-xs text-muted-foreground'>
                  {stat.description}
                </p>
                <div className='flex items-center text-xs text-green-600'>
                  <TrendingUp className='h-3 w-3 mr-1' />
                  {stat.trend}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* User Registration Chart */}
      <UserRegistrationChart />

      {/* Secondary Stats */}
      <div className='grid gap-4 md:grid-cols-2'>
        {resourceCards.map((stat, index) => (
          <Card key={index} className='hover:shadow-md transition-shadow'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                {stat.title}
              </CardTitle>
              <div className={`${stat.bgColor} p-2 rounded-md`}>
                <Activity className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {stat.value.toLocaleString()}
              </div>
              <p className='text-xs text-muted-foreground mt-1'>
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Platform Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Platform Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <Users className='h-5 w-5 text-blue-600' />
                <div>
                  <p className='text-sm font-medium'>User Base</p>
                  <p className='text-xs text-muted-foreground'>
                    Active members on platform
                  </p>
                </div>
              </div>
              <span className='text-2xl font-bold text-blue-600'>
                {stats.totalUsers}
              </span>
            </div>

            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <Activity className='h-5 w-5 text-green-600' />
                <div>
                  <p className='text-sm font-medium'>Fitness Content</p>
                  <p className='text-xs text-muted-foreground'>
                    Exercises + Workouts + Plans
                  </p>
                </div>
              </div>
              <span className='text-2xl font-bold text-green-600'>
                {(
                  stats.totalExercises +
                  stats.totalWorkouts +
                  stats.totalPlans
                ).toLocaleString()}
              </span>
            </div>

            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <Utensils className='h-5 w-5 text-red-600' />
                <div>
                  <p className='text-sm font-medium'>Nutrition Content</p>
                  <p className='text-xs text-muted-foreground'>Foods + Meals</p>
                </div>
              </div>
              <span className='text-2xl font-bold text-red-600'>
                {(stats.totalFoods + stats.totalMeals).toLocaleString()}
              </span>
            </div>

            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <Dumbbell className='h-5 w-5 text-purple-600' />
                <div>
                  <p className='text-sm font-medium'>Resources</p>
                  <p className='text-xs text-muted-foreground'>
                    Muscles + Equipments
                  </p>
                </div>
              </div>
              <span className='text-2xl font-bold text-purple-600'>
                {(stats.totalMuscles + stats.totalEquipments).toLocaleString()}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
            <button
              onClick={() => (window.location.href = '/admin/manage-users')}
              className='p-4 border rounded-lg hover:bg-muted transition-colors text-left'
            >
              <Users className='h-5 w-5 mb-2 text-blue-600' />
              <p className='text-sm font-medium'>Manage Users</p>
            </button>
            <button
              onClick={() => (window.location.href = '/admin/manage-exercises')}
              className='p-4 border rounded-lg hover:bg-muted transition-colors text-left'
            >
              <Activity className='h-5 w-5 mb-2 text-green-600' />
              <p className='text-sm font-medium'>Add Exercise</p>
            </button>
            <button
              onClick={() => (window.location.href = '/admin/manage-foods')}
              className='p-4 border rounded-lg hover:bg-muted transition-colors text-left'
            >
              <Ham className='h-5 w-5 mb-2 text-red-600' />
              <p className='text-sm font-medium'>Add Food</p>
            </button>
            <button
              onClick={() => (window.location.href = '/admin/manage-workouts')}
              className='p-4 border rounded-lg hover:bg-muted transition-colors text-left'
            >
              <Dumbbell className='h-5 w-5 mb-2 text-purple-600' />
              <p className='text-sm font-medium'>Create Workout</p>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
