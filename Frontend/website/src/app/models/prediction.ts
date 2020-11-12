export class Prediction {
    label: string;
    percentage: number;

    constructor(label: string, percentage: number){
        this.label = label
        this.percentage = percentage
      }
}
