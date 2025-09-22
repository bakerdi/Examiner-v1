const createPreview = () => {
  var previewScene = new THREE.Scene()

  const previewCamera = new THREE.OrthographicCamera(-document.scanOptions.width / 2, document.scanOptions.width / 2, document.scanOptions.height / 2, -document.scanOptions.height / 2, 1, 1000)

  const previewRenderer = new THREE.WebGLRenderer({ canvas: previewCanvas })
  previewRenderer.setClearColor(0x000000)

  previewRenderer.setSize(200, 200)
  const previewMesh = plotMesh.clone()

  previewScene.add(previewMesh)

  previewCamera.position.z = 1

  previewRenderer.render(previewScene, previewCamera)

  setTimeout(() => {
    previewCanvas.style.opacity = 1
  }, 500);


  return previewRenderer.domElement.toDataURL('image/jpeg', 0.8)
}



