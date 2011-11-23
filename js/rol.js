/**
 * @author <a href="mailto:jose.recuero@gmail.com">Jose Carlos Recuero</a>
 * @namespace Global Namespace placeholder
 */
var rol = {};

//(function() {

    /**
     * Enumeration that identifies the game object role.
     * @class Game Object role
     * @description <p>Every game object should have a role in the application,
     *              it could belong to the player party, it could be an
     *              enemy, ...
     * @property {int} NONE no role
     * @property {int} PLAYER belongs to the player party
     * @property {int} ENEMY belongs to the enemy party
     * @property {int} ALLY belongs to the ally party
     * @property {int} NPC non-playable character
     * @property {int} VENDOR vendor character
     */
    var ROLE = {
        NONE: 0,
        PLAYER: 1,
        ENEMY: 2,
        ALLY: 3,
        NPC: 4,
        VENDOR: 5
    };

    /**
     * Enumeration that identifies direction game object is facing.
     * @class Game Object Facing Type
     * @description <p>Every game object should be facing in to a direction
     *              in the canvas.
     * @property {int} NONE no face
     * @property {int} UP face upwards
     * @property {int} DOWN face downwards
     * @property {int} LEFT face leftwards
     * @property {int} RIGHT face rightwards
     */
    var FACING = {
        NONE:  0,        
        UP:    1, 
        DOWN:  2, 
        LEFT:  3, 
        RIGHT: 4  
    };

    /**
     * Enumeration that identifies what key was pressed and which should be
     * the facing direction for that keycode.
     * @class Key pressed
     * @property {Object} UP
     * @property {Object} DOWN
     * @property {Object} LEFT
     * @property {Object} RIGHT
     * @property {Object} SPACE
     */
    var KEY = {
        UP: {
            code: 38,
            facing: FACING.UP
        },
        DOWN: {
            code: 40,
            facing: FACING.DOWN
        },
        LEFT: {
            code:37,
            facing: FACING.LEFT
        },
        RIGHT: {
            code: 39,
            facing: FACING.RIGHT
        },
        SPACE: {
            code: 32,
            facing: FACING.NONE
        }
    };
    
    /**
     * Enumeration that identifies in which phase is the turn.
     * @class Actor Turn Phase
     * @property {int} NONE
     * @property {int} START
     * @property {int} PLAYER_START
     * @property {int} PLAYER_ACT
     * @property {int} PLAYER_WAIT_END
     * @property {int} PLAYER_END
     * @property {int} ENEMY_START
     * @property {int} ENEMY_ACT
     * @property {int} ENEMY_WAIT_END
     * @property {int} ENEMY_END
     * @property {int} END
     */
    var TURN_PHASE = {
        NONE:            0,
        START:           1,
        PLAYER_START:    2,
        PLAYER_ACT:      3,
        PLAYER_WAIT_END: 4,
        PLAYER_END:      5,
        ENEMY_START:     6,
        ENEMY_ACT:       7,
        ENEMY_WAIT_END:  8,
        ENEMY_END:       9,
        END:             10
    };
    
    
    /**
     * Grid properties.
     * @class Canvas Grid
     * @property {int} cell_size Cell size
     * @property {int} cells_in_width Number of horizontal cells
     * @property {int} cells_in_height Number of vertical cells
     * @property {Color} stroke_style Grid stroke color
     * @constructor
     * @param   {int} cell_size cell size
     * @param   {int} x_cells number of horizontal cells
     * @param   {int} y_cells number of vertical cells
     * @return  this
     */
    var Grid = function(cell_size, x_cells, y_cells) {
        this.cell_size       = cell_size;
        this.cells_in_width  = x_cells;
        this.cells_in_height = y_cells;
        this.stroke_style    = "yellow";
        return this;
    }
    
    /**
     * Gets the left top corner position in the canvas for a given cell.
     * @public
     * @function
     * @param   {int} x_cell cell x coordinate
     * @param   {int} y_cell cell y coordinate
     * @return  {Point} point to the left top corner position
     */
    Grid.prototype.getCornerPosFromCell = function(x_cell, y_cell) {
        var point = new Point(x_cell === null ? null : x_cell * this.cell_size, 
                              y_cell === null ? null : y_cell * this.cell_size);
        return point;
    };
    
    /**
     * Gets the center position in the canvas for a given cell.
     * @public
     * @function
     * @param   {int} x_cell cell x coordinate
     * @param   {int} y_cell cell y coordinate
     * @return  {Point} point to the center position
     */
    Grid.prototype.getCenterPosFromCell = function(x_cell, y_cell) {
        var half_cell = this.cell_size / 2;
            point     = new Point(x_cell === null ? null : (x_cell * this.cell_size) + half_cell, 
                                  y_cell === null ? null : (y_cell * this.cell_size) + half_cell);
        return point;
    };
    
    /**
     * Gets the cell from the canvas position.
     * @public
     * @function
     * @param   {int} x_pos canvas x coordinate
     * @param   {int} y_pos canvas y coordinate
     * @return  {Point} point to the cell.
     */
    Grid.prototype.getCellFromPos = function(x_pos, y_pos) {
        var x = x_pos % this.cell_size,
            y = y_pos % this.cell_size;
        return new Point(x, y);
    };
    
    /**
     * Draws the Grid.
     * @public
     * @function
     * @param   {Context} ctx
     *          canvas 2D context
     */
    Grid.prototype.draw = function(ctx) {
        var width  = this.cell_size * this.cells_in_width,
            height = this.cell_size * this.cells_in_height,
            x, y;

        ctx.strokeStyle = this.stroke_style;
        ctx.beginPath();
        for (x = this.cell_size, y = 0; x < width; x += this.cell_size) {
            ctx.moveTo(x, y);
            ctx.lineTo(x, height);
        }
        for (y = this.cell_size, x = 0; y < height; y += this.cell_size) {
            ctx.moveTo(x, y);
            ctx.lineTo(width, y);
        }
        ctx.stroke();
    };
    

    /**
     * A Class used to store a point identified by x and y coordinates.
     * @class   Represents a point.
     * @property {int} x stores x coordinate
     * @property {int} y stores y coordinate
     * @constructor
     * @param   {int} x
     *          x coordinate
     * @param   {int} y
     *          y coordinate
     * @return  this.
     */
    var Point = function(x, y) {
        this.x = x;
        this.y = y;
        return this;
    };
    
    /**
     * Checks if two points are equal.
     * @public
     * @function
     * @param   {Point} point point to check if equals
     * @return  <b>true</b> points are equal.
     *          <p><b>false</b> points are not equal.
     */
    Point.prototype.equal = function(point) {
        return ((this.x === point.x) && (this.y === point.y));
    };
    
    /**
     * Point as a string.
     * @public
     * @function
     * @return  point formatted as a string.
     */
    Point.prototype.toString = function() {
        return '(' + this.x + ', ' + this.y + ')';
    };    
    
    
    /**
     * Basic figure class.
     * @class Abstract Figure
     * @property {Point} origin Figure origin
     * @property {int} cell_size Cell size
     * @constructor
     * @param   {int} x figure origin x coordinate
     * @param   {int} y figure origin y coordinate
     * @param   {int} cell_size cell size
     * @return  this.
     */
    var Figure = function(x, y, cell_size) {
        this.origin    = new Point(x, y);
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
    Figure.prototype.moveTo = function(x, y, relative) {
        x = x === null ? (relative ? 0 : this.origin.x) : x;
        y = y === null ? (relative ? 0 : this.origin.y) : y;
        
        this.origin.x = relative ? this.origin.x + x : x;
        this.origin.y = relative ? this.origin.y + y : y;
        return this;
    }
    
    
    /**
     * Circle figure.
     * @class Circle
     * @augments Figure
     * @property {int} ration Circle ratio
     * @constructor
     * @param   {int} x circle center x coordinate
     * @param   {int} y circle center y coordinate         
     * @param   {int} r circle ratio
     * @param   {int} cell_size cell size
     * @return  this.
     */
    var Circle = function(x, y, r, cell_size) {
        Circle._baseConstructor.call(this, x, y, cell_size);
        this.ratio = r;
        return this;
    };
    
    // Circle extends Figure.
    jcRap.extend(Circle, Figure);
    
    /**
     * Draw a cicle
     * @public
     * @function
     * @param   {Context} ctx canvas 2d context
     * @return  none.
     */
    Circle.prototype.draw = function(ctx) {
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
    Circle.prototype.isInside = function(x, y) {
        var x_distance = Math.pow(x - this.origin.x, 2),
            y_distance = Math.pow(y - this.origin.y, 2);
        return ((x_distance + y_distance) < Math.pow(this.ratio, 2));
    };
    
    
    /**
     * Rectangle figure.
     * @class Rectangle
     * @augment Figure
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
    var Rectangle = function(x, y, w, h, cell_size) {
        Rectangle._baseConstructor.call(this, x, y, cell_size);
        this.width  = w;
        this.height = h;
        return this;
    }
    
    // Rectangle extends Figure
    jcRap.extend(Rectangle, Figure);
            
    /**
     * Draws a rectangle
     * @public
     * @function
     * @param   {Context} ctx canvas 2d context
     * @return  none.
     */
    Rectangle.prototype.draw = function(ctx) {
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
    Rectangle.prototype.isInside = function(x, y) {
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
    var Pacman = function(x, y, r, cell_size) {
        Pacman._baseConstructor.call(this, x, y, r, cell_size);
        this.draw_values = {
            up:    [[1.75, 0.75], [0.25, 1.25]],
            down:  [[0.75, 1.75], [1.25, 0.25]],
            left:  [[1.75, 0.75], [1.25, 0.25]],
            right: [[0.25, 1.25], [0.75, 1.75]]
        };
        return this;
    };
    
    // Pacman extends Circle
    jcRap.extend(Pacman, Circle);
    
    /**
     * Draws a pacman
     * @public
     * @function
     * @param   {Context} ctx canvas 2d context
     * @param   {FACING} facing Figure facing direction
     * @return  none.
     */    
    Pacman.prototype.draw = function(ctx, facing) {
        var x = this.cell_size ? (this.origin.x * this.cell_size) + (this.cell_size / 2) : this.origin.x,
            y = this.cell_size ? (this.origin.y * this.cell_size) + (this.cell_size / 2) : this.origin.y,
            values = [];
        
        switch(facing) {
            case FACING.UP:
                values.push(this.draw_values.up[0], this.draw_values.up[1]);
                break;
            case FACING.DOWN:
                values.push(this.draw_values.down[0], this.draw_values.down[1]);
                break;
            case FACING.LEFT:
                values.push(this.draw_values.left[0], this.draw_values.left[1]);
                break;
            case FACING.RIGHT:
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
     * @property {Figure} figure Sprite figure
     * @property {Object} stroke Sprite stroke color
     * @property {Object} fill Sprite fill color
     * @property {FACING} facing Sprite facing direction
     * @constructor
     * @param   {Figure} figure figure to be used as the sprite
     * @return  this
     */
    var Sprite = function(figure) {
        this.figure    = figure;
        this.stroke    = "black";
        this.fill      = "white";
        this.facing    = FACING.NONE;
        return this;
    };
    
    /**
     * Gets sprite figure origin.
     * @public
     * @function
     * @return {Point} figure origin
     */
    Sprite.prototype.getOrigin = function() {
        return this.figure.origin;
    };
    
    /**
     * Sets sprite figure origin to a new value.
     * @public
     * @function
     * @param   {int} x new origin x coordinate
     * @param   {int} y new origin y coordinate
     * @return  none
     */
    Sprite.prototype.setOrigin = function(x, y) {
        this.figure.origin.x = x;
        this.figure.origin.y = y;
    }
    
    /**
     * Moves one time frame.
     * @public
     * @function
     * @return  none.
     */
    Sprite.prototype.moveFrame = function() {
        if (this.figure && (typeof this.figure.moveFrame === 'function')) {
            this.figure.moveFrame();
        }
    };
    
    /**
     * Draws a sprite
     * @public
     * @function
     * @param   {Context} ctx canvas 2d context
     * @return  none
     */    
    Sprite.prototype.draw = function(ctx) {
        ctx.strokeStyle = typeof this.stroke ==='function' ? this.stroke() : this.stroke;
        ctx.fillStyle   = typeof this.fill === 'function'  ? this.fill()   : this.fill;
        ctx.beginPath();
        this.figure.draw(ctx, this.facing);
        ctx.fill();
        ctx.stroke();
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
    Sprite.prototype.moveTo = function(x, y, relative) {
        this.figure.moveTo(x, y, relative);
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
    Sprite.prototype.isInside = function(x, y) {
        return this.figure.isInside(x, y);
    };
    
    /**
     * Checks if sprite collides with any other sprite.
     * @deprecated Method to be updated with new grid feature.
     * @public
     * @function
     * @param   {int} x coordinate x for checking collision
     * @param   {int} y coordinate y for checking collision
     * @param   {Array} sprites {@link Array} of {@link Sprite} for checking collisions
     * @return  {Sprite} if it collides with other sprite. 
     *          <p><b>true</b> if it is out of screen.
     *          <p><b>false</b> if it doesn't collide inside the canvas.
     */
    Sprite.prototype.checkCollision = function(x, y, sprites) {
        var i;

        if ((x >= GAME.screen.width) || (x <= 0)) {
            return true;
        }
        if ((y >= GAME.screen.height) || (y <= 0)) {
            return true;
        }

        for (i = 0; i < sprites.length; i += 1) {
            if (this !== sprites[i]) {
                if (sprites[i].isInside(x, y) === true) {
                    return sprites[i];
                }
            }
        }
        return false;
    }
    
    
    /**
     * Game Object class.
     * @class Game Object
     * @property {string} name Game object name
     * @property {Sprite} sprite Game object sprite
     * @property {boolean} visible Game object visible or hiden
     * @property {boolean} solid Game object solid or not
     * @property {int} x cell coordinate x
     * @property {int} y cell coordinate y
     * @property {FACING} facing Game object facing direction
     * @constructor
     * @param   {string} name
     *          game object name
     * @return  this
     */    
    var GameObject = function(name) {
        this.name    = name;
        this.sprite  = null;
        this.visible = true;
        this.solid   = true;
        this.x       = 0;
        this.y       = 0;
        this.facing  = FACING.NONE;
    };
    
    /**
     * Gets game object cell position.
     * @public
     * @function
     * @return  {Point} cell point
     */
    GameObject.prototype.getCell = function() {
        return new Point(this.x, this.y);
    };
    
    /**
     * Sets game object cell position.
     * @public
     * @function
     * @param   {int} x cell x coordinate
     * @param   {int} y cell y coordinate
     * @return  none
     */
    GameObject.prototype.setCell = function(x, y) {
        this.x = x;
        this.y = y;
        this.sprite && this.sprite.setOrigin(x, y);
    };
        
    /**
     * Sets game object sprite figure facing direction.
     * @public
     * @function
     * @param   {FACING} facing
     *          new facing direction
     * @return  none
     */
    GameObject.prototype.setFacing = function(facing) {
        this.facing = facing;
        this.sprite && (this.sprite.facing = facing);
    };    
    
    /**
     * Checks if game object collides with any other game objects.
     * @public
     * @function
     * @param   {int} x cell coordinate x for checking collision
     * @param   {int} y cell coordinate y for checking collision
     * @param   {Array} objects {@link Array} of {@link GameObject} for checking collisions
     * @return  {GameObject} if it collides with other game object. 
     *          <p><b>true</b> if it is out of screen.
     *          <p><b>false</b> if it doesn't collide inside the canvas.
     */
    GameObject.prototype.checkCollision = function(x, y, objects) {
        var i;

        if ((x >= GAME.screen.x_cells) || (x < 0)) {
            return true;
        }
        if ((y >= GAME.screen.y_cells) || (y < 0)) {
            return true;
        }
        for (i = 0; i < objects.length; i += 1) {
            if (this !== objects[i]) {
                if (this.getCell().equal(objects[i].getCell()) === true) {
                    return objects[i];
                }
            }
        }
        return false;
    };
    
    /**
     * Moves one time frame.
     * @public
     * @function
     * @return  none.
     */
    GameObject.prototype.moveFrame = function() {
        return this.sprite && this.sprite.moveFrame();
    }
    
    /**
     * Draws a game object
     * @public
     * @function
     * @param   {Context} ctx
     *          canvas 2d context
     * @return  none.
     */    
    GameObject.prototype.draw = function(ctx) {
        this.sprite.draw(ctx);
    };
    
    /**
     * Move game object to a new position
     * @public
     * @function
     * @param   {int} x
     *          new x coordinate
     * @param   {int} y
     *          new y coordinate
     * @param   {boolean} relative
     *          if true, x and y are relative coordinates to the anchor.
     *          if false, x and y are absolute coordinates.
     * @return  this
     */        
    GameObject.prototype.moveTo = function(x, y, relative) {
        x = x === null ? this.x : x;
        y = y === null ? this.y : y;
        this.setCell(x, y);
        return this.sprite.moveTo(x, y, relative);
    };


    /**
     * Bullet game object.
     * @class Bullet object
     * @augments GameObject
     * @constructor
     * @property {GameObject} owner bullet owner
     * @property {FACING} direction directin bullet travels
     * @param   {int} x bullet x coordinate
     * @param   {int} y bullet y coordinate
     * @param   {GameObject} owner bullet owner
     * @param   {FACING} direction direction bullet travels
     */
    var Bullet = function(x, y, owner, direction) {
        var ratio = 5,
            figure;

        Bullet._baseConstructor.call(this, "bullet");
        this.owner       = owner;
        figure           = new Circle(x, y, ratio, GAME.grid.cell_size);
        this.sprite      = new Sprite(figure);
        this.sprite.fill = "red";
        this.direction   = direction;
        this.setCell(x, y);
        return this;
    };
    
    jcRap.extend(Bullet, GameObject);
    
    /**
     * @methodOf
     */
    Bullet.prototype.moveFrame = function() {
        var bullet_speed = 1,
            cell = this.getCell();
        
        switch (this.direction) {
        case FACING.UP:
            cell.y -= bullet_speed;
            break;
        case FACING.DOWN:
            cell.y += bullet_speed;
            break;
        case FACING.LEFT:
            cell.x -= bullet_speed;
            break;
        case FACING.RIGHT:
            cell.x += bullet_speed;
            break;
        case FACING.NONE:
        default:
            break;
        }
        
        this.moveTo(cell.x, cell.y, false);
    };
      
      
    /**
     * Actor game object.
     * @class Actor game object
     * @augments GameObject
     * @constructor
     * @param   {string} name actor name
     * @param   {Sprite} sprite sprite that represents the hero
     * @return  this
     */
    var Actor = function(name, sprite) {
        Actor._baseConstructor.call(this, name);
        this.sprite = sprite;
        return this;
    };
    
    jcRap.extend(Actor, GameObject);
    
    /**
     * Actor gets damage.
     * @public
     * @function
     * @param   {int} dmg damage value
     * @return  none
     * TODO - To be implemented.
     */
    Actor.prototype.damage = function(dmg) {
        dmg = dmg || 0;
    }
    
    /**
     * Check if actor is alive.
     * @public
     * @function
     * @return  <b>true</b> actor is alive.
     *          <p><b>false</b> actor is not alive.
     * TODO - to be implemented.
     */
    Actor.prototype.isAlive = function() {
        return false;
    }
    
    
    /**
     * Hero game object.
     * @class Hero game object
     * @augments Actor
     * @constructor
     * @param   {string} name hero name
     * @param   {Sprite} sprite sprite that represents the hero
     * @return  this
     */
    var Hero = function(name, sprite) {
        Hero._baseConstructor.call(this, name, sprite);
        return this;
    };
    
    // Hero extends Actor
    jcRap.extend(Hero, Actor);
    
    /**
     * Enemy game object.
     * @class Enemy game object
     * @augments Actor
     * @constructor
     * @param   {string} name enemy name
     * @param   {Sprite} sprite sprite that represents the enemy
     * @return  this
     */
    var Enemy = function(name, sprite) {
        Enemy._baseConstructor.call(this, name, sprite);
        return this;
    };
    
    // Enemy extends Actor
    jcRap.extend(Enemy, Actor);
    
    /**
     * Main game object
     * @class Main Game Object
     * @property {Object} screen Screen Width and Height
     * @property {Grid}   grid Game grid
     * @property {int}    loop_timeout Game timeout between updates
     * @property {Object} keys_down Keys pressed at any time
     * @property {Hero}   player Player {@link Hero} actor
     * @property {Array}  enemies Array of {@link Enemy}
     * @property {Array} bullets Array of {@link Bullet}
     * @property {Array}  actors Arrays of {@link Actor}
     * @property {TURN_PHASE} turn_phase Game turn phase
     */
    var GAME = {
        screen: {
            cell_size: 20,
            x_cells: 20,
            y_cells: 20,
            width:  0,
            height: 0
        },
        grid: null,
        loop_timeout: 10,
        keys_down: {},
        player: null,
        enemies: [],
        bullets: [],
        actors: [],
        turn_phase: TURN_PHASE.NONE,
        /**
         * Initializes game object
         * @public
         * @function
         */
        init: function() {
            this.screen.width  = this.screen.cell_size * this.screen.x_cells;
            this.screen.height = this.screen.cell_size * this.screen.y_cells;
            this.grid = new Grid(this.screen.cell_size, this.screen.width, this.screen.height);
            this.player = this.createPlayer();
            this.turn_phase = TURN_PHASE.START;            
            this.addActor(this.player);
            this.createEnemy();
        },
        /**
         * Create a new player.
         * @public
         * @function
         * @return  {Actor} new player
         */
        createPlayer: function() {
            var cell,
                figure,
                sprite,
                player;
                
            cell   = new Point(0, 0);
            figure = new Pacman(cell.x, cell.y, this.grid.cell_size/2, this.grid.cell_size);
            sprite = new Sprite(figure);
            sprite.stroke = "green";
            sprite.fill   = "blue";
            player = new Hero("Hero", sprite);
            player.setCell(cell.x, cell.y);
            return player;
        },
        /**
         * Creates a new enemy at a random position inside the grid.
         * @public
         * @function
         * @return  none
         */
        createEnemy: function() {
            var cell,
                figure,
                sprite,
                enemy,
                empty_cell = false;
                
            cell = new Point(Math.floor(Math.random() * this.screen.x_cells),
                             Math.floor(Math.random() * this.screen.y_cells));
            figure = new Rectangle(cell.x, cell.y, this.grid.cell_size, this.grid.cell_size, this.grid.cell_size)
            sprite = new Sprite(figure);
            sprite.stroke = "black";
            sprite.fill   = "red";
            enemy  = new Enemy("Goblin", sprite);
            enemy.setCell(cell.x, cell.y);
            do {
                if (enemy.checkCollision(cell.x, cell.y, this.actors) === false) {
                    empty_cell = true;
                } else {
                    cell = new Point(Math.floor(Math.random() * this.screen.x_cells),
                                     Math.floor(Math.random() * this.screen.y_cells));
                    enemy.setCell(x_cell, y_cell);
                }
            } while(!empty_cell) 
            this.enemies.push(enemy);
            this.addActor(enemy);
        },        
        /**
         * Key Down event handler.
         * @public
         * @event
         * @param   {Event} evt
         *          event
         * @return  none
         */
        doKeyDown: function(evt) {
            GAME.keys_down[evt.keyCode] = true;
        },
        /**
         * Key Up event handler.
         * @public
         * @event
         * @param   {Event} evt
         *          event
         * @return  none
         */
        doKeyUp: function(evt) {
            delete GAME.keys_down[evt.keyCode];
        },
        /**
         * Moves player.
         * @public
         * @function
         * @return  none
         */
        movePlayer: function() {
            var player_cell = this.player.getCell(),
                move = false,
                step = 1;
            
            if (KEY.UP.code in this.keys_down) {
                player_cell.y -= step;
                this.player.setFacing(KEY.UP.facing);
                delete this.keys_down[KEY.UP.code];
                move = true;
            }
            if (KEY.DOWN.code in this.keys_down) {
                player_cell.y += step;
                this.player.setFacing(KEY.DOWN.facing);
                delete this.keys_down[KEY.DOWN.code];
                move = true;
            }
            if (KEY.LEFT.code in this.keys_down) {
                player_cell.x -= step;
                this.player.setFacing(KEY.LEFT.facing);
                delete this.keys_down[KEY.LEFT.code];
                move = true;
            }
            if (KEY.RIGHT.code in this.keys_down) {
                player_cell.x += step;
                this.player.setFacing(KEY.RIGHT.facing);
                delete this.keys_down[KEY.RIGHT.code];
                move = true;
            }
            if (KEY.SPACE.code in this.keys_down) {
                this.turn_phase = TURN_PHASE.PLAYER_ACT;
            }
            
            if (move) {
                this.turn_phase = TURN_PHASE.ENEMY_START;
            
                if (this.player.checkCollision(player_cell.x, player_cell.y, this.actors) !== false) {
                    player_cell.x = null;
                    player_cell.y = null;
                }

                this.player.moveTo(player_cell.x, player_cell.y, false);
            }            
        },
        /**
         * Moves all enemies.
         * @public
         * @function
         * @return  none
         */
        moveEnemy: function() {
            var i,
                enemies_len;
            
            for (i = 0, enemies_len = this.enemies.length; i < enemies_len; i += 1) {
                var enemy_cell = this.enemies[i].getCell(),
                    new_cell   = new Point(enemy_cell.x - 1, enemy_cell.y - 1);
                                           
                if (this.enemies[i].checkCollision(new_cell.x, new_cell.y, this.actors) !== false) {
                    new_cell.x = null;
                    new_cell.y = null;
                }

                this.enemies[i].moveTo(new_cell.x, new_cell.y, false);
            }
        },
        /**
         * Player shooting.
         * @public
         * @function
         * @return  none
         */
        shoot: function(actor) {
            var cell = actor.getCell(),
                bullet = new Bullet(cell.x, cell.y, actor, actor.facing);            
            this.addBullet(bullet);
        },
        /**
         * Updates player.
         * @public
         * @function
         * @return  none
         */
        updatePlayer: function() {
            this.movePlayer();
        },
        /**
         * Updates all enemies.
         * @public
         * @funcion
         * @return  none
         */
        updateEnemy: function() {
            this.moveEnemy();
        },
        /**
         * Update player bullet.
         * @public
         * @function
         * @return  none
         */
        updateBullet: function() {
            var i,
                len,
                remove_bullets = [];
                
            for (i = 0, len = this.bullets.length; i < len; i += 1) {
                var bullet = this.bullets[i],
                    cell   = bullet.getCell(),
                    collision;
                
                bullet.moveFrame();
                collision = bullet.checkCollision(cell.x, cell.y, this.actors);
                if (collision === true) {
                    console.log("Bullet out of screen");
                    this.turn_phase = TURN_PHASE.ENEMY_START;
                    remove_bullets.push(bullet);
                } else if (collision !== false) {
                    console.log("Bullet hit " + collision.name);
                    this.turn_phase = TURN_PHASE.ENEMY_START;
                    remove_bullets.push(bullet);
                    collision.damage(null);
                    if (!collision.isAlive()) {
                        this.removeActor(collision);
                    }
                }
                
                if (remove_bullets.length > 0) {
                    for (i = 0, len = remove_bullets.length; i < len; i += 1) {
                        this.removeBullet(remove_bullets[i]);
                    }
                }
            }
        },
        /**
         * Adds a new actor.
         * @public
         * @function
         * @param   {Actor} actor
         *          new actor to add
         * @return  none
         */
        addActor: function(actor) {
            this.actors.push(actor);
        },
        /**
         * Removes an actor.
         * @public
         * @funcion
         * @param   {Actor} actor
         *          actor to remove
         * @return  none
         */
        removeActor: function(actor) {
            var len,
                i;
            
            for (i = 0, len = this.actors.length; i < len; i += 1) {
                if (actor === this.actors[i]) {
                    this.actors.splice(i, 1);
                    break;
                }
            }
            
            for (i = 0, len = this.enemies.length; i < len; i += 1) {
                if (actor === this.enemies[i]) {
                    this.enemies.splice(i, 1);
                    break;
                }
            }
        },
        /**
         * Adds a bullet.
         * @public
         * @function
         * @param   {Bullet} bullet bullet to be added
         * @return  none
         */
        addBullet: function(bullet) {
            this.bullets.push(bullet);
            this.addActor(bullet);
        },
        /**
         * Removes a bullet
         * @public
         * @function
         * @param   {Bullet} bullet bullet to be removed
         * @return  none
         */
        removeBullet: function(bullet) {
            var len,
                i;
                
            for (i = 0, len = this.bullets.length; i < len; i += 1) {
                if (bullet === this.bullets[i]) {
                    this.bullets.splice(i, 1);
                    this.removeActor(bullet);
                    return;
                }
            }
        },
        /**
         * Updates game object.
         * @public
         * @function
         * @return  none
         */
        update: function() {        
            switch (this.turn_phase) {
                case TURN_PHASE.START:
                    if (this.enemies.length == 0) {
                        this.createEnemy();
                    }
                    this.turn_phase = TURN_PHASE.PLAYER_START;
                    break;
                case TURN_PHASE.PLAYER_START:
                    this.updatePlayer();
                    break;
                case TURN_PHASE.PLAYER_ACT:
                    this.shoot(this.player);
                    this.turn_phase = TURN_PHASE.PLAYER_WAIT_END;
                    break;
                case TURN_PHASE.PLAYER_WAIT_END:
                    this.updateBullet();
                    break;
                case TURN_PHASE.ENEMY_START:
                    this.updateEnemy();
                    this.turn_phase = TURN_PHASE.END;
                    break;
                case TURN_PHASE.END:
                    this.turn_phase = TURN_PHASE.START;
                    break;
            }
            
            $("#position-p").text('[' + this.turn_phase + '] ' + 
                this.player.name + " at " + this.player.getCell());
        },
        /**
         * Draws all game objects in the canvas.
         * @public
         * @function
         * @param   {Context} ctx Canvas 2D context
         * @return  none
         */
        draw: function(ctx) {
            var i,
                len;
            
            ctx.clearRect(0, 0, this.screen.width, this.screen.height);
            
            this.grid.draw(ctx);
            for (i = 0, len = this.actors.length; i < len; i += 1) {
                this.actors[i].draw(ctx);
            }
        },
        /**
         * Game loop. 
         * <p>It is called periodically in order to update all game
         * objects and draw them.
         * @public
         * @function
         * @param   {Context} ctx Canvas 2D context
         * @return  none
         */
        loop: function(ctx) {
            this.update();
            this.draw(ctx);
        }
    };
    
    /**
     * Initializes all objects.
     * @public
     * @function
     * @return  none
     */
    var init = function() {
        var canvas  = document.getElementById("screen-canvas"),
            context = canvas.getContext("2d");
            
        GAME.init();
        canvas.width  = GAME.screen.width;
        canvas.height = GAME.screen.height;
        setInterval(function() {GAME.loop(context);}, GAME.loop_timeout);
        addEventListener('keydown', GAME.doKeyDown, false);
        addEventListener('keyup', GAME.doKeyUp, false);
    };
    
    /**
     * 
     */
    $(function() {
        init();
    });
    
//})();
