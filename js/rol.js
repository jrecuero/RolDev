/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

// Namespace placeholder
var rol = {};

//(function() {

    /**
     * An enumeration that identifies direction actor is facing.
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
     * An enumeration that identifies what key was pressed and which should be
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
    Figure.prototype.move_to = function(x, y, relative) {
        x = x || (relative ? 0 : this.anchor.x);
        y = y || (relative ? 0 : this.anchor.y);
        
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
        Circle._base_constructor.call(this, x, y);
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
    Circle.prototype.is_inside = function(x, y) {
        var x_distance = Math.pow(x - this.anchor.x, 2);
        var y_distance = Math.pow(y - this.anchor.y, 2);
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
        Rectangle._base_constructor.call(this, x, y);
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
        var x = this.anchor.x;
        var y = this.anchor.y;
        var w = this.width;
        var h = this.height;
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
    Rectangle.prototype.is_inside = function(x, y) {
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
        Pacman._base_constructor.call(this, x, y, r);
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
        var x      = this.anchor.x;
        var y      = this.anchor.y;
        var values = [];
        
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
    }
    
    /**
     * Draw a sprite
     * 
     * @param   { Object } ctx
     *          canvas 2d context
     *          
     * @return  none.
     */    
    Sprite.prototype.draw = function(ctx) {
        ctx.strokeStyle = this.stroke;
        ctx.fillStyle   = this.fill;
        ctx.beginPath();
        this.figure.draw(ctx);
        ctx.fill();
        ctx.stroke();
    }
    
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
    Sprite.prototype.move_to = function(x, y, relative) {
        this.figure.move_to(x, y, relative);
        return this;
    }
        
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
    Sprite.prototype.is_inside = function(x, y) {
        return this.figure.is_inside(x, y);
    }
       
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
        this.name   = name;
        this.sprite = sprite;
        return this;
    }
    
    
    /**
     * Draw an actor
     * 
     * @param   { Object } ctx
     *          canvas 2d context
     *          
     * @return  none.
     */    
    Actor.prototype.draw = function(ctx) {
        this.sprite.draw(ctx);
    }
    
    /**
     * Move actor to a new position
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
    Actor.prototype.move_to = function(x, y, relative) {
        return this.sprite.move_to(x, y, relative);
    };
    
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
        Hero._base_constructor.call(this, name, sprite);
        this.shooting = false;
        return this;
    }
    
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
        Enemy._base_constructor.call(this, name, sprite);
        return this;
    }
    
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
        keys_down: {},
        player: null,
        enemies: [],
        init: function() {
            this.player = new Hero("Hero", new Sprite(new Pacman(10, 10, 10), "green", "blue"));
            this.player.sprite.fill = this.player.shooting ? "red" : "blue";
            this.enemies.push(new Enemy("Goblin", new Sprite(new Rectangle(100, 100, 20, 20), "black", "yellow")),
                              new Enemy("Orc",    new Sprite(new Rectangle(160, 160, 20, 20), "black", "yellow")));
        },
        do_key_down: function(evt) {
            game.keys_down[evt.keyCode] = true;
        },
        do_key_up: function(evt) {
            delete game.keys_down[evt.keyCode];
        },
        check_collision: function(x, y) {
            if ((x >= this.screen.width) || (x <= 0)) {
                return true;
            }
            if ((y >= this.screen.height) || (y <= 0)) {
                return true;
            }
            for (var i = 0; i < this.enemies.length; i++) {
                if (this.enemies[i].sprite.is_inside(x, y) == true) {
                    return true;
                }
            }
            return false;
        },
        update: function() {
            var speed = 20;
            var player_x = this.player.sprite.figure.anchor.x;
            var player_y = this.player.sprite.figure.anchor.y;
            var new_player_x = player_x;
            var new_player_y = player_y;
            
            this.player.shooting = false;
            
            if (KEY.UP.code in this.keys_down) {
                new_player_y -= speed;
                this.player.sprite.figure.facing = KEY.UP.facing;
                delete this.keys_down[KEY.UP.code];
            }
            if (KEY.DOWN.code in this.keys_down) {
                new_player_y += speed;
                this.player.sprite.figure.facing = KEY.DOWN.facing;
                delete this.keys_down[KEY.DOWN.code];
            }
            if (KEY.LEFT.code in this.keys_down) {
                new_player_x -= speed;
                this.player.sprite.figure.facing = KEY.LEFT.facing;
                delete this.keys_down[KEY.LEFT.code];
            }
            if (KEY.RIGHT.code in this.keys_down) {
                new_player_x += speed;
                this.player.sprite.figure.facing = KEY.RIGHT.facing;
                delete this.keys_down[KEY.RIGHT.code];
            }
            if (KEY.SPACE.code in this.keys_down) {
                this.player.shooting = true;
            }
            
            if (this.check_collision(new_player_x, new_player_y) == true) {
                new_player_x = null;
                new_player_y = null;
            }
            
            this.player.move_to(new_player_x, new_player_y, false);
            
            $("#position-p").text(this.player.name + " at " + this.player.sprite.figure.anchor);
        },
        draw: function(ctx) {
            ctx.clearRect(0, 0, this.screen.width, this.screen.height);
            this.player.draw(ctx);
            for (var i = 0; i < this.enemies.length; i++) {
                this.enemies[i].draw(ctx);
            }
        },
        loop: function(ctx) {
            this.update();
            this.draw(ctx);
        }
    };
    
    var init = function() {
        var canvas  = document.getElementById("screen-canvas");
        var context = canvas.getContext("2d");
        canvas.width  = game.screen.width;
        canvas.height = game.screen.height;
        game.init();
        setInterval(function() {game.loop(context);}, 10);
        addEventListener('keydown', game.do_key_down, false);
        addEventListener('keyup', game.do_key_up, false);
    };
    
    $(function() {
        init();
    });
    
//})();
