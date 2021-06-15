import {prettifyDegrees} from 'common.js';

describe('Function prettifyDegrees', function() {
    describe('Integer degrees', function() {
        it('0° == prettifyDegrees(0)', function() {
            assert.equal('0°', prettifyDegrees(0));
        });
        it('5° == prettifyDegrees(5)', function() {
            assert.equal('5°', prettifyDegrees(5));
        });
    });

    describe('Negative degrees', function() {   
        it('-1° == prettifyDegrees(-1)', function() {
            assert.equal('-1°', prettifyDegrees(-1));
        });
        it('0° == prettifyDegrees(-0)', function() {
            assert.equal('0°', prettifyDegrees(-0));
        });
    });

    describe('Float degrees', function() {
        it('13°06\' == prettifyDegrees(13.1)', function() {
            assert.equal('13°06\'', prettifyDegrees(13.1));
        });
        it('13°30\' == prettifyDegrees(13.5)', function() {
            assert.equal('13°30\'', prettifyDegrees(13.5));
        });
        it('13°45\' == prettifyDegrees(13.75)', function() {
            assert.equal('13°45\'', prettifyDegrees(13.75));
        });
    });

    describe('Float negative degrees', function() {
        it('-13°06\' == prettifyDegrees(-13.1)', function() {
            assert.equal('-13°06\'', prettifyDegrees(-13.1));
        });
        it('-13°30\' == prettifyDegrees(-13.5)', function() {
            assert.equal('-13°30\'', prettifyDegrees(-13.5));
        });
        it('-13°45\' == prettifyDegrees(-13.75)', function() {
            assert.equal('-13°45\'', prettifyDegrees(-13.75));
        });
    });
});