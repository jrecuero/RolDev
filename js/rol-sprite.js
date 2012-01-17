/**
 * @fileOverview    <b>rol-sprite.js</b> file with all geometry figures and
 *                  sprites to be used in the game.
 * @author <a href="mailto:jose.recuero@gmail.com">Jose Carlos Recuero</a>
 * @version 1.0.0
 */

/*
 * @requires $
 */
/*globals $ */

/*
 * @requires jcRap
 */
/*globals jcRap */

/*
 * @requires ROL
 */
/*globals ROL */


/**
 * Basic figure class.
 * @class Abstract Figure
 * @property {ROL.Point} origin Figure origin
 * @property {int} cell_size Cell size
 * @constructor
 * @param   {int} x figure origin x coordinate
 * @param   {int} y figure origin y coordinate
 * @param   {int} cell_size cell size
 * @return  this.
 */
ROL.Figure = function(x, y, cell_size) {
    this.origin    = new ROL.Point(x, y);
    this.cell_size = cell_size;
    return this;
};

/**
 * Move figure to a new position
 * @public
 * @function
 * @param   { int } x new x coordinate
 * @param   { int } y new y coordinate
 * @param   { boolean } relative
 *          if true, x and y are relative coordinates to the anchor.
 *          if false, x and y are absolute coordinates.
 * @return  this
 */
ROL.Figure.prototype.moveTo = function(x, y, relative) {
    x = x === null ? (relative ? 0 : this.origin.x) : x;
    y = y === null ? (relative ? 0 : this.origin.y) : y;

    this.origin.x = relative ? this.origin.x + x : x;
    this.origin.y = relative ? this.origin.y + y : y;
    return this;
};


/**
 * Circle figure.
 * @class Circle
 * @augments ROL.Figure
 * @property {int} ration Circle ratio
 * @constructor
 * @param   {int} x circle center x coordinate
 * @param   {int} y circle center y coordinate         
 * @param   {int} r circle ratio
 * @param   {int} cell_size cell size
 * @return  this.
 */
ROL.Circle = function(x, y, r, cell_size) {
    ROL.Circle._base_constructor.call(this, x, y, cell_size);
    this.ratio = r;
    return this;
};

// Circle extends ROL.Figure.
jcRap.Framework.extend(ROL.Circle, ROL.Figure);

/**
 * Draw a cicle
 * @public
 * @function
 * @param   {Context} ctx canvas 2d context
 * @return  none.
 */
ROL.Circle.prototype.draw = function(ctx) {
    var x = this.cell_size ? (this.origin.x * this.cell_size) + (this.cell_size / 2) : this.origin.x,
        y = this.cell_size ? (this.origin.y * this.cell_size) + (this.cell_size / 2) : this.origin.y;
    ctx.arc(x, y, this.ratio, 0, Math.PI * 2, false);
};

/**
 * Checks if a point given by x & y coordinate is inside the circle.
 * @public
 * @function
 * @param   {int} x coordinate x.
 * @param   {int} y coordinate y.
 * @return  <b>true</b> if coordinate is inside the circle. 
 *          <p><b>false</b> if not.          
 */
ROL.Circle.prototype.isInside = function(x, y) {
    var x_distance = Math.pow(x - this.origin.x, 2),
        y_distance = Math.pow(y - this.origin.y, 2);
    return ((x_distance + y_distance) < Math.pow(this.ratio, 2));
};


/**
 * Rectangle figure.
 * @class Rectangle
 * @augment ROL.Figure
 * @property {int} width Rectangle width
 * @property {int} height Rectangle height
 * @constructor
 * @param   {int} x rectangle left top corner x coordinate
 * @param   {int} y rectangle left top corner y coordinate         
 * @param   {int} w rectangle width
 * @param   {int} h rectangle height
 * @param   {int} cell_size cell size
 * @return  this.
 */
ROL.Rectangle = function(x, y, w, h, cell_size) {
    ROL.Rectangle._base_constructor.call(this, x, y, cell_size);
    this.width  = w;
    this.height = h;
    return this;
};

// Rectangle extends ROL.Figure
jcRap.Framework.extend(ROL.Rectangle, ROL.Figure);

/**
 * Draws a rectangle
 * @public
 * @function
 * @param   {Context} ctx canvas 2d context
 * @return  none.
 */
ROL.Rectangle.prototype.draw = function(ctx) {
    var x = this.cell_size ? (this.origin.x * this.cell_size) : this.origin.x,
        y = this.cell_size ? (this.origin.y * this.cell_size) : this.origin.y,
        w = this.width,
        h = this.height;
    ctx.fillRect(x, y, w, h);
    ctx.strokeRect(x, y, w, h);
};

/**
 * Checks if a point given by x & y coordinate is inside the rectangle.
 * @public
 * @function
 * @param   {int} x
 *          x coordinate.
 * @param   {int} y
 *          y coordinate.
 * @return  true if coordinate is inside the rectangle. false if not.          
 */
ROL.Rectangle.prototype.isInside = function(x, y) {
    if ((x >= this.origin.x) && (x <= (this.origin.x + this.width))) {
        if ((y >= this.origin.y) && ( y <= (this.origin.y + this.height))) {
            return true;
        }
    }
    return false;
};


/**
 * Pacman figure.
 * @class Pacman
 * @augments Circle
 * @property {Array} draw_values Array used to draw the figure
 * @constructor
 * @param   {int} x pacman center x coordinate
 * @param   {int} y pacman center y coordinate         
 * @param   {int} r pacman ratio
 * @param   {int} cell_size cell size
 * @return  this.
 */    
ROL.Pacman = function(x, y, r, cell_size) {
    ROL.Pacman._base_constructor.call(this, x, y, r, cell_size);
    this.draw_values = {
        up:    [[1.75, 0.75], [0.25, 1.25]],
        down:  [[0.75, 1.75], [1.25, 0.25]],
        left:  [[1.75, 0.75], [1.25, 0.25]],
        right: [[0.25, 1.25], [0.75, 1.75]]
    };
    return this;
};

// Pacman extends ROL.Circle
jcRap.Framework.extend(ROL.Pacman, ROL.Circle);

/**
 * Draws a pacman
 * @public
 * @function
 * @param   {Context} ctx canvas 2d context
 * @param   {ROL.Facing} facing Figure facing direction
 * @return  none.
 */    
ROL.Pacman.prototype.draw = function(ctx, facing) {
    var x = this.cell_size ? (this.origin.x * this.cell_size) + (this.cell_size / 2) : this.origin.x,
        y = this.cell_size ? (this.origin.y * this.cell_size) + (this.cell_size / 2) : this.origin.y,
        values = [];

    switch(facing) {
        case ROL.Facing.UP:
            values.push(this.draw_values.up[0], this.draw_values.up[1]);
            break;
        case ROL.Facing.DOWN:
            values.push(this.draw_values.down[0], this.draw_values.down[1]);
            break;
        case ROL.Facing.LEFT:
            values.push(this.draw_values.left[0], this.draw_values.left[1]);
            break;
        case ROL.Facing.RIGHT:
            values.push(this.draw_values.right[0], this.draw_values.right[1]);
            break; 
        default:
            values.push(this.draw_values.right[0], this.draw_values.right[1]);
            break;
    }

    ctx.arc(x, y, this.ratio, Math.PI * values[0][0], Math.PI * values[0][1], false);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x, y, this.ratio, Math.PI * values[1][0], Math.PI * values[1][1], false);
};


/**
 * Sprite.
 * @class Sprite
 * @property {Object} image Sprite image
 * @property {Object} stroke Sprite stroke color
 * @property {Object} fill Sprite fill color
 * @property {ROL.Facing} facing Sprite facing direction
 * @constructor
 * @param   {Object} image  Image to be used as the sprite.
 * @param   {int} x         Image x position.
 * @param   {int} y         Image y position.
 * @return  this
 */
ROL.Sprite = function(image, x, y) {
    this.image  = image;
    if (image instanceof ROL.Figure) {
        this.stroke = "black";
        this.fill   = "white";
        this.origin = image.origin;
    } else if ((x !== undefined) && (y !== undefined)) {
        this.origin = new ROL.Point(x, y);
    } else {
        this.origin = new ROL.Point(0, 0);
    }
    this.facing = ROL.Facing.NONE;
    return this;
};

/**
 * Gets sprite image origin.
 * @public
 * @function
 * @return {ROL.Point} image origin
 */
ROL.Sprite.prototype.getOrigin = function() {
    return this.origin;
};

/**
 * Sets sprite image origin to a new value.
 * @public
 * @function
 * @param   {int} x new origin x coordinate
 * @param   {int} y new origin y coordinate
 * @return  none
 */
ROL.Sprite.prototype.setOrigin = function(x, y) {
    this.origin.x = x;
    this.origin.y = y;
    this.image.origin.x = x;
    this.image.origin.y = y;
};

/**
 * Moves one time frame.
 * @public
 * @function
 * @return  none.
 */
ROL.Sprite.prototype.moveFrame = function() {
    if (this.image && (typeof this.image.moveFrame === 'function')) {
        this.image.moveFrame();
    }
};

/**
 * Draws a sprite
 * @public
 * @function
 * @param   {Context} ctx canvas 2d context
 * @return  none
 */    
ROL.Sprite.prototype.draw = function(ctx) {
    if (this.image) {
        if (this.image instanceof ROL.Figure) {
            ctx.strokeStyle = typeof this.stroke ==='function' ? this.stroke() : this.stroke;
            ctx.fillStyle   = typeof this.fill === 'function'  ? this.fill()   : this.fill;
            ctx.beginPath();
            this.image.draw(ctx, this.facing);
            ctx.fill();
            ctx.stroke();
        }
    }
};

/**
 * Moves sprite to a new position
 * @public
 * @function
 * @param   {int} x new x coordinate
 * @param   {int} y new y coordinate
 * @param   {boolean} relative
 *          if <b>true</b>, x and y are relative coordinates to the anchor.
 *          if <b>false</b>, x and y are absolute coordinates.
 * @return  this
 */    
ROL.Sprite.prototype.moveTo = function(x, y, relative) {
    if (this.image && (typeof this.image.moveTo === 'function')) {
        this.image.moveTo(x, y, relative);
    }
    return this;
};

/**
 * Checks if a point given by x & y coordinate is inside the sprie.
 * @public
 * @function
 * @param   {int} x x coordinate.
 * @param   {int} y y coordinate.
 * @return  <b>true</b> if coordinate is inside the sprite. 
 *          <p><b>false</b> if not.          
 */
ROL.Sprite.prototype.isInside = function(x, y) {
    if (this.image && (typeof this.image.isInside === 'function')) {
        return this.image.isInside(x, y);
    }
    return false;
};

/**
 * Checks if sprite collides with any other sprite.
 * @public
 * @function
 * @param   {int} x coordinate x for checking collision
 * @param   {int} y coordinate y for checking collision
 * @param   {Array} sprites {@link Array} of {@link ROL.Sprite} for checking collisions
 * @return  {ROL.Sprite} if it collides with other sprite. 
 *          <p><b>true</b> if it is out of screen.
 *          <p><b>false</b> if it doesn't collide inside the canvas.
 */
ROL.Sprite.prototype.checkCollision = function(x, y, sprites) {
    var i;

    if ((x >= ROL.Game.screen.width) || (x <= 0)) {
        return true;
    }
    if ((y >= ROL.Game.screen.height) || (y <= 0)) {
        return true;
    }

    for (i = 0; i < sprites.length; i += 1) {
        if (this !== sprites[i]) {
            if (sprites[i].getOrigin().equal(x, y) === true) {
                return sprites[i];
            }
        }
    }
    return false;
};