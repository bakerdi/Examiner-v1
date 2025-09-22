const arrow = document.getElementById('arrow')
const popupOverlay = document.getElementById('popup-overlay')
const newLineButton = document.getElementById('new-line-button')
const compass = document.getElementById('compass')
const previewCanvas = document.getElementById('overview-canvas')
const newDataButton = document.getElementById('new-data-button')
const compassIndicator = document.getElementById('compass-indicator')
const compassContainer = document.getElementById('compass-container')


/* if (document.scanOptions.scanMode === 'manual') {
  newDataButton.style.display = 'flex'
} */

// const testMin = document.getElementById('test-min')
// const testMax = document.getElementById('test-max')
// const testAverage = document.getElementById('test-average')

let preview

const handleStopButtonClick = () => {
  resumeScan = false
  popupOverlay.style.display = 'flex'
  //console.log('PAUSE')
  preview = createPreview()
}

const handlePopupCloseButtonClick = () => {
  previewCanvas.style.opacity = 0
  popupOverlay.style.display = 'none'
  resumeScan = true
}

const handleNewLineButtonPress = () => {
  resumeScan = true
  newLineButton.style.display = 'none'
}

const handleNewDataButtonPress = () => {
  // alert('new data')
  const obj = {
    command: 'sensor',
  }
  window.ReactNativeWebView.postMessage(JSON.stringify(obj))
}

const handleExitButtonPress = () => {
  const obj = {
    command: 'exit',
  }
  window.ReactNativeWebView.postMessage(JSON.stringify(obj))
}
/* const handleExitButtonPress = () => {
  window.ReactNativeWebView.postMessage('exit');
} */
const handleSaveButtonClick = () => {
  //console.log('save')
  //console.log(matrix)
  //console.log(preview)
  const obj = {
    command: 'save',
    resolution: document.scanOptions.resolution,
    matrix: matrix,
    min: min,
    max: max,
    average: average,
    preview: preview,
    width: document.scanOptions.width,
    height: document.scanOptions.height
  }
  window.ReactNativeWebView.postMessage(JSON.stringify(obj))
}