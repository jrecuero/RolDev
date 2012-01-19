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
 * Bullet game object.
 * @class Bullet object
 * @augments ROL.Ammo
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

    ROL.Bullet._base_constructor.call(this, "bullet", owner, direction);
    figure           = new ROL.Circle(x, y, ratio, ROL.Game.grid.cell_size);
    this.sprite      = new ROL.Sprite(figure);
    this.sprite.fill = "red";
    this.setCell(x, y);
    return this;
};

jcRap.Framework.extend(ROL.Bullet, ROL.Ammo);


/**
 * Hero game object.
 * @class Hero game object
 * @augments ROL.Actor
 * @constructor
 * @param   {ROL.Game} game rol game instance.
 * @param   {string} name   hero name.
 * @return  this
 */
ROL.Hero = function(game, name) {
    var cell = new ROL.Point(0, 0);
    
    ROL.Hero._base_constructor.call(this, name, (function () {
            var figure,
                sprite;

            figure = new ROL.Pacman(cell.x, cell.y, game.grid.cell_size/2, game.grid.cell_size);
            sprite = new ROL.Sprite(figure);
            sprite.stroke = "green";
            sprite.fill   = "blue";
            return sprite;
        }()), ROL.Role.PLAYER);
    this.setCell(cell.x, cell.y);
    this.setLive(100);
    
    return this;
};

// ROL.Hero extends ROL.Actor
jcRap.Framework.extend(ROL.Hero, ROL.Actor);


/**
 * Enemy game object.
 * @class Enemy game object
 * @augments ROL.Actor
 * @constructor
 * @param   {ROL.Game} game rol game instance.
 * @param   {string} name   enemy name
 * @return  this
 */
ROL.Enemy = function(game, name) {
    var cell,
        enemy = this;
    
    ROL.Enemy._base_constructor.call(this, name, (function() {
            var figure,
                sprite,
                empty_cell = false,
                result;

            cell = new ROL.Point(Math.floor(Math.random() * game.screen.x_cells),
                                 Math.floor(Math.random() * game.screen.y_cells));
            figure = new ROL.Rectangle(cell.x, cell.y, game.grid.cell_size, game.grid.cell_size, game.grid.cell_size);
            sprite = new ROL.Sprite(figure);
            sprite.stroke = "black";
            sprite.fill   = "red";
            do {
                result = game.checkCollision(enemy, cell.x, cell.y);
                if (result.status === ROL.CellStatus.EMPTY) {
                    empty_cell = true;
                } else {
                    cell = new ROL.Point(Math.floor(Math.random() * game.screen.x_cells),
                                         Math.floor(Math.random() * game.screen.y_cells));
                }
            } while(!empty_cell);
            return sprite;
        }()), ROL.Role.ENEMY);
    this.setCell(cell.x, cell.y);
    this.setLive(10);
    return this;
};

// ROL.Enemy extends ROL.Actor
jcRap.Framework.extend(ROL.Enemy, ROL.Actor);


ROL.Pillar = function(game, x, y) {
    ROL.Pillar._base_constructor.call(this, "Pillar", (function() {
        var cell,
            figure,
            sprite;

        cell = new ROL.Point(x, y);
        figure = new ROL.Rectangle(cell.x, cell.y, game.grid.cell_size, game.grid.cell_size, game.grid.cell_size);
        sprite = new ROL.Sprite(figure);
        sprite.stroke = "black";
        sprite.fill   = "blue";
        return sprite;
    }()));
    this.setCell(x, y);
    return this;
};

// ROL.Enemy extends ROL.Actor
jcRap.Framework.extend(ROL.Pillar, ROL.BackgroundObject);


/* Customize ROL.Game object with specific information for the game to
 * play.
 */
ROL.Game.createPlayer = function () {
    var player = new ROL.Hero(ROL.Game, "Hero");
    this.registerActor(player);
    return player;
};

/**
 *
 */
ROL.Game.createEnemy = function () {
    var enemy = new ROL.Enemy(ROL.Game, "Goblin");
    this.registerActor(enemy);
    return enemy;
};


/**
 * Specific Game Objects.
 */
ROL.Game.rol = {};


/**
 * @function
 */
ROL.Game.rol.updateEnemy = function(game) {
    var i,
        enemy,
        enemies_len,
        enemy_cell,
        new_cell,
        player_cell,
        move  = true,
        shoot = false,
        facing = null,
        bullet,
        status,
        result;

    player_cell = game.player.getCell();

    for (i = 0, enemies_len = game.enemies.length; i < enemies_len; i += 1) {
        enemy      = game.enemies[i];
        enemy_cell = enemy.getCell();

        new_cell = new ROL.Point(enemy_cell.x, enemy_cell.y);
        if (player_cell.x > enemy_cell.x) {
            new_cell.x = enemy_cell.x + 1;
        } else if (player_cell.x < enemy_cell.x) {
            new_cell.x = enemy_cell.x - 1;
        } else {
            move  = false;
            shoot = true;
            if (player_cell.y > enemy_cell.y) {
                facing = ROL.Facing.DOWN;
            } else {
                facing = ROL.Facing.UP;
            }
        }

        if (!shoot) {
            if (player_cell.y > enemy_cell.y) {
                new_cell.y = enemy_cell.y + 1;
            } else if (player_cell.y < enemy_cell.y) {
                new_cell.y = enemy_cell.y - 1;
            } else {
                move  = false;
                shoot = true;
                if (player_cell.x > enemy_cell.x) {
                    facing = ROL.Facing.RIGHT;
                } else {
                    facing = ROL.Facing.LEFT;
                }
            } 
        }

        if (move) {
            result = game.checkCollision(enemy, new_cell.x, new_cell.y);
            if (result.status !== ROL.CellStatus.EMPTY) {
                new_cell.x = null;
                new_cell.y = null;
            }

            game.moveActor(enemy, new_cell.x, new_cell.y);
        } else {
            new_cell = ROL.Key[facing].move(enemy_cell, 1);
            if (new_cell) {
                bullet = new ROL.Bullet(new_cell.x, new_cell.y, enemy, facing);
                bullet.dmg   = 10;
                bullet.steps = 2;
                status = game._addAmmo(bullet);
                if (status === ROL.CellStatus.EMPTY) {
                    game.updateTurnPhase(ROL.TurnPhase.ENEMY_WAIT_END);
                } else {
                    game.updateTurnPhase(ROL.TurnPhase.ENEMY_END);
                }
                return;
            }
        }
    }
    game.updateTurnPhase(ROL.TurnPhase.ENEMY_END);
};


/**
 * Player shooting.
 * @public
 * @function
 * @return  none
 */
ROL.Game.rol.shoot =  function(actor, damage, facing) {
    var game = ROL.Game,
        cell = actor.getCell(),
        bullet,
        status;

    facing = facing || actor.facing;
    damage = damage || 10;
    cell = ROL.Key[facing].move(actor.getCell(), 1);
    if (cell) {
        bullet     = new ROL.Bullet(cell.x, cell.y, actor, facing);   
        bullet.dmg = damage;
        status     = game._addAmmo(bullet);
        if (status === ROL.CellStatus.EMPTY) {
            game.updateTurnPhase(ROL.TurnPhase.PLAYER_WAIT_END);
        } else {
            game.updateTurnPhase(ROL.TurnPhase.PLAYER_END);
        }
    }
};

/**
 * @description Shot four bullets every one in a different direction.
 */
ROL.Game.rol.multishoot = function(actor) {
    ROL.Game.rol.shoot(actor, 10, ROL.Facing.UP);
    ROL.Game.rol.shoot(actor, 10, ROL.Facing.DOWN);
    ROL.Game.rol.shoot(actor, 10, ROL.Facing.LEFT);
    ROL.Game.rol.shoot(actor, 10, ROL.Facing.RIGHT);
};

/**
 * Update player bullet.
 * @public
 * @function
 * @return  none
 */
ROL.Game.rol.updateBullet = function(next_phase) {
    var game = ROL.Game,
        i,
        len,
        remove_bullets = [],
        bullet,
        new_cell,
        collision,
        actor;

    for (i = 0, len = game.ammos.length; i < len; i += 1) {
        bullet = game.ammos[i];

        if (bullet.steps === 0) {
            game.updateTurnPhase(next_phase);
            remove_bullets.push(bullet);
        } else {
            new_cell = bullet.moveFrame();
            collision = game.checkCollision(bullet, new_cell.x, new_cell.y);
            if (collision.status === ROL.CellStatus.OUT_OF_BOUNDS) {
                console.log("Bullet out of screen");
                game.updateTurnPhase(next_phase);
                remove_bullets.push(bullet);
            } else if (collision.status === ROL.CellStatus.EMPTY) {
                game.moveActor(bullet, new_cell.x, new_cell.y);
                bullet.steps -= 1;
            } else if (collision.status === ROL.CellStatus.BUSY) {
                actor = collision.object;
                if (bullet.hitActor(actor)) {
                    console.log("Bullet hit " + actor.name);
                    actor.damage(bullet.dmg);
                    if (!actor.isAlive()) {
                        game.unregisterActor(actor);
                    }
                }
                game.updateTurnPhase(next_phase);
                remove_bullets.push(bullet);
            }
        }

        if (remove_bullets.length > 0) {
            for (i = 0, len = remove_bullets.length; i < len; i += 1) {
                game.unregisterActor(remove_bullets[i]);
            }
        }
    }
};

/**
 *
 */
ROL.Game.rol.createBackground = function() {
    var row, col,
        figure,
        sprite;
    
    for (row = 0; row < ROL.Game.screen.y_cells; row += 1) {
        for (col = 0; col < ROL.Game.screen.x_cells; col += 1) {
            figure = new ROL.Rectangle(col, row, ROL.Game.grid.cell_size, ROL.Game.grid.cell_size, ROL.Game.grid.cell_size);
            sprite = new ROL.Sprite(figure);
            sprite.stroke = "black";
            sprite.fill   = row % 2 ? (col % 2 ? "green" : "yellow") : (col % 2 ? "cyan" : "white");
            ROL.Game.grid.setBackgroundInCell(col, row, sprite);
        }
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
    
    ROL.Game.rol.createBackground();
    
    ROL.Game.registerActor(new ROL.Pillar(ROL.Game, 10, 10));
    
    ROL.Game.registerKeyAction(ROL.Key.SPACE.code, 
                               function(game) {
                                    game.updateTurnPhase(ROL.TurnPhase.PLAYER_ACT);
                               }, 
                               ROL.Game);
    
    ROL.Game.registerUpdateAction(ROL.TurnPhase.PLAYER_ACT, 
                                  function(game){
                                    game.rol.shoot(game.player);
                                    //game.rol.multishoot(game.player);
                                  }, 
                                  ROL.Game);
                                  
    ROL.Game.registerUpdateAction(ROL.TurnPhase.PLAYER_WAIT_END, 
                                  function(game){
                                    game.rol.updateBullet(ROL.TurnPhase.PLAYER_END);
                                  }, 
                                  ROL.Game);
                                  
    ROL.Game.registerUpdateAction(ROL.TurnPhase.ENEMY_ACT, 
                                  ROL.Game.rol.updateEnemy,
                                  ROL.Game);
                                  
    ROL.Game.registerUpdateAction(ROL.TurnPhase.ENEMY_WAIT_END, 
                                  function(game){
                                    game.rol.updateBullet(ROL.TurnPhase.ENEMY_END);
                                  }, 
                                  ROL.Game);

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
    
