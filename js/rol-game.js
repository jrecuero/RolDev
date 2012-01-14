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
 * Hero game object.
 * @class Hero game object
 * @augments ROL.Actor
 * @constructor
 * @param   {string} name hero name
 * @param   {ROL.Sprite} sprite sprite that represents the hero
 * @return  this
 */
ROL.Hero = function(name, sprite) {
    ROL.Hero._base_constructor.call(this, name, sprite, true);
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
    ROL.Enemy._base_constructor.call(this, name, sprite, false);
    return this;
};

// ROL.Enemy extends ROL.Actor
jcRap.Framework.extend(ROL.Enemy, ROL.Actor);


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
        this.registerActor(player);
        return player;
    };
    
    ROL.Game.createEnemy = function () {
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
        this.registerActor(enemy);
        return enemy;
    };
    
    ROL.Game.init();
    
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
                                    game.rol.updateBullet();
                                  }, 
                                  ROL.Game);

    ROL.Game.rol = {};
    /**
     * @property {Array} bullets    Array of {@link ROL.Bullet}
     */
    ROL.Game.rol.bullets = [];
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
        game.addActor(bullet);
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
                game.removeActor(bullet);
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
    /**
     * Update player bullet.
     * @public
     * @function
     * @return  none
     */
    ROL.Game.rol.updateBullet = function() {
        var game = ROL.Game,
            i,
            len,
            remove_bullets = [],
            bullet,
            cell,
            collision;

        for (i = 0, len = game.rol.bullets.length; i < len; i += 1) {
            bullet = game.rol.bullets[i];
            cell   = bullet.getCell();

            bullet.moveFrame();
            collision = game.checkCollision(bullet, cell.x, cell.y);
            if (collision === true) {
                console.log("Bullet out of screen");
                game.updateTurnPhase(ROL.TurnPhase.ENEMY_START);
                remove_bullets.push(bullet);
            } else if (collision !== false) {
                console.log("Bullet hit " + collision.name);
                game.updateTurnPhase(ROL.TurnPhase.ENEMY_START);
                remove_bullets.push(bullet);
                collision.damage(null);
                if (!collision.isAlive()) {
                    game.removeActor(collision);
                }
            }

            if (remove_bullets.length > 0) {
                for (i = 0, len = remove_bullets.length; i < len; i += 1) {
                    game.rol.removeBullet(remove_bullets[i]);
                }
            }
        }
    };

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
    
