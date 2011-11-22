/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

// Namespace placeholder
var rol = {};

//(function() {

    /**
     * Enumeration that identifies direction actor is facing.
     * 
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
     * 
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
     * Grid properties
     */
    var GRID = {
        CELL_SIZE: 20
    };

    /**
     * A Class used to store a point identified by x and y coordinates
     * 
     * @constructor
     * 
     * @param   { int } x
     *          x coordinate
     * @param   { int } y
     *          y coordinate
     *          
     * @return  this.
     */
    var Point = function(x, y) {
        this.x = x;
        this.y = y;
        return this;
    };
    
    /**
     * Point as a string.
     * 
     * @return  point formatted as a string.
     */
    Point.prototype.toString = function() {
        return '(' + this.x + ', ' + this.y + ')';
    };    
    
    
    /**
     * Basic figure class.
     * 
     * @constructor
     * 
     * @param   { int } x
     *          figure anchor x coordinate
     * @param   { int } y
     *          figure anchor y coordinate
     *          
     * @return  this.
     */
    var Figure = function(x, y) {
        this.anchor = new Point(x, y);
        this.facing = FACING.NONE;
        return this;
    };
    
    /**
     * Move figure to a new position
     * 
     * @param   { int } x
     *          new x coordinate
     * @param   { int } y
     *          new y coordinate
     * @param   { boolean } relative
     *          if true, x and y are relative coordinates to the anchor.
     *          if false, x and y are absolute coordinates.
     * 
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
     * Circle class.
     * 
     * @constructor
     * 
     * @param   { int } x
     *          circle center x coordinate
     * @param   { int } y
     *          circle center y coordinate         
     * @param   { int } r
     *          circle ratio
     *          
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
     * 
     * @param   { Object } ctx
     *          canvas 2d context
     *          
     * @return  none.
     */
    Circle.prototype.draw = function(ctx) {
        ctx.arc(this.anchor.x, this.anchor.y, this.ratio, 0, Math.PI * 2, false);
    };
    /**
     * Checks if a point given by x & y coordinate is inside the circle.
     * 
     * @param   { int } x
     *          x coordinate.
     * @param   { int } y
     *          y coordinate.
     *
     * @return  true if coordinate is inside the circle. false if not.          
     */
    Circle.prototype.isInside = function(x, y) {
        var x_distance = Math.pow(x - this.anchor.x, 2),
            y_distance = Math.pow(y - this.anchor.y, 2);
        return ((x_distance + y_distance) < Math.pow(this.ratio, 2));
    };
    
    
    /**
     * Rectangle class.
     * 
     * @constructor
     * 
     * @param   { int } x
     *          rectangle left top corner x coordinate
     * @param   { int } y
     *          rectangle left top corner y coordinate         
     * @param   { int } w
     *          rectangle width
     * @param   { int } h
     *          rectangle height
     *          
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
     * Draw a rectangle
     * 
     * @param   { Object } ctx
     *          canvas 2d context
     *          
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
     * 
     * @param   { int } x
     *          x coordinate.
     * @param   { int } y
     *          y coordinate.
     *
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
     * Pacman class.
     * 
     * @constructor
     * 
     * @param   { int } x
     *          pacman center x coordinate
     * @param   { int } y
     *          pacman center y coordinate         
     * @param   { int } r
     *          pacman ratio
     *          
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
     * Draw a pacman
     * 
     * @param   { Object } ctx
     *          canvas 2d context
     *          
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
    
    
    var Bullet = function(x, y, direction) {
        Bullet._baseConstructor.call(this, x, y, 5);
        this.direction = direction;
        return this;
    };
    
    jcRap.extend(Bullet, Circle);
    
    Bullet.prototype.moveFrame = function() {
        var bullet_speed = GRID.CELL_SIZE;
        
        switch (this.direction) {
        case FACING.UP:
            this.anchor.y -= bullet_speed;
            break;
        case FACING.DOWN:
            this.anchor.y += bullet_speed;
            break;
        case FACING.LEFT:
            this.anchor.x -= bullet_speed;
            break;
        case FACING.RIGHT:
            this.anchor.x += bullet_speed;
            break;
        case FACING.NONE:
        default:
            break;
        }
    };


    /**
     * Sprite class.
     * 
     * @constructor
     * 
     * @param   { Figure } figure
     *          figure to be used as the sprite
     * @param   { string } stroke
     *          sprite stroke color
     * @param   { string } fill
     *          sprite fill color
     * 
     * @return  this
     */
    var Sprite = function(figure, stroke, fill) {
        this.figure = figure;
        this.stroke = stroke;
        this.fill   = fill;
        return this;
    };
    
    Sprite.prototype.getOrigin = function() {
        return this.figure.anchor;
    };
    
    Sprite.prototype.getFacing = function() {
        return this.figure.facing;
    };
    
    Sprite.prototype.setFacing = function(facing) {
        this.figure.facing = facing;
    };
    
    Sprite.prototype.moveFrame = function() {
        if (this.figure && (typeof this.figure.moveFrame === 'function')) {
            this.figure.moveFrame();
        }
    };
    
    /**
     * Draw a sprite
     * 
     * @param   { Object } ctx
     *          canvas 2d context
     *          
     * @return  none.
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
     * Move sprite to a new position
     * 
     * @param   { int } x
     *          new x coordinate
     * @param   { int } y
     *          new y coordinate
     * @param   { boolean } relative
     *          if true, x and y are relative coordinates to the anchor.
     *          if false, x and y are absolute coordinates.
     * 
     * @return  this
     */    
    Sprite.prototype.moveTo = function(x, y, relative) {
        this.figure.moveTo(x, y, relative);
        return this;
    };
        
    /**
     * Checks if a point given by x & y coordinate is inside the sprie.
     * 
     * @param   { int } x
     *          x coordinate.
     * @param   { int } y
     *          y coordinate.
     *
     * @return  true if coordinate is inside the sprite. false if not.          
     */
    Sprite.prototype.isInside = function(x, y) {
        return this.figure.isInside(x, y);
    };
    
    Sprite.prototype.checkCollision = function(x, y, objects) {
        var i;

        if ((x >= game.screen.width) || (x <= 0)) {
            return true;
        }
        if ((y >= game.screen.height) || (y <= 0)) {
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
     * 
     * @constructor
     * 
     * @param   { string } name
     *          game object name
     *          
     * @return  this
     */    
    var GameObject = function(name) {
        this.name    = name;
        this.sprite  = null;
        this.visible = true;
        this.solid   = true;
    }
    
    GameObject.prototype.getOrigin = function() {
        return this.sprite && this.sprite.getOrigin();
    };
    
    GameObject.prototype.getFacing = function() {
        return this.sprite && this.sprite.getFacing();        
    };
    
    
    GameObject.prototype.setFacing = function(facing) {
        this.sprite && this.sprite.setFacing(facing);
    };    
    
    GameObject.prototype.checkCollision = function(x, y, objects) {
        return this.sprite.checkCollision(x, y, objects);
    };
    
    /**
     * Draw a game object
     * 
     * @param   { Object } ctx
     *          canvas 2d context
     *          
     * @return  none.
     */    
    GameObject.prototype.draw = function(ctx) {
        this.sprite.draw(ctx);
        if (this.bullet_sprite) {
            this.bullet_sprite.draw(ctx);
        }
    };
    
    /**
     * Move game object to a new position
     * 
     * @param   { int } x
     *          new x coordinate
     * @param   { int } y
     *          new y coordinate
     * @param   { boolean } relative
     *          if true, x and y are relative coordinates to the anchor.
     *          if false, x and y are absolute coordinates.
     * 
     * @return  this
     */        
    GameObject.prototype.moveTo = function(x, y, relative) {
        return this.sprite.moveTo(x, y, relative);
    };
      
      
    /**
     * Actor class.
     * 
     * @constructor
     * 
     * @param   { string } name
     *          actor name
     * @param   { Sprite } sprite
     *          sprite that represents the hero
     *          
     * @return  this
     */
    var Actor = function(name, sprite) {
        Actor._baseConstructor.call(this, name);
        this.sprite = sprite;
        return this;
    };
    
    jcRap.extend(Actor, GameObject);
    
    
    /**
     * Hero class
     * 
     * @constructor
     * 
     * @param   { string } name
     *          hero name
     * @param   { Sprite } sprite
     *          sprite that represents the hero
     *          
     * @return  this
     */
    var Hero = function(name, sprite) {
        Hero._baseConstructor.call(this, name, sprite);
        this.shooting = false;
        return this;
    };
    
    // Hero extends Actor
    jcRap.extend(Hero, Actor);
    
    /**
     * Enemy class
     * 
     * @constructor
     * 
     * @param   { string } name
     *          enemy name
     * @param   { Sprite } sprite
     *          sprite that represents the enemy
     *          
     * @return  this
     */
    var Enemy = function(name, sprite) {
        Enemy._baseConstructor.call(this, name, sprite);
        return this;
    };
    
    // Enemy extends Actor
    jcRap.extend(Enemy, Actor);
    
    /**
     * game variable
     * 
     */
    var game = {
        screen: {
            width:  200,
            height: 200
        },
        loop_timeout: 10,
        keys_down: {},
        player: null,
        enemies: [],
        actor_sprites: [],
        turn_phase: TURN_PHASE.NONE,
        init: function() {
            var i;
            
            this.player = new Hero("Hero", new Sprite(new Pacman(10, 10, GRID.CELL_SIZE/2), "green", "blue"));
            //this.player.sprite.fill = function() { that.player.shooting ? "red" : "blue"; };
            this.enemies.push(new Enemy("Goblin", new Sprite(new Rectangle(100, 100, GRID.CELL_SIZE, GRID.CELL_SIZE), "black", "yellow")),
                              new Enemy("Orc",    new Sprite(new Rectangle(160, 160, GRID.CELL_SIZE, GRID.CELL_SIZE), "black", "yellow")));
            this.turn_phase = TURN_PHASE.START;
            
            this.actor_sprites.push(this.player.sprite);
            for (i = 0; i < this.enemies.length; i += 1) {
                this.actor_sprites.push(this.enemies[i].sprite);
            }
        },
        doKeyDown: function(evt) {
            game.keys_down[evt.keyCode] = true;
        },
        doKeyUp: function(evt) {
            delete game.keys_down[evt.keyCode];
        },
        movePlayer: function() {
            var player_origin = this.player.getOrigin(),
                player_x = player_origin.x,
                player_y = player_origin.y,
                new_player_x = player_x,
                new_player_y = player_y,
                move = false;
            
            this.player.shooting = false;
            
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
                this.player.shooting = true;
                this.turn_phase = TURN_PHASE.PLAYER_ACT;
            }
            
            if (move) {
                this.turn_phase = TURN_PHASE.ENEMY_START;
            }            
            
            if (this.player.checkCollision(new_player_x, new_player_y, this.actor_sprites) !== false) {
                new_player_x = null;
                new_player_y = null;
            }
            
            this.player.moveTo(new_player_x, new_player_y, false);
        },
        moveEnemy: function() {
            var i,
                enemies_len;
            
            for (i = 0, enemies_len = this.enemies.length; i < enemies_len; i += 1) {
                var enemy_origin = this.enemies[i].getOrigin();
                var new_x = enemy_origin.x - GRID.CELL_SIZE / 2 ;
                var new_y = enemy_origin.y - GRID.CELL_SIZE / 2;
                if (this.enemies[i].checkCollision(new_x, new_y, this.actor_sprites) === false) {
                    new_x -= GRID.CELL_SIZE / 2;
                    new_y -= GRID.CELL_SIZE / 2;
                } else {
                    new_x = null;
                    new_y = null;
                }

                this.enemies[i].moveTo(new_x, new_y, false);
            }
        },
        shoot: function() {
            var player = this.player,
                player_origin = player.getOrigin();
                
            player.bullet_sprite = new Sprite(new Bullet(player_origin.x, player_origin.y, player.getFacing()), "black", "red");
        },
        updatePlayer: function() {
            this.movePlayer();
        },
        updateEnemy: function() {
            this.moveEnemy();
        },
        updateBullet: function() {
            var bullet_sprite = this.player.bullet_sprite,
                bullet_origin = bullet_sprite.getOrigin(),
                collision;
            bullet_sprite.moveFrame();
            collision = bullet_sprite.checkCollision(bullet_origin.x, bullet_origin.y, this.actor_sprites);
            if (collision === true) {
                this.turn_phase = TURN_PHASE.ENEMY_START;
                console.log("Bullet out of screen");
            } else if (collision !== false) {
                this.turn_phase = TURN_PHASE.ENEMY_START;
                console.log("Bullet hit " + collision.name);
            }
        },
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
                    this.player.bullet_sprite = null;
                    this.updateEnemy();
                    this.turn_phase = TURN_PHASE.END;
                    break;
                case TURN_PHASE.END:
                    this.turn_phase = TURN_PHASE.START;
                    break;
            }
            
            $("#position-p").text('[' + this.turn_phase + '] ' + this.player.name + " at " + this.player.sprite.figure.anchor);
        },
        draw: function(ctx) {
            var i,
                enemies_len;
            
            ctx.clearRect(0, 0, this.screen.width, this.screen.height);
            this.player.draw(ctx);
            for (i = 0, enemies_len = this.enemies.length; i < enemies_len; i += 1) {
                this.enemies[i].draw(ctx);
            }
        },
        loop: function(ctx) {
            this.update();
            this.draw(ctx);
        }
    };
    
    var init = function() {
        var canvas  = document.getElementById("screen-canvas"),
            context = canvas.getContext("2d");
            
        canvas.width  = game.screen.width;
        canvas.height = game.screen.height;
        game.init();
        setInterval(function() {game.loop(context);}, game.loop_timeout);
        addEventListener('keydown', game.doKeyDown, false);
        addEventListener('keyup', game.doKeyUp, false);
    };
    
    $(function() {
        init();
    });
    
//})();
