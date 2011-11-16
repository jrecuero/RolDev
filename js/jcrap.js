/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

// Namespace placeholder
var jcRap = {};

/**
 * A function used to extend one class with another.
 * 
 * @param   { Object } subclass
 *          The inheriting class or subclass.
 * @param   { Object } baseclass
 *          The class from which to inherit.
 *          
 * @return  none.         
 */
jcRap.extend = function (subclass, baseclass) {
    Inheritance = function() {};
    Inheritance.prototype = baseclass.prototype;
    
    subclass.prototype = new Inheritance();
    subclass.prototype.constructor = subclass;
    subclass._base_constructor     = baseclass;
    subclass._super_class          = baseclass.prototype;
};
