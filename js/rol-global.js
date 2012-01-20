/**
 * @fileOverview    <b>rol-enum.js</b> file with all data enums and global
 *                  data to the game.
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

/**
 * @namespace Global Namespace placeholder
 */
var ROL = {};


/**
 * Enumeration that identifies the game object role.
 * @class Game Object role
 * @description <p>Every game object should have a role in the application,
 *              it could belong to the player party, it could be an
 *              enemy, ...
 * @property {int} NONE         no role.
 * @property {int} PLAYER       belongs to the player party.
 * @property {int} ENEMY        belongs to the enemy party.
 * @property {int} ALLY         belongs to the ally party.
 * @property {int} NPC          non-playable character.
 * @property {int} VENDOR       vendor character.
 * @property {int} STATIC_OBJ   static background object.
 * @property {int} DYNAMIC_OBJ  dynamic background object.
 * @property {int} ALL          all roles to be handled, and total number of
 *                              roles.
 */
ROL.Role = {
    NONE: 0,
    PLAYER: 1,
    ENEMY: 2,
    ALLY: 3,
    NPC: 4,
    VENDOR: 5,
    STATIC_OBJ: 6,
    DYNAMIC_OBJ: 7,
    ALL: 8
};


/**
 * Enumeration that identifies direction game object is facing.
 * @class Game object facing Type
 * @description <p>Every game object should be facing in to a direction
 *              in the canvas.
 * @property {int} NONE no face
 * @property {int} UP face upwards
 * @property {int} DOWN face downwards
 * @property {int} LEFT face leftwards
 * @property {int} RIGHT face rightwards
 */
ROL.Facing = {
    NONE:  "NONE",        
    UP:    "UP", 
    DOWN:  "DOWN", 
    LEFT:  "LEFT", 
    RIGHT: "RIGHT"  
};


/**
 * Enumeration that identifies what key was pressed and which should be
 * the facing direction for that keycode.
 * @class Key pressed
 * @property {Object} NONE
 * @property {Object} UP
 * @property {Object} DOWN
 * @property {Object} LEFT
 * @property {Object} RIGHT
 * @property {Object} SPACE
 */
ROL.Key = {
    /**
     * @class
     * @property {int} code Value is 0.
     * @property {ROL.Facing} facing Value is {@link ROL.Facing.NONE}.
     * @property {boolean} move_key Value is false. It is not a movement
     *              keystroke.
     */
    NONE: {
        code: 0,
        facing: ROL.Facing.NONE,
        move_key: false,
        move: function() {
            return null;
        }
    },
    /**
     * @class
     * @property {int} code Value is 38.
     * @property {ROL.Facing} facing Value is {@link ROL.Facing.UP}.
     * @property {boolean} move_key Value is true. It is a movement
     *              keystroke.
     */
    UP: {
        code: 38,
        facing: ROL.Facing.UP,
        move_key: true,
        move: function(point, step) {
            point.y -= step;
            return point;
        }
    },
    /**
     * @class
     * @property {int} code Value is 40.
     * @property {ROL.Facing} facing Value is {@link ROL.Facing.DOWN}.
     * @property {boolean} move_key Value is true. It is a movement
     *              keystroke.
     */
    DOWN: {
        code: 40,
        facing: ROL.Facing.DOWN,
        move_key: true,
        move: function(point, step) {
            point.y += step;
            return point;
        }
    },
    /**
     * @class
     * @property {int} code Value is 37.
     * @property {ROL.Facing} facing Value is {@link ROL.Facing.LEFT}.
     * @property {boolean} move_key Value is true. It is a movement
     *              keystroke.
     */
    LEFT: {
        code: 37,
        facing: ROL.Facing.LEFT,
        move_key: true,
        move: function(point, step) {
            point.x -= step;
            return point;
        }
    },
    /**
     * @class
     * @property {int} code Value is 39.
     * @property {ROL.Facing} facing Value is {@link ROL.Facing.RIGHT}.
     * @property {boolean} move_key Value is true. It is a movement
     *              keystroke.
     */
    RIGHT: {
        code: 39,
        facing: ROL.Facing.RIGHT,
        move_key: true,
        move: function(point, step) {
            point.x += step;
            return point;
        }
    },
    /**
     * @class
     * @property {int} code Value is 32.
     * @property {ROL.Facing} facing Value is {@link ROL.Facing.SPACE}.
     * @property {boolean} move_key Value is false. It is not a movement
     *              keystroke.
     */
    SPACE: {
        code: 32,
        facing: ROL.Facing.NONE,
        move_key: false,
        move: function() {
            return null;
        }
    },
    S: {
        code: 115,
        facing: ROL.Facing.NONE,
        move_key: false,
        move: function() {
            return null;
        }
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
ROL.TurnPhase = {
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

ROL.State = {
    NONE:   0,
    ADD:    1,
    UPDATE: 2
};

ROL.CellStatus = {
    EMPTY:          0,
    BUSY:           1,
    OUT_OF_STEPS:   2,
    OUT_OF_BOUNDS:  -1
};

ROL.CellStatData = function(status, object) {
    this.status = status || ROL.CellStatus.EMPTY;
    this.object = object || null;
};
