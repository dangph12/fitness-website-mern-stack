export interface IFood {
  title: string;
  image: string;
  unit: number;
  protein: number;
  fat: number;
  carbonhydrate: number;
  calories: number;
  category: 'Meat' | 'Egg' | 'Fruits & Vegetables';
}
