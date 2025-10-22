export interface IFood {
  title: string;
  image: string;
  unit: number;
  protein: number;
  fat: number;
  carbohydrate: number;
  calories: number;
  category: 'Meat' | 'Egg' | 'Fruits & Vegetables';
}
