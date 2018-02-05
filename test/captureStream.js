'use strict';

const messages = {
    changes             : '[diff log] Changes detected.',
    noChanges           : '[diff log] No changes.',
    flushing            : '[diff log] flushing hash...',
    flushingCompleted   : '[diff log] flushing hash completed!',
    flushingAll         : '[diff log] flushing all hashes...',
    flushingAllCompleted: '[diff log] flushing hashes completed!',
    hashNotExisting     : '[diff warning] hash file does not exist.'
};

function captureStream ( stream )
{
    let _stream = stream;
    let _write = stream.write;
    
    let output  = [];
    
    const write = function ()
    {
        output.push([].slice.call(arguments));
    };
    
    return {
        on: function ()
        {
            _stream.write = write;
        },
        off: function (reset)
        {
            _stream.write = _write;
            reset && this.reset();
        },
        get: function ()
        {
            return {
                s   : output.join(''),
                has : function (s) { return this.s.indexOf(s) > -1 }
            };
        },
        reset: function ()
        {
            output.length = 0;
        },
        messages    : messages
    };
};

module.exports = captureStream;