

//alert(JSON.stringify(document.darkMode))



//globals
let total = 0.1
let average = config.limit_c
let min = config.limit_e
let max = 0
let interpolationFactor = 2
let plotGeometryWidthSegments = document.scanOptions.width + (interpolationFactor * (document.scanOptions.width - 1))
let plotGeometryHeightSegments = document.scanOptions.height + (interpolationFactor * (document.scanOptions.height - 1))
let dataCount = 0
let resumeScan = true

let matrix = []
for (let i = 0; i < document.scanOptions.height; i++) {
  matrix[i] = []
  for (let j = 0; j < document.scanOptions.width; j++) {
    matrix[i][j] = undefined
  }
}


const scene = new THREE.Scene()
var aspect = window.innerWidth / window.innerHeight
var frustumSize = 12
const camera = new THREE.OrthographicCamera(frustumSize * aspect / - 2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, -1000, 1000)
const renderer = new THREE.WebGLRenderer()

renderer.setClearColor(document.darkMode ? '#000000' : '#ffffff')
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)
camera.position.z = 1

const plotGeometry = new THREE.PlaneGeometry(document.scanOptions.width - 1, document.scanOptions.height - 1, plotGeometryWidthSegments - 1, plotGeometryHeightSegments - 1)
const plotMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: false, vertexColors: THREE.VertexColors, side: THREE.DoubleSide })

const tempPositions = (plotGeometry.getAttribute('position'))
// console.log(tempPositions)

var positions = new Float32Array(plotGeometryWidthSegments * plotGeometryHeightSegments * 3)
positions = (tempPositions.array)


//-----------Stretch geometry-----
//üst
for (let i = 1; i <= plotGeometryWidthSegments * 3 - 2; i += 3) {
  positions[i] = positions[i] + 0.5
}
//alt
const v = plotGeometryWidthSegments * (plotGeometryHeightSegments - 1) * 3 + 1
const y = (plotGeometryWidthSegments * plotGeometryHeightSegments * 3) - 1
for (let i = v; i <= y; i += 3) {
  positions[i] = positions[i] - 0.5
}
const h = plotGeometryWidthSegments * (plotGeometryHeightSegments - 1) * 3
//left
for (let i = 0; i <= y; i += plotGeometryWidthSegments * 3) {
  positions[i] = positions[i] - 0.5
}
const u = (plotGeometryWidthSegments * 3) - 3
const k = (plotGeometryWidthSegments * plotGeometryHeightSegments * 3) - 3
//right
for (let i = u; i <= k; i += plotGeometryWidthSegments * 3) {
  positions[i] = positions[i] + 0.5
}
//--------------------------------

const plotMesh = new THREE.Mesh(plotGeometry, plotMaterial)
scene.add(plotMesh)



const indicatorMaterial = new THREE.LineBasicMaterial({
  color: 0xff0000,
  linewidth: 6
})
const points = []
points.push(new THREE.Vector3(- 0.5, 0.5, 0))
points.push(new THREE.Vector3(0.5, 0.5, 0))
points.push(new THREE.Vector3(0.5, -0.5, 0))
points.push(new THREE.Vector3(-0.5, -0.5, 0))
const indicatorGeometry = new THREE.BufferGeometry().setFromPoints(points)
const indicatorMesh = new THREE.LineLoop(indicatorGeometry, indicatorMaterial)

// init indicator and camera position based on starting point
if (document.scanOptions.startPoint === 'left') {
  indicatorMesh.position.x = (document.scanOptions.width / -2) + 0.5
  indicatorMesh.position.y = (document.scanOptions.height / -2) + 0.5
  camera.position.x = (document.scanOptions.width / -2) + 0.5
  camera.position.y = (document.scanOptions.height / -2) + 0.5
} else if (document.scanOptions.startPoint === 'right') {
  indicatorMesh.position.x = (document.scanOptions.width / 2) - 0.5
  indicatorMesh.position.y = (document.scanOptions.height / -2) + 0.5
  camera.position.x = (document.scanOptions.width / 2) - 0.5
  camera.position.y = (document.scanOptions.height / -2) + 0.5
}

scene.add(indicatorMesh)



grid(document.scanOptions.width, document.scanOptions.height)

// setInterval(() => {
//   if (resumeScan) {
//     pushNewDataToPlot()
//   }
// }, 1000)


if (true) {
  const isUIWebView = /\(ip.*applewebkit(?!.*(version|crios))/i.test(navigator.userAgent)
  const receiver = isUIWebView ? window : document
  receiver.addEventListener('message', a => {
    const msg = JSON.parse(a.data)
    if (msg.type === 'sensor') {
      const newSensorDataFromBLE = Math.trunc(msg.payload * config.coefficient)
      if (resumeScan) {
        pushNewDataToPlot(newSensorDataFromBLE)


        //stops scan if finish
        if (dataCount === (document.scanOptions.width * document.scanOptions.height)) {
          handleStopButtonClick()
        }
      } else {
        resumeScan = true
        newLineButton.style.display = 'none'
      }
    }
    else if (msg.type === 'compass') {
      compassContainer.style.display = 'block'
      compassIndicator.style.transform = `rotate(${msg.payload}deg)`

      if ((msg.payload > 330 && msg.payload < 390) || (msg.payload > 510 && msg.payload < 570)) {
        compassIndicator.style.stroke = 'lime'
      } else {
        compassIndicator.style.stroke = 'red'

      }
    }




  })
}


//test
if (!document.darkMode) {
  var matrixColors = new Uint8Array(plotGeometryWidthSegments * plotGeometryHeightSegments * 3)

  for (let index = 0; index < matrixColors.length; index++) {
    matrixColors[index] = 255
  }

  plotGeometry.setAttribute('color', new THREE.BufferAttribute(matrixColors, 3, true))

}


//test


const pushNewDataToPlot = (new_sens) => {
  new_sens = new_sens*16; // 4096'lık sisteme göre değerlendiren çarpan
  if (document.scanOptions.scanPattern === 'zigzag') {
    zigzag(document.scanOptions.startPoint)
  }
  else if (document.scanOptions.scanPattern === 'parallel') {
    parallel(document.scanOptions.startPoint)
  }


  const newSensorValue = new_sens
  // const newSensorValue = parseInt(Math.random() * 255)

  updateScanInformation(newSensorValue)
  matrix[currentPoint.y][currentPoint.x] = newSensorValue
  //console.log(matrix)

  const interpolatedData = Interpolate(matrix, interpolationFactor)
  setGradient(min, max, average)

  const flatenedData = interpolatedData.flat()


  var matrixColors = new Uint8Array(plotGeometryWidthSegments * plotGeometryHeightSegments * 3)

  flatenedData.forEach((e, i) => {
    const color = getColor(e)
    if (e > 0) {
      matrixColors[i * 3 + 0] = color.r
      matrixColors[i * 3 + 1] = color.g
      matrixColors[i * 3 + 2] = color.b
    } else {
      matrixColors[i * 3 + 0] = document.darkMode ? 0 : 255
      matrixColors[i * 3 + 1] = document.darkMode ? 0 : 255
      matrixColors[i * 3 + 2] = document.darkMode ? 0 : 255
    }

  })

  plotGeometry.setAttribute('color', new THREE.BufferAttribute(matrixColors, 3, true))
  setHeatmapArrowPosition(newSensorValue, min, max, average)
}

function animate() {
  if (currentPoint.x !== null) {
    camera.position.lerp({ x: currentPoint.x - (document.scanOptions.width - 1) / 2, y: ((currentPoint.y - (document.scanOptions.height - 1) / 2) * -1), z: 5 }, 0.2)
    indicatorMesh.position.lerp({ x: currentPoint.x - (document.scanOptions.width - 1) / 2, y: ((currentPoint.y - (document.scanOptions.height - 1) / 2) * -1), z: 5 }, 0.3)
  }

  requestAnimationFrame(animate)
  renderer.render(scene, camera)
}

animate()

const updateScanInformation = (newValue) => {
  if (newValue > max) {
    max = newValue
  }
  if (newValue < min) {
    min = newValue
  }
  dataCount++
  total += newValue
  average = total / dataCount

  // testMin.innerText = Math.trunc(min)
  // testMax.innerText = Math.trunc(max)
  // testAverage.innerText = Math.trunc(average)



}

const setHeatmapArrowPosition = (value, min, max, average) => {
  if (max - min < config.limit) {
    if (value >= average) {
      let pos = THREE.MathUtils.mapLinear(value, average, max, 0, 50)
      pos = THREE.MathUtils.clamp(pos, 0, 10)
      arrow.style.left = pos + '%'
    } else {
      let pos = THREE.MathUtils.mapLinear(value, min, average, 0, 50)
      pos = THREE.MathUtils.clamp(pos, 0, 10)
      arrow.style.left = -1 * (10 - pos) + '%'
    }
  }
  else {
    if (value >= average) {
      let pos = THREE.MathUtils.mapLinear(value, average, max, 0, 50)
      pos = THREE.MathUtils.clamp(pos, 0, 50)
      arrow.style.left = pos + '%'
    } else {
      let pos = THREE.MathUtils.mapLinear(value, min, average, 0, 50)
      pos = THREE.MathUtils.clamp(pos, 0, 50)
      arrow.style.left = -1 * (50 - pos) + '%'
    }
  }

}

setTimeout(() => {
  setInterval(() => {
    if (resumeScan && document.scanOptions.scanMode === 'auto') {
      const sensorCommand = {
        command: 'sensor'
      }
      window.ReactNativeWebView.postMessage(JSON.stringify(sensorCommand))
    }
    // let randomSensorValue = parseInt(Math.random() * 4095)
    // if (resumeScan)
    //   pushNewDataToPlot(randomSensorValue)

  }, 1300)
}, 2000)

