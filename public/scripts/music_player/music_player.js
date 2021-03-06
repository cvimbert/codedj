define([
    'toxilibs/event_bus_queued',
    'toxilibs/sound',
    'toxilibs/soundjs_adapter'
], function (globalEventBus, Sound, SoundjsAdapter) {

    var eventBus = globalEventBus('musicPlayer')

    eventBus.on('loop load requested', addLoop)
    eventBus.on('sample created', addSound)
    eventBus.on('play note requested', playNote)
    eventBus.on('play sound requested', playSound)
    eventBus.on('loop stop requested', stopSound)
    eventBus.on('change volume requested', updateVolume)
    eventBus.on('change volume custom', updateCustomVolume)
    eventBus.on('fade sound requested', fade)

    Sound.use(SoundjsAdapter)
    Sound.setFadeDuration(0)



    //var baseUrl = 'https://static.code-dj.com/hourofcode/public/assets/sounds/'
    var baseUrl = './assets/sounds/'

    var loops = {}
    var loopsTimeout = {}

    var samples = {}

    var globalVolume = 1
    var defaultFadeDuration = 300


    function addLoop (params) {
        Sound.setSound(params.loopName, baseUrl + 'loops/' + params.source)
        loops[params.loopName]   = true
        delete samples[params.loopName]
        if (params.callback) {
            Sound.onAllSoundsLoaded(function () {
                params.callback()
            })
        }
    }


    function addSound (params) {
        Sound.setSound(params.soundName, baseUrl + (params.soundSource || params.soundName))
        samples[params.soundName] = true
        delete loops[params.soundName]
    }


    function updateVolume (increase) {
        if (increase) {
            globalVolume += 0.1
            if (globalVolume > 1) {
                globalVolume = 1
            }
        } else {
            globalVolume -= 0.1
            if (globalVolume < 0.1) {
                globalVolume = 0.1
            }
        }
        applyVolume()
    }


    function updateCustomVolume (custom) {
        globalVolume = custom / 100
        applyVolume()
    }


    var isFading = false

    function fade (params) {
        isFading = true

        params.duration   = params.duration || defaultFadeDuration
        var currentVolume = (typeof params.initialVolume !== 'undefined') ? params.initialVolume : globalVolume
        var elapsedTime   = 0

        var timeStep      = 16
        var volumeStep    = globalVolume / (params.duration / timeStep)
        if (params.fadeOut) {
            volumeStep *= -1
        }

        var interval = setInterval(function () {
            currentVolume += volumeStep
            Sound.setVolume(currentVolume)

            elapsedTime += timeStep
            if (elapsedTime >= params.duration) {
                clearInterval(interval)
                if (params.callback) {
                    params.callback()
                }
            }
        }, timeStep)
    }


    function applyVolume () {
        Sound.setVolume(globalVolume)
        eventBus.emit('volume updated', globalVolume)
    }



    function playNote (params) {
        Sound.onAllSoundsLoaded(function () {
            Sound.play(params.note.sample.soundName, {
                durationRatio: params.note.duration,
                start: params.delay || 0,
                volume: params.volume
            })
        })
    }


    function playSound (params) {
        Sound.onAllSoundsLoaded(function () {
            Sound.play(params.name, params)

            if (loops[params.name]) {
                loopsTimeout[params.name] = setTimeout(function () {
                    eventBus.emit('music loop completed', params.name)
                    params.start = 0
                    params.fadeDuration = 0
                    Sound.stop(params.name)
                    playSound(params)
                }, (Sound.duration(params.name) || params.duration) - params.start)
            }
        })
    }


    function stopSound (params) {
        params = params || {}

        if (params.loops) {
            clearLoops()
            for (var name in loops) {
                Sound.stop(name)
            }
        }

        if (params.samples) {
            for (var name in samples) {
                Sound.stop(name)
            }
        }

        if (params.name) {
            if (typeof loopsTimeout[params.name] !== 'undefined') {
                stopLoop(params.name)
            }
            Sound.stop(params.name)
        }

        if (params.stopAll) {
            clearLoops()
            Sound.stop()
        }
    }


    function clearLoops () {
        for (var id in loopsTimeout) {
            stopLoop(id)
        }
    }


    function stopLoop (loopName) {
        clearTimeout(loopsTimeout[loopName])
    }



    return {
        addLoop:  addLoop,
        addSound: addSound
    }

})
