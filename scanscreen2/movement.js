const pauseScanFunc = () => {
  beep(880)
  console.log('new line')
  // window.ReactNativeWebView.postMessage("pause")
  newLineButton.style.display = "flex"
  pauseScan = true
  resumeScan = false
}

let currentPoint = {
  x: null,
  y: null
}

function parallel(startPos) {
  // First run
  beep(440)

  if (currentPoint.x === null) {
    let startPoint = { x: null, y: null }

    if (startPos === 'left') {
      startPoint = {
        x: 0,
        y: document.scanOptions.height - 1

      }
    } else if (startPos === 'right') {
      startPoint = {
        x: document.scanOptions.width - 1,
        y: document.scanOptions.height - 1
      }
    }
    currentPoint = startPoint
  } else {
    // Point change
    if (startPos === 'left') {
      // Sinirdaysa bir sey yapma
      if (currentPoint.x === document.scanOptions.width - 1 && currentPoint.y === 0) return currentPoint
      // Y'yi sifira kadar kucult
      // Y sifir ise X'i arttir, Y'yi resetle
      if (currentPoint.y > 0) {
        currentPoint.y--
        if (currentPoint.y === 0 && dataCount + 1 !== document.scanOptions.width * document.scanOptions.height && document.scanOptions.scanMode === "auto") {
          pauseScanFunc()
        }
      } else if (currentPoint.y === 0) {
        currentPoint.x++
        currentPoint.y = document.scanOptions.height - 1
      }
    } else if (startPos === 'right') {
      // Sinirdaysa bir sey yapma
      if (currentPoint.x === 0 && currentPoint.y === 0) return currentPoint
      // Y'yi sifira kadar kucult
      // Y sifir ise X'i azalt, Y'yi resetle
      if (currentPoint.y > 0) {
        currentPoint.y--
        if (currentPoint.y === 0 && dataCount + 1 !== document.scanOptions.width * document.scanOptions.height && document.scanOptions.scanMode === "auto") {
          pauseScanFunc()
        }
      } else if (currentPoint.y === 0) {
        currentPoint.x--
        currentPoint.y = document.scanOptions.height - 1
      }
    }
  }
}

function zigzag(startPos) {
  beep(440)

  // First run
  if (currentPoint.x === null) {
    let startPoint = { x: null, y: null }

    if (startPos === 'left') {
      startPoint = {
        x: 0,
        y: document.scanOptions.height - 1
      }
    } else if (startPos === 'right') {
      startPoint = {
        x: document.scanOptions.width - 1,
        y: document.scanOptions.height - 1
      }
    }
    currentPoint = startPoint
  } else {
    // Point change
    if (startPos === 'left') {
      // - cift yukari
      // - tek asagi
      const dir = (currentPoint.x % 2 === 0) ? 'up' : 'down'

      // Sinirdaysa bir sey yapma
      if (currentPoint.y === 0 && currentPoint.x === document.scanOptions.width - 1 && dir === 'up') return currentPoint
      if (currentPoint.y === document.scanOptions.height - 1 && currentPoint.x === document.scanOptions.width - 1 && dir === 'down') return currentPoint

      // Yon degisiyorsa X'i arttir
      if ((currentPoint.y === 0 && dir === 'up') || (currentPoint.y === document.scanOptions.height - 1 && dir === 'down')) {
        // Sadece X degisiyor
        currentPoint.x++
      } else {
        // Sadece Y degisiyor
        if (dir === 'up') {
          currentPoint.y--
          if (currentPoint.y === 0 && dataCount + 1 !== document.scanOptions.width * document.scanOptions.height && document.scanOptions.scanMode === "auto") {
            pauseScanFunc()
          }
        } else {
          currentPoint.y++
          if (currentPoint.y === document.scanOptions.height - 1 && dataCount + 1 !== document.scanOptions.width * document.scanOptions.height && document.scanOptions.scanMode === "auto") {
            pauseScanFunc()
          }
        }
      }
    } else if (startPos === 'right') {
      let dir
      // document.scanOptions.width cift ise:
      // - tek yukari
      // - cift asagi
      if (document.scanOptions.width % 2 === 0) {
        dir = (currentPoint.x % 2 === 0) ? 'down' : 'up'
      } else {
        // document.scanOptions.width tek ise:
        // - cift yukari
        // - tek asagi
        dir = (currentPoint.x % 2 === 0) ? 'up' : 'down'
      }

      // Sinirdaysa bir sey yapma
      if (currentPoint.y === 0 && currentPoint.x === 0 && dir === 'up') return currentPoint
      if (currentPoint.y === document.scanOptions.height - 1 && currentPoint.x === 0 && dir === 'down') return currentPoint

      // Yon degisiyorsa X'i arttir
      if ((currentPoint.y === 0 && dir === 'up') || (currentPoint.y === document.scanOptions.height - 1 && dir === 'down')) {
        // Sadece X degisiyor
        currentPoint.x--
      } else {
        // Sadece Y degisiyor
        if (dir === 'up') {
          currentPoint.y--
          if (currentPoint.y === 0 && dataCount + 1 !== document.scanOptions.width * document.scanOptions.height && document.scanOptions.scanMode === "auto") {
            pauseScanFunc()
          }
        } else {
          currentPoint.y++
          if (currentPoint.y === document.scanOptions.height - 1 && dataCount + 1 !== document.scanOptions.width * document.scanOptions.height && document.scanOptions.scanMode === "auto") {
            pauseScanFunc()
          }
        }
      }
    }
  }
}