/**
 * @fileOverview    <b>rol.js</b> file all information related with the game.
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
 * Game Object class.
 * @class Game Object
 * @property {string} name Game object name
 * @property {ROL.Sprite} sprite Game object sprite
 * @property {boolean} visible Game object visible or hiden
 * @property {boolean} solid Game object solid or not
 * @property {int} x cell coordinate x
 * @property {int} y cell coordinate y
 * @property {ROL.Facing} facing Game object facing direction
 * @constructor
 * @param   {string} name
 *          game object name
 * @return  this
 */    
ROL.GameObject = function(name) {
    this.name    = name;
    this.sprite  = null;
    this.visible = true;
    this.solid   = true;
    this.x       = 0;
    this.y       = 0;
    this.facing  = ROL.Facing.NONE;
};

/**
 * Gets game object cell position.
 * @public
 * @function
 * @return  {ROL.Point} cell point
 */
ROL.GameObject.prototype.getCell = function() {
    return new ROL.Point(this.x, this.y);
};

/**
 * Sets game object cell position.
 * @public
 * @function
 * @param   {int} x cell x coordinate
 * @param   {int} y cell y coordinate
 * @return  none
 */
ROL.GameObject.prototype.setCell = function(x, y) {
    this.x = x;
    this.y = y;
    this.sprite && this.sprite.setOrigin(x, y);
};

/**
 * Sets game object sprite figure facing direction.
 * @public
 * @function
 * @param   {ROL.Facing} facing
 *          new facing direction
 * @return  none
 */
ROL.GameObject.prototype.setFacing = function(facing) {
    this.facing = facing;
    this.sprite && (this.sprite.facing = facing);
};    

/**
 * Checks if game object collides with any other game objects.
 * @public
 * @function
 * @param   {int} x cell coordinate x for checking collision
 * @param   {int} y cell coordinate y for checking collision
 * @param   {Array} objects {@link Array} of {@link ROL.GameObject} for checking collisions
 * @return  {ROL.GameObject} if it collides with other game object. 
 *          <p><b>true</b> if it is out of screen.
 *          <p><b>false</b> if it doesn't collide inside the canvas.
 */
ROL.GameObject.prototype.checkCollision = function(x, y, objects) {
    var i;

    if ((x >= ROL.Game.screen.x_cells) || (x < 0)) {
        return true;
    }
    if ((y >= ROL.Game.screen.y_cells) || (y < 0)) {
        return true;
    }
    for (i = 0; i < objects.length; i += 1) {
        if (this !== objects[i]) {
            if (objects[i].getCell().equal(x, y) === true) {
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
ROL.GameObject.prototype.moveFrame = function() {
    return this.sprite && this.sprite.moveFrame();
};

/**
 * Draws a game object
 * @public
 * @function
 * @param   {Context} ctx
 *          canvas 2d context
 * @return  none.
 */    
ROL.GameObject.prototype.draw = function(ctx) {
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
ROL.GameObject.prototype.moveTo = function(x, y, relative) {
    x = x === null ? this.x : x;
    y = y === null ? this.y : y;
    this.setCell(x, y);
    return this.sprite.moveTo(x, y, relative);
};


/**
 * Bullet game object.
 * @class Bullet object
 * @augments ROL.GameObject
 * @constructor
 * @property {ROL.GameObject} owner bullet owner
 * @property {ROL.Facing} direction directin bullet travels
 * @param   {int} x bullet x coordinate
 * @param   {int} y bullet y coordinate
 * @param   {ROL.GameObject} owner bullet owner
 * @param   {ROL.Facing} direction direction bullet travels
 */
ROL.Bullet = function(x, y, owner, direction) {
    var ratio = 5,
        figure;

    ROL.Bullet._base_constructor.call(this, "bullet");
    this.owner       = owner;
    figure           = new ROL.Circle(x, y, ratio, ROL.Game.grid.cell_size);
    this.sprite      = new ROL.Sprite(figure);
    this.sprite.fill = "red";
    this.direction   = direction;
    this.setCell(x, y);
    return this;
};

jcRap.Framework.extend(ROL.Bullet, ROL.GameObject);

/**
 * @methodOf
 */
ROL.Bullet.prototype.moveFrame = function() {
    var bullet_speed = 1,
        cell = this.getCell();

    switch (this.direction) {
    case ROL.Facing.UP:
        cell.y -= bullet_speed;
        break;
    case ROL.Facing.DOWN:
        cell.y += bullet_speed;
        break;
    case ROL.Facing.LEFT:
        cell.x -= bullet_speed;
        break;
    case ROL.Facing.RIGHT:
        cell.x += bullet_speed;
        break;
    case ROL.Facing.NONE:
    default:
        break;
    }

    this.moveTo(cell.x, cell.y, false);
};


/**
 * Actor game object.
 * @class Actor game object
 * @augments ROL.GameObject
 * @constructor
 * @param   {string} name actor name
 * @param   {ROL.Sprite} sprite sprite that represents the hero
 * @return  this
 */
ROL.Actor = function(name, sprite) {
    ROL.Actor._base_constructor.call(this, name);
    this.sprite = sprite;
    return this;
};

jcRap.Framework.extend(ROL.Actor, ROL.GameObject);

/**
 * Actor gets damage.
 * @public
 * @function
 * @param   {int} dmg damage value
 * @return  none
 * TODO - To be implemented.
 */
ROL.Actor.prototype.damage = function(dmg) {
    dmg = dmg || 0;
};

/**
 * Check if actor is alive.
 * @public
 * @function
 * @return  <b>true</b> actor is alive.
 *          <p><b>false</b> actor is not alive.
 * TODO - to be implemented.
 */
ROL.Actor.prototype.isAlive = function() {
    return false;
};


/**
 * Hero game object.
 * @class Hero game object
 * @augments ROL.Actor
 * @constructor
 * @param   {string} name hero name
 * @param   {ROL.Sprite} sprite sprite that represents the hero
 * @return  this
 */
ROL.Hero = function(name, sprite) {
    ROL.Hero._base_constructor.call(this, name, sprite);
    return this;
};

// ROL.Hero extends ROL.Actor
jcRap.Framework.extend(ROL.Hero, ROL.Actor);


/**
 * Enemy game object.
 * @class Enemy game object
 * @augments ROL.Actor
 * @constructor
 * @param   {string} name enemy name
 * @param   {ROL.Sprite} sprite sprite that represents the enemy
 * @return  this
 */
ROL.Enemy = function(name, sprite) {
    ROL.Enemy._base_constructor.call(this, name, sprite);
    return this;
};

// ROL.Enemy extends ROL.Actor
jcRap.Framework.extend(ROL.Enemy, ROL.Actor);


/**
 * Main game object
 * @class Main Game Object
 * @property {Object} screen Screen Width and Height
 * @property {ROL.Grid}   grid Game grid
 * @property {int}    loop_timeout Game timeout between updates
 * @property {Object} keys_down Keys pressed at any time
 * @property {ROL.Hero}   player Player {@link ROL.Hero} actor
 * @property {Array}  enemies Array of {@link ROL.Enemy}
 * @property {Array} bullets Array of {@link ROL.Bullet}
 * @property {Array}  actors Arrays of {@link ROL.Actor}
 * @property {ROL.TurnPhase} turn_phase Game turn phase
 */
ROL.Game = {
    screen: {
        cell_size: 20,
        x_cells: 20,
        y_cells: 20,
        width:  0,
        height: 0
    },
    grid: null,
    loop_timeout: 30,
    keys_down: {},
    player: null,
    enemies: [],
    bullets: [],
    actors: [],
    turn_phase: ROL.TurnPhase.NONE,
    /**
     * Initializes game object
     * @public
     * @function
     */
    init: function() {
        this.screen.width  = this.screen.cell_size * this.screen.x_cells;
        this.screen.height = this.screen.cell_size * this.screen.y_cells;
        this.grid = new ROL.Grid(this.screen.cell_size, this.screen.width, this.screen.height);
        this.player = this.createPlayer();
        this.turn_phase = ROL.TurnPhase.START;            
        this.addActor(this.player);
        this.createEnemy();
    },
    /**
     * Create a new player.
     * @public
     * @function
     * @return  {ROL.Actor} new player
     */
    createPlayer: function() {
        var cell,
            figure,
            sprite,
            player;

        cell   = new ROL.Point(0, 0);
        figure = new ROL.Pacman(cell.x, cell.y, this.grid.cell_size/2, this.grid.cell_size);
        sprite = new ROL.Sprite(figure);
        sprite.stroke = "green";
        sprite.fill   = "blue";
        player = new ROL.Hero("Hero", sprite);
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

        cell = new ROL.Point(Math.floor(Math.random() * this.screen.x_cells),
                         Math.floor(Math.random() * this.screen.y_cells));
        figure = new ROL.Rectangle(cell.x, cell.y, this.grid.cell_size, this.grid.cell_size, this.grid.cell_size);
        sprite = new ROL.Sprite(figure);
        sprite.stroke = "black";
        sprite.fill   = "red";
        enemy  = new ROL.Enemy("Goblin", sprite);
        enemy.setCell(cell.x, cell.y);
        do {
            if (enemy.checkCollision(cell.x, cell.y, this.actors) === false) {
                empty_cell = true;
            } else {
                cell = new ROL.Point(Math.floor(Math.random() * this.screen.x_cells),
                                 Math.floor(Math.random() * this.screen.y_cells));
                enemy.setCell(cell.c, cell.y);
            }
        } while(!empty_cell);
        this.enemies.push(enemy);
        this.addActor(enemy);
    },        
    /**
     * Key Down event handler.
     * @public
     * @event
     * @param   {Event} evt event
     * @return  none
     */
    doKeyDown: function(evt) {
        ROL.Game.keys_down[evt.keyCode] = true;
    },
    /**
     * Key Up event handler.
     * @public
     * @event
     * @param   {Event} evt event
     * @return  none
     */
    doKeyUp: function(evt) {
        delete ROL.Game.keys_down[evt.keyCode];
    },
    /**
     * Process a move key pressed by the player.
     * @public
     * @function
     * @param   {ROL.Key} key key to test.
     * @return  <b>true</b> if there is a change in the state.
     *          <p><b>false</b> if there is not any change.
     */
    processKey: function(key) {
        delete this.keys_down[key.code];
        if (ROL.Key.SPACE.code === key.code) {
            this.turn_phase = ROL.TurnPhase.PLAYER_ACT;
        }
        return null;
    },
    /**
     * Process a move key pressed by the player.
     * @public
     * @function
     * @param   {ROL.Key} key key pressed.
     * @param   {int} cell player cell.
     * @return  new cell postion after key has processed.
     */
    processMoveKey: function(key, cell) {
        var step = 1;
        this.player.setFacing(key.facing);
        delete this.keys_down[key.code];
        return key.move(cell, step);
    },
    /**
     * Moves player.
     * @description <p>This method process all key pressed by the user.
     *              <p>All those keys are stored in {@link ROL.Game.keys_down}
     *              and they are inserted by events {@link ROL.Game.doKeyUp}
     *              and {@link ROL.Game.doKeyDown}.
     *              <p>It checks if any possible key is in that object
     *              and process every keystroke calling 
     *              {@link ROL.Game.processMoveKey} if the key is a movement
     *              key or {@link ROL.Game.processKey} for any other keystroke.
     *              <p>Move could be accumulated if more than one keystrokes
     *              are found in the buffer object.
     * @public
     * @function
     * @return  none
     */
    movePlayer: function() {
        var player_cell = this.player.getCell(),
            move = false,
            k,
            key;

        for (k in ROL.Key) {
            key = ROL.Key[k];
            if (this.keys_down.hasOwnProperty(key.code)) {
                 // Player cell is reused, it allows to add more than one
                 // key pressed move at the same time, because all changes
                 // are accumulated.
                player_cell = key.move_key ? this.processMoveKey(key, player_cell) : this.processKey(key);

                 // If there was a movement key pressed, then move state
                 // should stay, in any other case, it should check if
                 // there was any change in the cell in order to proceed
                 // with a movement.
                move = move || (player_cell !== null);
            }
        }

        if (move) {
            this.turn_phase = ROL.TurnPhase.ENEMY_START;

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
            enemies_len,
            enemy_cell,
            new_cell;

        for (i = 0, enemies_len = this.enemies.length; i < enemies_len; i += 1) {
            enemy_cell = this.enemies[i].getCell();
            new_cell   = new ROL.Point(enemy_cell.x, enemy_cell.y + 1);

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
            bullet;

        cell = ROL.Key[actor.facing].move(actor.getCell(), 1);
        if (cell) {
            bullet = new ROL.Bullet(cell.x, cell.y, actor, actor.facing);            
            this.addBullet(bullet);
        }
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
            remove_bullets = [],
            bullet,
            cell,
            collision;

        for (i = 0, len = this.bullets.length; i < len; i += 1) {
            bullet = this.bullets[i];
            cell   = bullet.getCell();

            bullet.moveFrame();
            collision = bullet.checkCollision(cell.x, cell.y, this.actors);
            if (collision === true) {
                console.log("Bullet out of screen");
                this.turn_phase = ROL.TurnPhase.ENEMY_START;
                remove_bullets.push(bullet);
            } else if (collision !== false) {
                console.log("Bullet hit " + collision.name);
                this.turn_phase = ROL.TurnPhase.ENEMY_START;
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
     * @param   {ROL.Actor} actor
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
     * @param   {ROL.Actor} actor
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
     * @param   {ROL.Bullet} bullet bullet to be added
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
     * @param   {ROL.Bullet} bullet bullet to be removed
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
            case ROL.TurnPhase.START:
                if (this.enemies.length === 0) {
                    this.createEnemy();
                }
                this.turn_phase = ROL.TurnPhase.PLAYER_START;
                break;
            case ROL.TurnPhase.PLAYER_START:
                this.updatePlayer();
                break;
            case ROL.TurnPhase.PLAYER_ACT:
                this.shoot(this.player);
                this.turn_phase = ROL.TurnPhase.PLAYER_WAIT_END;
                break;
            case ROL.TurnPhase.PLAYER_WAIT_END:
                this.updateBullet();
                break;
            case ROL.TurnPhase.ENEMY_START:
                this.updateEnemy();
                this.turn_phase = ROL.TurnPhase.END;
                break;
            case ROL.TurnPhase.END:
                this.turn_phase = ROL.TurnPhase.START;
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
ROL.init = function() {
    var canvas  = document.getElementById("screen-canvas"),
        context = canvas.getContext("2d");

    ROL.Game.init();
    canvas.width  = ROL.Game.screen.width;
    canvas.height = ROL.Game.screen.height;
    setInterval(function() {ROL.Game.loop(context);}, ROL.Game.loop_timeout);
    addEventListener('keydown', ROL.Game.doKeyDown, false);
    addEventListener('keyup', ROL.Game.doKeyUp, false);
};

/**
 * 
 */
$(function() {
    ROL.init();
});
    
