export interface IBodyClassification {
  title: string;
  weightFactor: {
    min: number;
    max: number;
  };
  description: string;
}
