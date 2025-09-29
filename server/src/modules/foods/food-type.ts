export interface IFood {
  title: string;
  image: string;
  unit: number;
  calories: number;
  proteins: number;
  carbs: number;
  fats: number;
  category: 'Meat' | 'Egg' | 'Fruits & Vegetables';
}
