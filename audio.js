var audioCtx = new (window.AudioContext || window.webkitAudioContext || window.audioContext)

function beep(frequency) {
  var oscillator = audioCtx.createOscillator()
  var gainNode = audioCtx.createGain()

  oscillator.connect(gainNode)
  gainNode.connect(audioCtx.destination)
  gainNode.gain.value = 1
  oscillator.type = 'sine'

  if (frequency) { oscillator.frequency.value = frequency }

  oscillator.start(audioCtx.currentTime)
  oscillator.stop(audioCtx.currentTime + 0.1)
};

