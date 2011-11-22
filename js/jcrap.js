/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Framework Namespace.
 * @namespace Framework namespace
 */
var jcRap = {};

/**
 * Extends one class with another.
 * @public
 * @function
 * @param   {Object} subclass
 *          The inheriting class or subclass.
 * @param   {Object} baseclass
 *          The class from which to inherit.
 * @return  none.         
 */
jcRap.extend = function (subclass, baseclass) {
    /**
     * Inheritance.
     * @class Inheritance
     * @memberOf jcRap
     * @description <p>This class is used in order to extend classes.
     * @constructor
     */
    jcRap.Inheritance = function() {};
    jcRap.Inheritance.prototype = baseclass.prototype;
    
    subclass.prototype = new jcRap.Inheritance();
    subclass.prototype.constructor = subclass;
    subclass._baseConstructor      = baseclass;
    subclass._superClass           = baseclass.prototype;
};

/**
 * General purpose currying function.
 * @public
 * @function
 * @param   {Function} fn   
 *          function to curry
 * @return  currying function
 */
jcRap.schonfinkelize = function(fn) {
    var slice       = Array.prototype.slice,
        stored_args = slice.call(arguments, 1);
    return function() {
        var new_args = slice.call(arguments),
            args     = stored_args.concat(new_args);
        return fn.apply(null, args);
    };
};

/**
 * General purpose namespace.
 * @public
 * @function
 * @param   {string} name_space
 *          global namespace
 * @param   {string} ns_string
 *          new namespace object to be created
 * @return  new namespaced object
 */
jcRap.namespace = function(name_space, ns_string) {
    var parts = ns_string.split('.'),
        parent = name_space,
        i;
        
    // strip redundant leading global
    if (parts[0] === name_space) {
        parts = parts.slice(1);
    }
    
    for (i = 0; i < parts.length; i += 1) {
        // create a property if it doesn't exist
        if (typeof parent[parts[i]] === "undefined") {
            parent[parts[i]] = {};
        }
        parent = parent[parts[i]];
    }
    return parent;
};

/*
(function(global) {
    var Sandbox = function(modules, callback) {
        var i,
            len;
        
        if (!this instanceof Sandbox) {
            return new Sandbox(modules, callback);
        }
        // modules is an array in this instance.
        for (i = 0, len = modules.length; i < len; i += 1) {
            Sandbox.modules[modules[i]](this);
        }
        callback(this);
    };
    Sandbox.modules = {};
    global.Sandbox = Sandbox;
})(this);

Sandbox.modules.ajax = function(sandbox) {
    sandbox.ajax = function(x) {};
    sandbox.json = function(x) {};
};

Sandbox(['ajax'], function(sandbox) {
    sandbox.ajax({
        type: 'post',
        url: '/Sample/Url',
        success: function(response) {            
        }
    });
});
*/