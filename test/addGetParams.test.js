import {assert} from '../node_modules/chai';
import {addGetParams} from '../app/js/common.js'

describe('Function addGetParams', function() {
    describe("Add many string params", function() {
        it('Add 1 param', function() {
            assert.equal('link?param1=val1', addGetParams('link?', {
                param1: 'val1'
            }));
        });
        it('Add 2 params', function() {
            assert.equal('link?param1=value1&param2=value2', addGetParams('link?', {
                param1: 'value1',
                param2: 'value2'
            }));
        });
        
        it('Add 5 params', function() {
            assert.equal('link?param1=value1&param2=value2&param3=value3&param4=value4&param5=value5', addGetParams('link?', {
                param1: 'value1',
                param2: 'value2',
                param3: 'value3',
                param4: 'value4',
                param5: 'value5'
            }));
        });
    });
    describe('Add params of different types', function() {
        it('Numbers', function() {
            assert.equal('link?param1=1&param2=3.14&param3=NaN', addGetParams('link?', {
                param1: 1,
                param2: 3.14,
                param3: NaN
            }));
        });
        it('Undefined', function() {
            assert.equal('link?param1=undefined', addGetParams('link?', {
                param1: undefined
            }));
        });
        it('Null', function() {
            assert.equal('link?param1=null', addGetParams('link?', {
                param1: null
            }));
        });
    });
})