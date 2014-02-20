var VFX = (function () {
    var my = {};
    
    return my;
}());

function VisualEffect(specs) {
    this.config = {
        active            : true,
        name              : specs.name,
        oX                : specs.oX,
        oY                : specs.oY,
        width             : specs.width,
        height            : specs.height,
        scaleW            : specs.scaleW,
        _scaleW           : specs.scaleW/2,
        scaleH            : specs.scaleH,
        _scaleH           : specs.scaleH/2,
        maxColIndex       : specs.maxCols - 1,
        maxRowIndex       : specs.maxRows - 1,
        framesTillUpdate  : specs.framesTillUpdate,
        loop              : specs.loop,
        spriteSheet       : SpriteSheetImages.get(specs.spriteSheet)
    };
    
    var vx = this.config;
    
    this.animation = {
        csr    : 0, // current sprite row
        csc    : 0, // current sprite col
        frames : 0 // the number of frames that has passed since last sprite update
    };
    
    var animation = this.animation;
    
    this.nextSprite = function () {
        if (animation.csc === vx.maxColIndex) {
            animation.csc = 0;
            if (animation.csr === vx.maxRowIndex) {
                animation.csr = 0;
            }
            else {
                animation.csr++;
            }
        }
        else {
            animation.csc++;
        }
    };
    
    this.end = function () {
        /* End effect animation by setting active to false. */
        vx.active = false;
    };
    
    this.updatePos = function (x, y) {
        vx.oX = x;
        vx.oY = y;
    };
    
    this.update = function () {
        if (!vx.active) { return; }
        
        if (animation.frames !== vx.framesTillUpdate) {
            animation.frames++;
        }
        else {
            animation.frames = 0;
            
            if (animation.csr === vx.maxRowIndex && animation.csc === vx.maxColIndex) {
                if (!vx.loop) {
                    vx.active = false;
                }
                else {
                    this.nextSprite();
                }
            }
            else {
                this.nextSprite();
            }
            
        }
    };
    
    this.draw = function (ctx, xView, yView) {
        ctx.translate(vx.oX - xView, vx.oY - yView);
        ctx.drawImage(
            vx.spriteSheet,
            animation.csc * vx.width,
            animation.csr * vx.height,
            vx.width, vx.height,
            -vx._scaleW,
            -vx._scaleH,
            vx.scaleW,
            vx.scaleH
        );
        ctx.translate(-(vx.oX - xView), -(vx.oY - yView));
    };
}