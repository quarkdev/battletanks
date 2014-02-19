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
    
    this.animation = {
        csr    : 0, // current sprite row
        csc    : 0, // current sprite col
        frames : 0 // the number of frames that has passed since last sprite update
    };
    
    this.nextSprite = function () {
        if (this.animation.csc === this.config.maxColIndex) {
            this.animation.csc = 0;
            if (this.animation.csr === this.config.maxRowIndex) {
                this.animation.csr = 0;
            }
            else {
                this.animation.csr++;
            }
        }
        else {
            this.animation.csc++;
        }
    };
    
    this.end = function () {
        /* End effect animation by setting active to false. */
        this.config.active = false;
    };
    
    this.updatePos = function (x, y) {
        this.config.oX = x;
        this.config.oY = y;
    };
    
    this.update = function () {
        if (!this.config.active) { return; }
        
        if (this.animation.frames !== this.config.framesTillUpdate) {
            this.animation.frames++;
        }
        else {
            this.animation.frames = 0;
            
            if (this.animation.csr === this.config.maxRowIndex && this.animation.csc === this.config.maxColIndex) {
                if (!this.config.loop) {
                    this.config.active = false;
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
    
    this.draw = function (ctx) {
        ctx.translate(this.config.oX, this.config.oY);
        ctx.drawImage(
            this.config.spriteSheet,
            this.animation.csc * this.config.width,
            this.animation.csr * this.config.height,
            this.config.width, this.config.height,
            -this.config._scaleW,
            -this.config._scaleH,
            this.config.scaleW,
            this.config.scaleH
        );
        ctx.translate(-this.config.oX, -this.config.oY);
    };
}