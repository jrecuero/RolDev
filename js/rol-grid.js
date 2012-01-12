/**
 * @fileOverview    <b>rol-grid.js</b> file with all grid elements.
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
ROL.Point = function(x, y) {
    this.x = x;
    this.y = y;
    return this;
};

/**
 * Checks if two points are equal.
 * @public
 * @function
 * @param   {x} x point coordinate x.
 * @param   {y} y point coordinate y.
 * @return  <b>true</b> points are equal.
 *          <p><b>false</b> points are not equal.
 */
ROL.Point.prototype.equal = function(x, y) {
    return ((this.x === x) && (this.y === y));
};

/**
 * Point as a string.
 * @public
 * @function
 * @return  point formatted as a string.
 */
ROL.Point.prototype.toString = function() {
    return '(' + this.x + ', ' + this.y + ')';
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
ROL.Grid = function(cell_size, x_cells, y_cells) {
    this.cell_size       = cell_size;
    this.cells_in_width  = x_cells;
    this.cells_in_height = y_cells;
    this.stroke_style    = "yellow";
    return this;
};

/**
 * Gets the left top corner position in the canvas for a given cell.
 * @public
 * @function
 * @param   {int} x_cell cell x coordinate
 * @param   {int} y_cell cell y coordinate
 * @return  {ROL.Point} point to the left top corner position
 */
ROL.Grid.prototype.getCornerPosFromCell = function(x_cell, y_cell) {
    var point = new ROL.Point(x_cell === null ? null : x_cell * this.cell_size, 
                          y_cell === null ? null : y_cell * this.cell_size);
    return point;
};

/**
 * Gets the center position in the canvas for a given cell.
 * @public
 * @function
 * @param   {int} x_cell cell x coordinate
 * @param   {int} y_cell cell y coordinate
 * @return  {ROL.Point} point to the center position
 */
ROL.Grid.prototype.getCenterPosFromCell = function(x_cell, y_cell) {
    var half_cell = this.cell_size / 2,
        point     = new ROL.Point(x_cell === null ? null : (x_cell * this.cell_size) + half_cell, 
                              y_cell === null ? null : (y_cell * this.cell_size) + half_cell);
    return point;
};

/**
 * Gets the cell from the canvas position.
 * @public
 * @function
 * @param   {int} x_pos canvas x coordinate
 * @param   {int} y_pos canvas y coordinate
 * @return  {ROL.Point} point to the cell.
 */
ROL.Grid.prototype.getCellFromPos = function(x_pos, y_pos) {
    var x = x_pos % this.cell_size,
        y = y_pos % this.cell_size;
    return new ROL.Point(x, y);
};

/**
 * Draws the Grid.
 * @public
 * @function
 * @param   {Context} ctx
 *          canvas 2D context
 */
ROL.Grid.prototype.draw = function(ctx) {
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
