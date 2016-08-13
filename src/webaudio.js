import { EventEmitter } from 'events'
import { readArrayBuffer, autobind } from './utils'

export default class WebAudio extends EventEmitter {
  constructor(file) {
    super()
    this.blob = file
    this.audioContext = new AudioContext()
    this.offlineContext = new OfflineAudioContext(1, 2, this.audioContext.sampleRate)
  }

  async init() {
    const arrayBuffer = await readArrayBuffer(this.blob)
    const audioBuffer = await this._decodeAudioData(arrayBuffer)
    const channelData = await this._getDefaultChannelData(audioBuffer)

    this.arrayBuffer = arrayBuffer
    this.audioBuffer = audioBuffer
    this.channelData = channelData

    this._initAudioComponent()
    return this
  }

  _initAudioComponent() {
    const { audioContext, audioBuffer } = this
    const gainNode = audioContext.createGain()
    gainNode.connect(audioContext.destination)

    const scriptNode = audioContext.createScriptProcessor(16384)
    scriptNode.onaudioprocess = this._onprocess

    this.gainNode = gainNode
    this.scriptNode = scriptNode
  }

  get currentPosition() {
    if (this._startTime == null) {
      return this.startPosition || 0
    }
    if (!this._playing) {
      return this._pausedPosition
    }
    return this.runtime - this._startTime + this._startPosition
  }

  get runtime() {
    return this.audioContext.currentTime
  }

  get duration() {
    return this.audioBuffer.duration
  }

  _beforePlay() {
    const { audioContext, audioBuffer, gainNode, scriptNode } = this
    if (this._playing) {
      this.pause()
    }

    scriptNode.connect(audioContext.destination)

    const source = audioContext.createBufferSource()
    source.buffer = audioBuffer
    source.connect(gainNode)
    source.onended = this._onended

    this.source = source
    this._playing = true
  }

  _afterPlay() {
    this.source.disconnect()
    this.scriptNode.disconnect()
    this._playing = false
  }

  @autobind
  _onended() {
    this._end(true)
  }

  @autobind
  _onprocess() {
    const currentPosition = this.currentPosition
    this.emit('process', currentPosition)

    if (currentPosition > this.endPosition) {
      this._end(false)
    }
  }

  _end(EOF) {
    this.pause()
    this.emit('end', EOF)

    if (this.repeat) {
      this._replay()
    }
  }

  _replay() {
    this.play(this.startPosition || 0)
  }

  play(start = this.currentPosition) {
    this._beforePlay()

    const source = this.source
    this._startTime = this.runtime
    this._startPosition = start

    source.start(0, start, this.duration)
  }

  pause() {
    const source = this.source
    this.source.stop()
    this._pausedPosition = this.currentPosition

    this._afterPlay()
  }

  /**
  * @param {ArrayBuffer} arrayBuffer
  * @return {Promise<AudioBuffer>}
  * @private
  */
  _decodeAudioData(arrayBuffer) {
    return this.offlineContext.decodeAudioData(arrayBuffer)
  }

  /**
  * @param {AudioBuffer} audioBuffer
  * @return {Float32Array}
  * @private
  */
  _getDefaultChannelData(audioBuffer) {
    this.audioBuffer = audioBuffer
    return audioBuffer.getChannelData(0)
  }

}
