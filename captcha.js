var Canvas = require('canvas');

module.exports = function(params){
    if(typeof params == 'string')
        params = { url: params };
    params.color = params.color || 'rgb(0,100,100)';
    params.background = params.background || 'rgb(255,200,150)';
    params.lineWidth = params.lineWidth || 8;
    params.fontSize = params.fontSize || 80;
    params.codeLength = params.codeLength || 6;
    params.canvasWidth = params.canvasWidth || 250;
    params.canvasHeight = params.canvasHeight || 150;


    return function(req, res, next){
        if(req.path != params.url)
            return next();

        var canvas = new Canvas(params.canvasWidth , params.canvasHeight);
        var ctx = canvas.getContext('2d');
        ctx.antialias = 'gray';
        ctx.fillStyle = params.background;
        ctx.fillRect(0, 0, 250, 150);
        ctx.fillStyle = params.color;
        ctx.lineWidth = params.lineWidth;
        ctx.strokeStyle = params.color;
        ctx.font = params.fontSize+'px sans';

        var text = ('' + Math.random()).substr(3, params.codeLength);

        for (i = 0; i < text.length; i++) {
             ctx.setTransform(Math.random() * 0.5 + 1, Math.random() * 0.4, Math.random() * 0.4, Math.random() * 0.5 + 1, 30 * i + 20, 100);
             ctx.fillText(text.charAt(i), 0, 0);
        }
        canvas.toBuffer(function(err, buf) {
             if(req.session)
                req.session.captcha = text;
             res.type('jpg');
             res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
             res.header('Expires', 'Thu, 1 Jan 1970 00:00:00 GMT');
             res.end(buf);
        });
    };
};
