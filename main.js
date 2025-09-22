const width = data.width
const height = data.height

console.log(data)

var matrix = []
for (var i = 0; i < height; i++) {
  matrix[i] = []
  for (var j = 0; j < width; j++) {
    matrix[i][j] = null
  }
}

console.log(matrix)

const scene = new THREE.Scene()
var aspect = window.innerWidth / window.innerHeight

var frustumSize = 60

const camera = new THREE.OrthographicCamera(frustumSize * aspect / - 2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, -1000, 1000)

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)


camera.position.z = 50

const drawPlot = () => {
  const interpolatedData = Interpolate(matrix, 2)
  setGradient(data.min, data.max, data.average)
  const plotGeometry = new THREE.PlaneGeometry(interpolatedData[0].length, interpolatedData.length, interpolatedData[0].length - 1, interpolatedData.length - 1)

  const flatenedData = interpolatedData.flat()

  var matrixColors = new Uint8Array(interpolatedData[0].length * interpolatedData.length * 3)

  setGradient(148, 255, 210)

  flatenedData.forEach((e, i) => {
    const color = getColor(e)
    matrixColors[i * 3 + 0] = color.r
    matrixColors[i * 3 + 1] = color.g
    matrixColors[i * 3 + 2] = color.b
  })

  plotGeometry.setAttribute('color', new THREE.BufferAttribute(matrixColors, 3, true))

  const tempPositions = (plotGeometry.getAttribute('position'))

  var positions = new Float32Array(interpolatedData[0].length * interpolatedData.length * 3)
  positions = (tempPositions.array)

  for (let i = 0; i < positions.length; i++) {
    if ((i + 1) % 3 === 0) {
      positions[i] = Math.abs(flatenedData[parseInt(i / 3)] - 210) / -5
    }
  }

  const plotMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: false, vertexColors: THREE.VertexColors, side: THREE.DoubleSide })
  const plotMesh = new THREE.Mesh(plotGeometry, plotMaterial)
  // plotMesh.rotation.x = THREE.Math.degToRad(45)
  scene.add(plotMesh)

}

drawPlot()

function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
}

animate()

