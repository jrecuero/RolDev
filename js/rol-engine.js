/**
 * @fileOverview    <b>rol-engine.js</b> file with the game engine.
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
    if (this.sprite) {
        this.sprite.setOrigin(x, y);
    }
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
    if (this.sprite) {
         this.sprite.facing = facing;
    }
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
    var i,
        result = new ROL.CellStatData();

    if ((x >= ROL.Game.screen.x_cells) || (x < 0) ||
        (y >= ROL.Game.screen.y_cells) || (y < 0)) {
        result.status = ROL.CellStatus.OUT_OF_BOUNDS;
    }
    for (i = 0; i < objects.length; i += 1) {
        if (this !== objects[i]) {
            if (objects[i].getCell().equal(x, y) === true) {
                result.status = ROL.CellStatus.BUSY;
                result.object = objects[i];
            }
        }
    }
    return result;
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
 * Actor game object.
 * @class Actor game object
 * @augments ROL.GameObject
 * @constructor
 * @param   {string} name actor name
 * @param   {ROL.Sprite} sprite sprite that represents the hero
 * @param   {ROL.Role} role     actor role.
 * @return  this
 */
ROL.Actor = function(name, sprite, role) {
    ROL.Actor._base_constructor.call(this, name);
    this.sprite    = sprite;
    this.role      = role !== undefined ? role : ROL.Role.STATIC_OBJ;
    this.live      = 0;
    this.live_now  = 0;
    return this;
};

jcRap.Framework.extend(ROL.Actor, ROL.GameObject);

ROL.Actor.prototype.setLive = function(live) {
    this.live     = live;
    this.live_now = live;
};

/**
 * Actor gets damage.
 * @public
 * @function
 * @param   {int} dmg damage value
 * @return  none
 * TODO - To be implemented.
 */
ROL.Actor.prototype.damage = function(dmg) {
    this.live_now -= dmg || 0;
    if (this.live_now < 0) {
        this.live_now = 0;
    }
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
    return (this.live_now > 0);
};


/**
 * Background static game object.
 * @class Background static game object
 * @augments ROL.Actor
 * @constructor
 * @param   {string} name actor name
 * @param   {ROL.Sprite} sprite sprite that represents the hero
 * @return  this
 */
ROL.BackgroundObject = function(name, sprite) {
    ROL.BackgroundObject._base_constructor.call(this, name, ROL.Role.STATIC_OBJ);
    this.sprite = sprite;
    return this;
};

jcRap.Framework.extend(ROL.BackgroundObject, ROL.Actor);



/**
 * Ammunition game object.
 * @class Ammunition object
 * @augments ROL.GameObject
 * @constructor
 * @property {ROL.GameObject} owner Ammunition owner
 * @property {ROL.Facing} direction Direction ammunition travels
 * @param   {string} name           Ammunition name
 * @param   {ROL.GameObject} owner  Ammunition owner
 * @param   {ROL.Facing} direction  Direction bullet travels
 */
ROL.Ammo = function(name, owner, direction) {
    ROL.Ammo._base_constructor.call(this, name);
    this.owner       = owner;
    this.direction   = direction;
    this.dmg         = 0;
    this.steps       = Number.MAX_VALUE;
    return this;
};

jcRap.Framework.extend(ROL.Ammo, ROL.GameObject);

/**
 * @methodOf
 */
ROL.Ammo.prototype.moveFrame = function() {
    var ammo_speed = 1,
        cell = this.getCell();

    switch (this.direction) {
    case ROL.Facing.UP:
        cell.y -= ammo_speed;
        break;
    case ROL.Facing.DOWN:
        cell.y += ammo_speed;
        break;
    case ROL.Facing.LEFT:
        cell.x -= ammo_speed;
        break;
    case ROL.Facing.RIGHT:
        cell.x += ammo_speed;
        break;
    case ROL.Facing.NONE:
    default:
        break;
    }

    return cell;
};

/**
 *
 */
ROL.Ammo.prototype.hitActor = function(actor) {
    if ((actor.role === ROL.Role.ENEMY) && (this.owner.role === ROL.Role.PLAYER)) {
        /* Player ammo hits an enemy. */
        return true;            
    } else if ((actor.role === ROL.Role.PLAYER) && (this.owner.role === ROL.Role.ENEMY)) {
        /* Enemy ammo hits the player. */
        return true;
    } else if (actor instanceof ROL.Ammo) {
        return true;
    }
    return false;
};


/**
 * Main game object
 * @class Main Game Object
 * @property {Object} screen    Screen Width and Height
 * @property {ROL.Grid} grid    Game grid
 * @property {int} loop_timeout Game timeout between updates
 * @property {Object} keys_down Keys pressed at any time
 * @property {ROL.Actor} player Player {@link ROL.Actor} actor
 * @property {Array} actors     Arrays of {@link ROL.Actor}
 * @property {Array} enemies    Array of {@link ROL.Actor}
 * @property {Array} ammos      Array of (@link ROL.Ammo}
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
    actors: [],
    enemies: [],
    ammos: [],
    key_actions: {},
    update_actions: {},
    turn_phase: ROL.TurnPhase.NONE,
    /**
     * Initializes game object
     * @public
     * @function
     */
    init: function() {
        this.screen.width  = this.screen.cell_size * this.screen.x_cells;
        this.screen.height = this.screen.cell_size * this.screen.y_cells;
        this.grid = new ROL.Grid(this.screen.cell_size, this.screen.x_cells, this.screen.y_cells);
        this.turn_phase = ROL.TurnPhase.START;            
        this.createPlayer();
        this.createEnemy();
    },
    registerActor: function(actor) {
        var role = actor.role,
            cell = actor.getCell();
        
        if (role === ROL.Role.PLAYER) {
            this.player = actor;
        } else if (role === ROL.Role.ENEMY) {
            this.enemies.push(actor);
        } else if (actor instanceof ROL.Ammo) {
            this.registerAmmo(actor);
        }
        this._addActor(actor);
        this.grid.setObjectInCell(cell.x, cell.y, actor);
    },
    registerAmmo: function(ammo) {
        this.ammos.push(ammo);
    },
    unregisterActor: function(actor) {
        var cell,
            found = this._removeActor(actor);
        
        if (found) {
            cell = actor.getCell();
            this.grid.clearObjectInCell(cell.x, cell.y);
            if (actor instanceof ROL.Ammo) {
                this.unregisterAmmo(actor);
            }
        }
        
        return found;
    },
    unregisterAmmo: function(ammo) {
        var len,
            i;

        for (i = 0, len = this.ammos.length; i < len; i += 1) {
            if (ammo === this.ammos[i]) {
                this.ammos.splice(i, 1);
                return;
            }
        }
    },
    _registerAction: function(engine_attr, field, action, params) {
        if (this[engine_attr].hasOwnProperty(field) === false) {
            this[engine_attr][field] = {};
        }
        this[engine_attr][field][action] = {
            callback: action,
            params:   params
        };
    },
    registerKeyAction: function(key, action, params) {
        this._registerAction('key_actions', key, action, params);
    },
    registerUpdateAction: function(state, action, params) {
        this._registerAction('update_actions', state, action, params);
    },
    updateTurnPhase: function(turn_phase) {
        this.turn_phase = turn_phase;
    },
    /**
     * Create a new player.
     * @public
     * @function
     * @return  {ROL.Actor} new player
     */
    createPlayer: function() {
        return null;
    },
    /**
     * Creates a new enemy at a random position inside the grid.
     * @public
     * @function
     * @return  none
     */
    createEnemy: function() {
        return null;
    },
    checkCollision: function(actor, x, y) {
        return this.grid.checkObjectInCell(x, y, actor);
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
        var i,
            action;
        
        delete this.keys_down[key.code];
        if (this.key_actions.hasOwnProperty(key.code)) {
            for (i in this.key_actions[key.code]) {
                if (this.key_actions[key.code].hasOwnProperty(i)) {
                    action = this.key_actions[key.code][i];
                    action.callback(action.params);
                }
            }
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
    moveActor: function(actor, x, y) {
        var cell = actor.getCell();        
        x = (x === null) ? cell.x : x;
        y = (y === null) ? cell.y : y;
        this.grid.clearObjectInCell(cell.x, cell.y);
        actor.moveTo(x, y, false);
        this.grid.setObjectInCell(x, y, actor);
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
            key,
            result;

        for (k in ROL.Key) {
            if (ROL.Key.hasOwnProperty(k)) {
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
        }

        if (move) {
            this.turn_phase = ROL.TurnPhase.ENEMY_START;
            
            result = this.checkCollision(this.player, player_cell.x, player_cell.y);
            if (result.status !== ROL.CellStatus.EMPTY) {
                player_cell.x = null;
                player_cell.y = null;
            }

            this.moveActor(this.player, player_cell.x, player_cell.y);
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
     * Adds a new actor.
     * @public
     * @function
     * @param   {ROL.Actor} actor
     *          new actor to add
     * @return  none
     */
    _addActor: function(actor) {
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
    _removeActor: function(actor) {
        var len,
            i,
            found = false;

        for (i = 0, len = this.actors.length; i < len; i += 1) {
            if (actor === this.actors[i]) {
                this.actors.splice(i, 1);
                found = true;
                break;
            }
        }

        if (found) {
            for (i = 0, len = this.enemies.length; i < len; i += 1) {
                if (actor === this.enemies[i]) {
                    this.enemies.splice(i, 1);
                    break;
                }
            }
        }
        
        return found;
    },
    /**
     * Adds a bullet.
     * @public
     * @function
     * @param   {ROL.Ammo} ammo Ammunition to be added.
     * @return  none
     */
    _addAmmo: function(ammo) {
        return this._updateAmmo(ammo, ROL.State.ADD);
    },
    updateAllAmmo: function(next_phase) {
        var i,
            len,
            to_be_removed = [],
            ammo,
            new_cell;

        for (i = 0, len = this.ammos.length; i < len; i += 1) {
            ammo = this.ammos[i];

            if (ammo.steps === 0) {
                to_be_removed.push(ammo);
            } else {
                new_cell = ammo.moveFrame();
                this._updateAmmo(ammo, ROL.State.UPDATE, new_cell);
            }
            if (to_be_removed.length > 0) {
                for (i = 0, len = to_be_removed.length; i < len; i += 1) {
                    this.unregisterActor(to_be_removed[i]);
                }
            }
        }
        if (this.ammos.length === 0) {
            this.updateTurnPhase(next_phase);
        }
    },
    _updateAmmo: function(ammo, state, new_cell) {
        var collision,
            actor,
            i,
            to_be_removed = [];

        new_cell  = new_cell || ammo.getCell();
        collision = this.checkCollision(ammo, new_cell.x, new_cell.y);
        if (collision.status === ROL.CellStatus.OUT_OF_BOUNDS) {
            console.log(ammo.name + " is out of _bounds");
            if (state === ROL.State.UPDATE) {
                to_be_removed.push(ammo);
            }
        } else if (collision.status === ROL.CellStatus.EMPTY) {
            switch (state) {
            case ROL.State.ADD:
                this.registerActor(ammo);
                break;
            case ROL.State.UPDATE:
                this.moveActor(ammo, new_cell.x, new_cell.y);
                ammo.steps -= 1;
                break;
            default:
                break;
            }
        } else if (collision.status === ROL.CellStatus.BUSY) {
            actor = collision.object;
            if (ammo.hitActor(actor)) {
                console.log(ammo.name + " hit " + actor.name);
                actor.damage(ammo.dmg);
                if (!actor.isAlive()) {
                    this.unregisterActor(actor);
                }
                if (state === ROL.State.UPDATE) {
                    to_be_removed.push(ammo);
                }
            }
        }
        
        if (to_be_removed.length > 0) {
            for (i = 0; i < to_be_removed.length; i += 1) {
                this.unregisterActor(to_be_removed[i]);
            }
        }
        return collision.status;
    },
    _processUpdate: function(state) {
        var i,
            action;
        
        if (this.update_actions.hasOwnProperty(state)) {
            for (i in this.update_actions[state]) {
                if (this.update_actions[state].hasOwnProperty(i)) {
                    action = this.update_actions[state][i];
                    action.callback(action.params);
                }
            }
        }
        return null;
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
                this.updateTurnPhase(ROL.TurnPhase.PLAYER_START);
                break;
            case ROL.TurnPhase.PLAYER_START:
                this.updatePlayer();
                break;
            case ROL.TurnPhase.PLAYER_ACT:
                this._processUpdate(ROL.TurnPhase.PLAYER_ACT);
                break;
            case ROL.TurnPhase.PLAYER_WAIT_END:
                this._processUpdate(ROL.TurnPhase.PLAYER_WAIT_END);
                break;
            case ROL.TurnPhase.PLAYER_END:
                this.updateTurnPhase(ROL.TurnPhase.ENEMY_START);
                break;
            case ROL.TurnPhase.ENEMY_START:
                this.updateTurnPhase(ROL.TurnPhase.ENEMY_ACT);
                break;
            case ROL.TurnPhase.ENEMY_ACT:
                this._processUpdate(ROL.TurnPhase.ENEMY_ACT);
                break;
            case ROL.TurnPhase.ENEMY_WAIT_END:
                this._processUpdate(ROL.TurnPhase.ENEMY_WAIT_END);
                break;
            case ROL.TurnPhase.ENEMY_END:
                this.updateTurnPhase(ROL.TurnPhase.END);
                break;
            case ROL.TurnPhase.END:
                this.updateTurnPhase(ROL.TurnPhase.START);
                break;
        }

        $("#position-p").text('[' + this.turn_phase + '] ' + 
            this.player.name + ' (' + this.player.live_now + ') at ' + this.player.getCell());
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