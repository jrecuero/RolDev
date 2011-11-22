/**
 * @author <a href="mailto:jose.recuero@gmail.com">Jose Carlos Recuero</a>
 */

/**
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
     * @property {int} CELL_SIZE Cell size
     * @property {int} cells_in_width Number of horizontal cells
     * @property {int} cells_in_height Number of vertical cells
     */
    var GRID = {
        CELL_SIZE: 20,
        cells_in_width: 0,
        cells_in_height:0,
        /**
         * Initializes GRID.
         * @public
         * @function
         * @param   {int} x_cells
         *          number of horizontal cells
         * @param   {int} y_cells
         *          number of vertical cells
         * @return  this
         */
        init: function(x_cells, y_cells) {
            this.cells_in_width  = x_cells;
            this.cells_in_height = y_cells;
            return this;
        },
        /**
         * Draws the GRID.
         * @public
         * @function
         * @param   {Context} ctx
         *          canvas 2D context
         */
        draw: function(ctx) {
            var width  = this.CELL_SIZE * this.cells_in_width,
                height = this.CELL_SIZE * this.cells_in_height,
                x, y;
                
            ctx.strokeStyle = "yellow";
            ctx.beginPath();
            for (x = this.CELL_SIZE, y = 0; x < width; x += this.CELL_SIZE) {
                ctx.moveTo(x, y);
                ctx.lineTo(x, height);
            }
            for (y = this.CELL_SIZE, x = 0; y < height; y += this.CELL_SIZE) {
                ctx.moveTo(x, y);
                ctx.lineTo(width, y);
            }
            ctx.stroke();
        }
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
     * @property {Point} anchor Figure anchor
     * @property {FACING} facing Figure facing direction
     * @constructor
     * @param   {int} x
     *          figure anchor x coordinate
     * @param   {int} y
     *          figure anchor y coordinate
     * @return  this.
     */
    var Figure = function(x, y) {
        this.anchor = new Point(x, y);
        this.facing = FACING.NONE;
        return this;
    };
    
    /**
     * Move figure to a new position
     * @public
     * @function
     * @param   { int } x
     *          new x coordinate
     * @param   { int } y
     *          new y coordinate
     * @param   { boolean } relative
     *          if true, x and y are relative coordinates to the anchor.
     *          if false, x and y are absolute coordinates.
     * @return  this
     */
    Figure.prototype.moveTo = function(x, y, relative) {
        x = x === null ? (relative ? 0 : this.anchor.x) : x;
        y = y === null ? (relative ? 0 : this.anchor.y) : y;
        
        this.anchor.x = relative ? this.anchor.x + x : x;
        this.anchor.y = relative ? this.anchor.y + y : y;
        return this;
    }
    
    
    /**
     * Circle figure.
     * @class Circle
     * @augments Figure
     * @property {int} ration Circle ratio
     * @constructor
     * @param   {int} x
     *          circle center x coordinate
     * @param   {int} y
     *          circle center y coordinate         
     * @param   {int} r
     *          circle ratio
     * @return  this.
     */
    var Circle = function(x, y, r) {
        Circle._baseConstructor.call(this, x, y);
        this.ratio = r;
        return this;
    };
    
    // Circle extends Figure.
    jcRap.extend(Circle, Figure);
    
    /**
     * Draw a cicle
     * @public
     * @function
     * @param   {Context} ctx
     *          canvas 2d context
     * @return  none.
     */
    Circle.prototype.draw = function(ctx) {
        ctx.arc(this.anchor.x, this.anchor.y, this.ratio, 0, Math.PI * 2, false);
    };
    
    /**
     * Checks if a point given by x & y coordinate is inside the circle.
     * @public
     * @function
     * @param   {int} x
     *          x coordinate.
     * @param   {int} y
     *          y coordinate.
     * @return  true if coordinate is inside the circle. false if not.          
     */
    Circle.prototype.isInside = function(x, y) {
        var x_distance = Math.pow(x - this.anchor.x, 2),
            y_distance = Math.pow(y - this.anchor.y, 2);
        return ((x_distance + y_distance) < Math.pow(this.ratio, 2));
    };
    
    
    /**
     * Rectangle figure.
     * @class Rectangle
     * @augment Figure
     * @property {int} width Rectangle width
     * @property {int} height Rectangle height
     * @constructor
     * @param   {int} x
     *          rectangle left top corner x coordinate
     * @param   {int} y
     *          rectangle left top corner y coordinate         
     * @param   {int} w
     *          rectangle width
     * @param   {int} h
     *          rectangle height
     * @return  this.
     */
    var Rectangle = function(x, y, w, h) {
        Rectangle._baseConstructor.call(this, x, y);
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
     * @param   {Context} ctx
     *          canvas 2d context
     * @return  none.
     */
    Rectangle.prototype.draw = function(ctx) {
        var x = this.anchor.x,
            y = this.anchor.y,
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
        if ((x >= this.anchor.x) && (x <= (this.anchor.x + this.width))) {
            if ((y >= this.anchor.y) && ( y <= (this.anchor.y + this.height))) {
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
     * @param   {int} x
     *          pacman center x coordinate
     * @param   {int} y
     *          pacman center y coordinate         
     * @param   {int} r
     *          pacman ratio
     * @return  this.
     */    
    var Pacman = function(x, y, r) {
        Pacman._baseConstructor.call(this, x, y, r);
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
     * @param   {Context} ctx
     *          canvas 2d context
     * @return  none.
     */    
    Pacman.prototype.draw = function(ctx) {
        var x      = this.anchor.x,
            y      = this.anchor.y,
            values = [];
        
        switch(this.facing) {
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
     * @constructor
     * @param   {Figure} figure
     *          figure to be used as the sprite
     * @param   {string} stroke
     *          sprite stroke color
     * @param   {string} fill
     *          sprite fill color
     * @return  this
     */
    var Sprite = function(figure, stroke, fill) {
        this.figure = figure;
        this.stroke = stroke;
        this.fill   = fill;
        return this;
    };
    
    /**
     * Gets sprite figure anchor.
     * @public
     * @function
     * @return {Point} figure anchor
     */
    Sprite.prototype.getOrigin = function() {
        return this.figure.anchor;
    };
    
    /**
     * Gets sprite figure facing direction.
     * @public
     * @function
     * @return {FACING} figure facing direction
     */
    Sprite.prototype.getFacing = function() {
        return this.figure.facing;
    };
    
    /**
     * Sets sprite figure facing direction.
     * @public
     * @function
     * @param   {FACING} facing
     *          new facing direction
     * @return  none
     */
    Sprite.prototype.setFacing = function(facing) {
        this.figure.facing = facing;
    };
    
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
     * @param   {Context} ctx
     *          canvas 2d context
     * @return  none
     */    
    Sprite.prototype.draw = function(ctx) {
        ctx.strokeStyle = typeof this.stroke ==='function' ? this.stroke() : this.stroke;
        ctx.fillStyle   = typeof this.fill === 'function'  ? this.fill()   : this.fill;
        ctx.beginPath();
        this.figure.draw(ctx);
        ctx.fill();
        ctx.stroke();
    };
    
    /**
     * Moves sprite to a new position
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
    Sprite.prototype.moveTo = function(x, y, relative) {
        this.figure.moveTo(x, y, relative);
        return this;
    };
        
    /**
     * Checks if a point given by x & y coordinate is inside the sprie.
     * @public
     * @function
     * @param   {int} x
     *          x coordinate.
     * @param   {int} y
     *          y coordinate.
     * @return  true if coordinate is inside the sprite. false if not.          
     */
    Sprite.prototype.isInside = function(x, y) {
        return this.figure.isInside(x, y);
    };
    
    /**
     * Checks if sprite collides with any other sprite.
     * @public
     * @function
     * @param   {int} x
     *          x coordinate for checking collision
     * @param   {int} y
     *          y coordinate for checking collision
     * @param   {Array} objects
     *          {@link Array} of {@link Sprite} for checking collisions
     * @return  {Sprite} if it collides with other sprite. 
     *          <p><b>true</b> if it is out of screen.
     *          <p><b>false</b> if it doesn't collide inside the canvas.
     */
    Sprite.prototype.checkCollision = function(x, y, objects) {
        var i;

        if ((x >= GAME.screen.width) || (x <= 0)) {
            return true;
        }
        if ((y >= GAME.screen.height) || (y <= 0)) {
            return true;
        }

        for (i = 0; i < objects.length; i += 1) {
            if (this !== objects[i]) {
                if (objects[i].isInside(x, y) === true) {
                    return objects[i];
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
     * @property {boolean} solid Game object solid or not.=
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
    }
    
    /**
     * Gets game object sprite figure anchor.
     * @public
     * @function
     * @return {Point} figure anchor
     */
    GameObject.prototype.getOrigin = function() {
        return this.sprite && this.sprite.getOrigin();
    };
    
    /**
     * Gets game object sprite figure facing direction.
     * @public
     * @function
     * @return {FACING} figure facing direction
     */
    GameObject.prototype.getFacing = function() {
        return this.sprite && this.sprite.getFacing();        
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
        this.sprite && this.sprite.setFacing(facing);
    };    
    
    /**
     * Checks if game object collides with any other game objects.
     * @public
     * @function
     * @param   {int} x
     *          x coordinate for checking collision
     * @param   {int} y
     *          y coordinate for checking collision
     * @param   {Array} objects
     *          {@link Array} of {@link GameObject} for checking collisions
     * @return  {GameObject} if it collides with other game object. 
     *          <p><b>true</b> if it is out of screen.
     *          <p><b>false</b> if it doesn't collide inside the canvas.
     */
    GameObject.prototype.checkCollision = function(x, y, objects) {
        var i;

        if ((x >= GAME.screen.width) || (x <= 0)) {
            return true;
        }
        if ((y >= GAME.screen.height) || (y <= 0)) {
            return true;
        }

        for (i = 0; i < objects.length; i += 1) {
            if (this !== objects[i]) {
                if (objects[i].sprite.isInside(x, y) === true) {
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
        if (this.bullet) {
            this.bullet.draw(ctx);
        }
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
        return this.sprite.moveTo(x, y, relative);
    };


    /**
     * Bullet game object.
     * @class Bullet object
     * @augments GameObject
     * @constructor
     * @property {int} ratio bullet ratio
     * @property {FACING} direction directin bullet travels
     * @param   {int} x 
     *          bullet x coordinate
     * @param   {int} y
     *          bullet y coordinate
     * @param   {FACING} direction 
     *          direction bullet travels
     */
    var Bullet = function(x, y, direction) {
        var ratio = 5;
        
        Bullet._baseConstructor.call(this, "bullet");
        this.sprite    = new Sprite(new Circle(x, y, ratio), "black", "red");
        this.direction = direction;
        return this;
    };
    
    jcRap.extend(Bullet, GameObject);
    
    /**
     * @methodOf
     */
    Bullet.prototype.moveFrame = function() {
        var bullet_speed = GRID.CELL_SIZE,
            origin = this.getOrigin();
        
        switch (this.direction) {
        case FACING.UP:
            origin.y -= bullet_speed;
            break;
        case FACING.DOWN:
            origin.y += bullet_speed;
            break;
        case FACING.LEFT:
            origin.x -= bullet_speed;
            break;
        case FACING.RIGHT:
            origin.x += bullet_speed;
            break;
        case FACING.NONE:
        default:
            break;
        }
        
        this.moveTo(origin.x, origin.y, false);
    };
      
      
    /**
     * Actor game object.
     * @class Actor game object
     * @augments GameObject
     * @constructor
     * @param   {string} name
     *          actor name
     * @param   {Sprite} sprite
     *          sprite that represents the hero
     * @return  this
     */
    var Actor = function(name, sprite) {
        Actor._baseConstructor.call(this, name);
        this.sprite = sprite;
        return this;
    };
    
    jcRap.extend(Actor, GameObject);
    
    
    /**
     * Hero game object.
     * @class Hero game object
     * @augments Actor
     * @constructor
     * @param   {string} name
     *          hero name
     * @param   {Sprite} sprite
     *          sprite that represents the hero
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
     * @param   {string} name
     *          enemy name
     * @param   {Sprite} sprite
     *          sprite that represents the enemy
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
     * @property {GRID}   grid Game grid
     * @property {int}    loop_timeout Game timeout between updates
     * @property {Object} keys_down Keys pressed at any time
     * @property {Hero}   player Player {@link Hero} actor
     * @property {Array}  enemies Array of {@link Enemy}
     * @property {Array}  actors Arrays of {@link Actor}
     * @property {TURN_PHASE} turn_phase Game turn phase
     */
    var GAME = {
        screen: {
            width:  200,
            height: 200
        },
        grid: GRID,
        loop_timeout: 10,
        keys_down: {},
        player: null,
        enemies: [],
        actors: [],
        turn_phase: TURN_PHASE.NONE,
        /**
         * Initializes game object
         * @public
         * @function
         */
        init: function() {
            var i;
            
            this.grid.init(this.screen.width, this.screen.height);
            this.player = new Hero("Hero", new Sprite(new Pacman(10, 10, GRID.CELL_SIZE/2), "green", "blue"));
            this.enemies.push(new Enemy("Goblin", new Sprite(new Rectangle(100, 100, GRID.CELL_SIZE, GRID.CELL_SIZE), "black", "yellow")),
                              new Enemy("Orc",    new Sprite(new Rectangle(160, 160, GRID.CELL_SIZE, GRID.CELL_SIZE), "black", "yellow")));
            this.turn_phase = TURN_PHASE.START;
            
            this.addActor(this.player);
            for (i = 0; i < this.enemies.length; i += 1) {
                this.addActor(this.enemies[i]);
            }
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
            var player_origin = this.player.getOrigin(),
                player_x = player_origin.x,
                player_y = player_origin.y,
                new_player_x = player_x,
                new_player_y = player_y,
                move = false;
            
            if (KEY.UP.code in this.keys_down) {
                new_player_y -= GRID.CELL_SIZE;
                this.player.setFacing(KEY.UP.facing);
                delete this.keys_down[KEY.UP.code];
                move = true;
            }
            if (KEY.DOWN.code in this.keys_down) {
                new_player_y += GRID.CELL_SIZE;
                this.player.setFacing(KEY.DOWN.facing);
                delete this.keys_down[KEY.DOWN.code];
                move = true;
            }
            if (KEY.LEFT.code in this.keys_down) {
                new_player_x -= GRID.CELL_SIZE;
                this.player.setFacing(KEY.LEFT.facing);
                delete this.keys_down[KEY.LEFT.code];
                move = true;
            }
            if (KEY.RIGHT.code in this.keys_down) {
                new_player_x += GRID.CELL_SIZE;
                this.player.setFacing(KEY.RIGHT.facing);
                delete this.keys_down[KEY.RIGHT.code];
                move = true;
            }
            if (KEY.SPACE.code in this.keys_down) {
                this.turn_phase = TURN_PHASE.PLAYER_ACT;
            }
            
            if (move) {
                this.turn_phase = TURN_PHASE.ENEMY_START;
            }            
            
            if (this.player.checkCollision(new_player_x, new_player_y, this.actors) !== false) {
                new_player_x = null;
                new_player_y = null;
            }
            
            this.player.moveTo(new_player_x, new_player_y, false);
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
                var enemy_origin = this.enemies[i].getOrigin();
                var new_x = enemy_origin.x - GRID.CELL_SIZE / 2 ;
                var new_y = enemy_origin.y - GRID.CELL_SIZE / 2;
                if (this.enemies[i].checkCollision(new_x, new_y, this.actors) === false) {
                    new_x -= GRID.CELL_SIZE / 2;
                    new_y -= GRID.CELL_SIZE / 2;
                } else {
                    new_x = null;
                    new_y = null;
                }

                this.enemies[i].moveTo(new_x, new_y, false);
            }
        },
        /**
         * Player shooting.
         * @public
         * @function
         * @return  none
         */
        shoot: function() {
            var player = this.player,
                player_origin = player.getOrigin();
                
            player.bullet = new Bullet(player_origin.x, player_origin.y, player.getFacing());            
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
            var bullet = this.player.bullet,
                bullet_origin = bullet.getOrigin(),
                collision;
            bullet.moveFrame();
            collision = bullet.checkCollision(bullet_origin.x, bullet_origin.y, this.actors);
            if (collision === true) {
                this.turn_phase = TURN_PHASE.ENEMY_START;
                console.log("Bullet out of screen");
            } else if (collision !== false) {
                this.turn_phase = TURN_PHASE.ENEMY_START;
                console.log("Bullet hit " + collision.name);
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
                    this.turn_phase = TURN_PHASE.PLAYER_START;
                    break;
                case TURN_PHASE.PLAYER_START:
                    this.updatePlayer();
                    break;
                case TURN_PHASE.PLAYER_ACT:
                    this.shoot();
                    this.turn_phase = TURN_PHASE.PLAYER_WAIT_END;
                    break;
                case TURN_PHASE.PLAYER_WAIT_END:
                    this.updateBullet();
                    break;
                case TURN_PHASE.ENEMY_START:
                    this.player.bullet = null;
                    this.updateEnemy();
                    this.turn_phase = TURN_PHASE.END;
                    break;
                case TURN_PHASE.END:
                    this.turn_phase = TURN_PHASE.START;
                    break;
            }
            
            $("#position-p").text('[' + this.turn_phase + '] ' + this.player.name + " at " + this.player.sprite.figure.anchor);
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
                actors_len;
            
            ctx.clearRect(0, 0, this.screen.width, this.screen.height);
            
            this.grid.draw(ctx);
            for (i = 0, actors_len = this.actors.length; i < actors_len; i += 1) {
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
            
        canvas.width  = GAME.screen.width;
        canvas.height = GAME.screen.height;
        GAME.init();
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
