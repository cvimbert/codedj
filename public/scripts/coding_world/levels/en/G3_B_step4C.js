define(function () {


    var musicLoops = [
        {
            loopName: 'G3_1bass',
            source:   'G3/1 - BASS.mp3'
        },
        {
            loopName: 'G3_1piano',
            source:   'G3/1 - PIANO.mp3'
        },
        {
            loopName: 'G3_1voix',
            source:   'G3/1 - VOIX.mp3'
        },
        {
            loopName: 'G3_2arp',
            source:   'G3/2 - ARP.mp3'
        },
    ]


    var sounds = [
        {
            soundName: 'G3_CLAP',
            soundSource: 'samples/G3/CLAP.mp3'
        },
        {
            soundName: 'G3_HITHAT',
            soundSource: 'samples/G3/HH.mp3'
        },
        {
            soundName: 'G3_KICK',
            soundSource: 'samples/G3/KICK.mp3'
        },
        {
            soundName: 'G3_SNARE',
            soundSource: 'samples/G3/SNARE.mp3'
        }
    ]

    var init = [
        'tempo = 130',
        'var pattern  = new Pattern({loopLimit: 2})',

        'var tune     = new Tune({ loop:true })',
        'tune.add(pattern)',
        'var clap = new Instrument("G3_CLAP")',
        'var hh = new Instrument("G3_HITHAT")',
        'var kick = new Instrument("G3_KICK")',
        'var snare = new Instrument("G3_SNARE")'
    ]

    var portions = [
        {
            solution: [
                '// putting 3 instead of 1 in (i%4 === 3) allows the clap to be played on beats 3, 7, 11, et 15.',
                'for (var i = 1; i < 17; i = i + 2)',
                '{',
                'pattern.addSound(hh, i)',
                'if (i%4 === 3){',
                'pattern.addSound(clap, i)',
                '}',
                '}',
            ],
            base: [
                '// Change a value in (i%4 === 1) to fix the rhythm',
                '// % is a sign that allows finding the REMAINDER of a division',
                '// For example 7 divided by 2 equals 3 and 1 remains, which means 7%2 equals 1.',
                'for (var i = 1; i < 17; i = i + 2)',
                '{',
                'pattern.addSound(hh, i)',
                'if (i%4 === 1){',
                'pattern.addSound(clap, i)',
                '}',
                '}',
            ]
        },
        {
            solution: [
                '// Putting 4 instead of 2 in i = i + 4 allows us to fix the rhythm.',
                'for (var i = 3; i < 17; i = i + 4)',
                '{',
                'pattern.addSound(snare, i)',
                '}',
            ],
            base: [
                '// Change a value in i = i + 2 to fix the rhythm',
                'for (var i = 3; i < 17; i = i + 2)',
                '{',
                'pattern.addSound(snare, i)',
                '}',
            ]
        },
        {
            solution: [
                '// Putting 3 instead of 6 in (i%4 === 3) allows the clap to be played on beats 3, 7, 11, et 15.',
                'for (var i = 1; i < 17; i = i + 2)',
                '{',
                'pattern.addSound(hh, i)',
                'if (i%4 === 3){',
                'pattern.addSound(clap, i)',
                '}',
                '}',
            ],
            base: [
                '// Change a value in (i%4 === 6) to fix the rhythm',
                '// % is a sign that allows finding the REMAINDER of a division',
                '// For example 7 divided by 2 equals 3 and 1 remains, which means 7%2 equals 1.',
                'for (var i = 1; i < 17; i = i + 2)',
                '{',
                'pattern.addSound(hh, i)',
                'if (i%4 === 6){',
                'pattern.addSound(clap, i)',
                '}',
                '}',
            ]
        },
    ]

    var end = [
        'for (var i = 1; i < 17; i+=4)',
        '{',
        'pattern.addSound(kick, i)',
        'if (i === 5){',
        'pattern.addSound(kick, (i-0.5))',
        '} else if ( i === 9) {',
        'pattern.addSound(kick, (i-1.5))',
        '} else if ( i === 13) {',
        'pattern.addSound(kick, (i+3.75))',
        '}',
        '}',
    ]


    return {
        init: init,
        portions: portions,
        end: end,
        isolatePortions: true,
        musicLoops: musicLoops,
        sounds: sounds,
        minimumGoodAnswers: 2
    }


})
