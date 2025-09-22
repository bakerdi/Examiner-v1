// document.scanOptions = {
//   width: 5,
//   height: 5,
//   startPoint: 'right',
//   scanMode: 'manual',
//   resolution: 12,
//   scanPattern: 'zigzag'
// }
// document.darkMode = true

//dont forget to comment above

const resolution = document.scanOptions.resolution
const highest_value = Math.pow(2, resolution)
const coefficient = 1 / Math.pow(2, 12 - resolution)

const config = {
  limit_a: 0,
  limit_b: highest_value / 4,
  limit_c: highest_value / 2,
  limit_d: highest_value / 4 * 3,
  limit_e: highest_value - 1,
  coefficient: coefficient,
  limit: 96 * coefficient
}

console.log(config)