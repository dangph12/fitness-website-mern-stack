/**
 * Calculate BMI (Body Mass Index)
 * @param {number} weight - Weight in kg
 * @param {number} height - Height in cm
 * @returns {number} BMI value rounded to 1 decimal place
 */
export const calculateBMI = (weight, height) => {
  if (!weight || !height || weight <= 0 || height <= 0) {
    return 0;
  }

  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);
  return parseFloat(bmi.toFixed(1));
};

/**
 * Get BMI classification based on WHO standards
 * @param {number} bmi - BMI value
 * @returns {Object} Classification with category, description, color, and icon
 */
export const getBMIClassification = bmi => {
  if (bmi < 16) {
    return {
      category: 'Severely Underweight',
      description:
        'You may need to gain weight. Consult a healthcare professional.',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      icon: 'FiAlertTriangle'
    };
  } else if (bmi >= 16 && bmi < 18.5) {
    return {
      category: 'Underweight',
      description: 'You might benefit from gaining some weight.',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      icon: 'FiTrendingDown'
    };
  } else if (bmi >= 18.5 && bmi < 25) {
    return {
      category: 'Healthy Weight',
      description: "You're in a healthy weight range. Keep it up!",
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      icon: 'FiCheckCircle'
    };
  } else if (bmi >= 25 && bmi < 30) {
    return {
      category: 'Overweight',
      description: 'You might benefit from losing some weight.',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      icon: 'FiTrendingUp'
    };
  } else if (bmi >= 30 && bmi < 35) {
    return {
      category: 'Obese Class I',
      description: 'Consider a weight management program.',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      icon: 'FiBarChart2'
    };
  } else if (bmi >= 35 && bmi < 40) {
    return {
      category: 'Obese Class II',
      description: 'Consult a healthcare professional for guidance.',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      icon: 'FiAlertTriangle'
    };
  } else {
    return {
      category: 'Obese Class III',
      description: 'Please consult a healthcare professional.',
      color: 'text-red-700',
      bgColor: 'bg-red-100',
      icon: 'FiAlertOctagon'
    };
  }
};

/**
 * Get BMI position on visual scale (0-100)
 * @param {number} bmi - BMI value
 * @returns {number} Position percentage
 */
export const getBMIPosition = bmi => {
  const minBMI = 15;
  const maxBMI = 40;
  const clampedBMI = Math.max(minBMI, Math.min(maxBMI, bmi));
  return ((clampedBMI - minBMI) / (maxBMI - minBMI)) * 100;
};
