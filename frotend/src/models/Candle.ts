export default class Candle {
  low!: number

  high!: number

  open!: number

  close!: number

  color!: string

  finalDateTime!: Date

  values!: number[]

  currency!: string

  constructor(candle: any) {
    Object.assign(this, candle);
    this.finalDateTime = new Date(this.finalDateTime);
  }
}
