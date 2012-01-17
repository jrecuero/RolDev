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
                empty_cell = false;

            cell = new ROL.Point(Math.floor(Math.random() * game.screen.x_cells),
                                 Math.floor(Math.random() * game.screen.y_cells));
            figure = new ROL.Rectangle(cell.x, cell.y, game.grid.cell_size, game.grid.cell_size, game.grid.cell_size);
            sprite = new ROL.Sprite(figure);
            sprite.stroke = "black";
            sprite.fill   = "red";
            do {
                if (enemy.checkCollision(cell.x, cell.y, game.actors) === false) {
                    empty_cell = true;
                } else {
                    cell = new ROL.Point(Math.floor(Math.random() * game.screen.x_cells),
                                         Math.floor(Math.random() * game.screen.y_cells));
                }
            } while(!empty_cell);
            return sprite;
        }()), ROL.Role.ENEMY);
    this.setCell(cell.x, cell.y);
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


/**
 * Initializes all objects.
 * @public
 * @function
 * @return  none
 */
ROL.init = function() {
    var canvas  = document.getElementById("screen-canvas"),
        context = canvas.getContext("2d");

    /* Customize ROL.Game object with specific information for the game to
     * play.
     */
    ROL.Game.createPlayer = function () {
        var player = new ROL.Hero(ROL.Game, "Hero");
        this.registerActor(player);
        return player;
    };
    
    ROL.Game.createEnemy = function () {
        var enemy = new ROL.Enemy(ROL.Game, "Goblin");
        this.registerActor(enemy);
        return enemy;
    };

    ROL.Game.rol = {};
    
    /**
     * @property {Array} bullets    Array of {@link ROL.Bullet}
     */
    ROL.Game.rol.bullets = [];
    
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
            bullet;

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
                if (enemy.checkCollision(new_cell.x, new_cell.y, game.actors) !== false) {
                    new_cell.x = null;
                    new_cell.y = null;
                }

                enemy.moveTo(new_cell.x, new_cell.y, false);
            } else {
                new_cell = ROL.Key[facing].move(enemy_cell, 1);
                if (new_cell) {
                    bullet = new ROL.Bullet(new_cell.x, new_cell.y, enemy, facing);            
                    game.rol.addBullet(bullet);
                    game.updateTurnPhase(ROL.TurnPhase.ENEMY_WAIT_END);
                    return;
                }
            }
        }
        game.updateTurnPhase(ROL.TurnPhase.ENEMY_END);
    };
    
    /**
     * Adds a bullet.
     * @public
     * @function
     * @param   {ROL.Bullet} bullet bullet to be added
     * @return  none
     */
    ROL.Game.rol.addBullet = function(bullet) {
        var game = ROL.Game;
        
        game.rol.bullets.push(bullet);
        game._addActor(bullet);
    };
    
    /**
     * Removes a bullet
     * @public
     * @function
     * @param   {ROL.Bullet} bullet bullet to be removed
     * @return  none
     */
    ROL.Game.rol.removeBullet = function(bullet) {
        var game = ROL.Game,
            len,
            i;

        for (i = 0, len = game.rol.bullets.length; i < len; i += 1) {
            if (bullet === game.rol.bullets[i]) {
                game.rol.bullets.splice(i, 1);
                game._removeActor(bullet);
                return;
            }
        }
    };
    
    /**
     * Player shooting.
     * @public
     * @function
     * @return  none
     */
    ROL.Game.rol.shoot =  function(actor) {
        var game = ROL.Game,
            cell = actor.getCell(),
            bullet;

        cell = ROL.Key[actor.facing].move(actor.getCell(), 1);
        if (cell) {
            bullet = new ROL.Bullet(cell.x, cell.y, actor, actor.facing);            
            game.rol.addBullet(bullet);
        }
    };
    
    ROL.Game.rol.bulletHitActor = function(bullet, actor) {
        if ((actor.role === ROL.Role.ENEMY) && (bullet.owner.role === ROL.Role.PLAYER)) {
            /* Player bullet hits an enemy. */
            return true;            
        } else if ((actor.role === ROL.Role.PLAYER) && (bullet.owner.role === ROL.Role.ENEMY)) {
            /* Enemy bullet hits the player. */
            return true;
        }
        return false;
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
            cell,
            collision,
            actor;

        for (i = 0, len = game.rol.bullets.length; i < len; i += 1) {
            bullet = game.rol.bullets[i];
            cell   = bullet.getCell();

            bullet.moveFrame();
            collision = game.checkCollision(bullet, cell.x, cell.y);
            if (collision === true) {
                console.log("Bullet out of screen");
                game.updateTurnPhase(next_phase);
                remove_bullets.push(bullet);
            } else if (collision !== false) {
                actor = collision;
                if (ROL.Game.rol.bulletHitActor(bullet, actor)) {
                    console.log("Bullet hit " + actor.name);
                    actor.damage(null);
                    if (!actor.isAlive()) {
                        game._removeActor(actor);
                    }
                }
                game.updateTurnPhase(next_phase);
                remove_bullets.push(bullet);
            }

            if (remove_bullets.length > 0) {
                for (i = 0, len = remove_bullets.length; i < len; i += 1) {
                    game.rol.removeBullet(remove_bullets[i]);
                }
            }
        }
    };
    
    ROL.Game.init();
    
    ROL.Game.registerActor(new ROL.Pillar(ROL.Game, 10, 10));
    
    ROL.Game.registerKeyAction(ROL.Key.SPACE.code, 
                               function(game) {
                                    game.updateTurnPhase(ROL.TurnPhase.PLAYER_ACT);
                               }, 
                               ROL.Game);
    
    ROL.Game.registerUpdateAction(ROL.TurnPhase.PLAYER_ACT, 
                                  function(game){
                                    game.rol.shoot(game.player);
                                    game.updateTurnPhase(ROL.TurnPhase.PLAYER_WAIT_END);
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
    
