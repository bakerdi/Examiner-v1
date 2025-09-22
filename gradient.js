let COLORS = {
  jet: [
    { pct: config.limit_a, color: { r: 0x00, g: 0x00, b: 0xff } },
    { pct: config.limit_b, color: { r: 0x00, g: 0xff, b: 0xff } },
    { pct: config.limit_c, color: { r: 0x00, g: 0xad, b: 0x00 } },
    { pct: config.limit_d, color: { r: 0xff, g: 0xff, b: 0x00 } },
    { pct: config.limit_e, color: { r: 0xff, g: 0x00, b: 0x00 } }
  ]
}

const setGradient = (min, max, average) => {
  if (max - min < config.limit) {
    COLORS = {
      jet: [
        { pct: min, color: { r: 0x00, g: 0xff, b: 0x95 } },
        { pct: (average + min) / 2, color: { r: 0x0d, g: 0xfe, b: 0xb6 } },
        { pct: average, color: { r: 0x00, g: 0xad, b: 0x00 } },
        { pct: (average + max) / 2, color: { r: 0xb5, g: 0xff, b: 0x00 } },
        { pct: max, color: { r: 0x92, g: 0xff, b: 0x00 } }
      ]
    }
  } else {
    COLORS = {
      jet: [
        { pct: min, color: { r: 0x00, g: 0x00, b: 0xff } },
        { pct: (average + min) / 2, color: { r: 0x00, g: 0xff, b: 0xff } },
        { pct: average, color: { r: 0x00, g: 0xad, b: 0x00 } },
        { pct: (average + max) / 2, color: { r: 0xff, g: 0xff, b: 0x00 } },
        { pct: max, color: { r: 0xff, g: 0x00, b: 0x00 } }
      ]
    }
  }
}

const getColor = (pct, color = COLORS.jet) => {
  for (var i = 1; i < color.length - 1; i++) {
    if (pct < color[i].pct) {
      break
    }
  }
  const lower = color[i - 1]
  const upper = color[i]
  const range = upper.pct - lower.pct
  if (range === 0) {
    return new THREE.Color(0, 0.7, 0)
  }
  const rangePct = (pct - lower.pct) / range
  const pctLower = 1 - rangePct
  const pctUpper = rangePct
  // const color = {
  const r = Math.floor(lower.color.r * pctLower + upper.color.r * pctUpper)
  const b = Math.floor(lower.color.b * pctLower + upper.color.b * pctUpper)
  const g = Math.floor(lower.color.g * pctLower + upper.color.g * pctUpper)
  // }
  return new THREE.Color(r, g, b)
}