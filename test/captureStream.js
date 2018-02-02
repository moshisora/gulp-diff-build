function captureStream ( stream )
{
    var _stream = stream;
    var _write = stream.write;
    
    var output  = [];
    
    var write = function ()
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
        get : function ( wantString )
        {
            return wantString ? output.join('') : output;
        },
        reset : function ()
        {
            output.length = 0;
        }
    };
};

module.exports = captureStream;