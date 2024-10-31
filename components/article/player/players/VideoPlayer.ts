export interface VideoPlayer {
  getTime(): number

  goToTime(time: number): void
}
