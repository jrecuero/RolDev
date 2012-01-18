/**
 * @fileOverview    <b>jcrap.js</b> file contains all framework functionality.
 * @author <a href="mailto:jose.recuero@gmail.com">Jose Carlos Recuero</a>
 * @version 1.0.0
 */

/*
 * @requires $
 */
/*globals $ */

/**
 * Framework Namespace.
 * @namespace Framework namespace
 */
var jcRap = {};

/**
 * @class Logging module namespace.
 * @property {string[]} data    Stores all log information in array format.
 */
jcRap.Logging = {
    _data: []
};

/**
 * @function
 * @description Store a logging message in the internal data memory.
 * @param   {string} mode    DEBUG, LOG, INFO, WARN or ERROR message.
 * @param   {string} message User logging message.   
 */
jcRap.Logging._data_log = function (mode, message) {
    var timestamp = new Date().toString(),
        str       = timestamp + '\t' + mode + ' ' + message;
            
    jcRap.Logging._data.push(str);
};

/**
 * @function
 * @description Framework logging debug output.
 * @param   {string} args   String to display in the debug output
 */
jcRap.Logging.debug = function (args) {
    if (jcRap.Logging.debug._enable) {
        console.debug(args);
        jcRap.Logging._data_log('[DEBUG]', args);
    }
};

jcRap.Logging.debug._enable = false;

/**
 * @function
 * @description Framework logging log output.
 * @param   {string} args   String to display in the log output
 */
jcRap.Logging.log = function (args) {
    console.log(args);
    jcRap.Logging._data_log('[LOG  ]', args);
};

/**
 * @function
 * @description Framework logging info output.
 * @param   {string} args   String to display in the info output
 */
jcRap.Logging.info = function (args) {
    console.info(args);
    jcRap.Logging._data_log('[INFO ]', args);
};

/**
 * @function
 * @description Framework logging warn output.
 * @param   {string} args   String to display in the warn output
 */
jcRap.Logging.warn = function (args) {
    console.warn(args);
    jcRap.Logging._data_log('[WARN ]', args);
};

/**
 * @function
 * @description Framework logging error output.
 * @param   {string} args   String to display in the error output
 */
jcRap.Logging.error = function (args) {
    console.error(args);
    jcRap.Logging._data_log('[ERROR]', args);
};


/**
 * @class Framework module namespace.
 */
jcRap.Framework = {};

/**
 * @function
 * @public
 * @description Load another javascript file in the HTML file.
 * @param   {string} filename   Javascript filename.
 */
jcRap.Framework.include = function (filename) {
//    var body   = document.getElementsByTagName('body'),
    var script = document.createElement('script');
    
    script.src  = filename;
    script.type = 'text/javascript';
    $('body').append(script);
};

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
jcRap.Framework.extend = function (subclass, baseclass) {
    /**
     * Inheritance.
     * @class Inheritance
     * @memberOf jcRap
     * @description <p>This class is used in order to extend classes.
     * @constructor
     */
    jcRap.Framework.Inheritance = function () {};
    jcRap.Framework.Inheritance.prototype = baseclass.prototype;

    subclass.prototype = new jcRap.Framework.Inheritance();
    subclass.prototype.constructor = subclass;
    subclass._base_constructor     = baseclass;
    subclass._super_class          = baseclass.prototype;
};

/**
 * @function
 * @param   {Object} instance   Instance to bind the method.
 * @param   {Function} method   Method to bind.
 * @param   {Object} params     Parameters required for the method to bind.
 * @type    {Function}
 * @return  Method to be called binded to the given instance.
 */
jcRap.Framework.bind = function (instance, method, params) {
    if (params) {
        return instance[method].bind(instance, params);
    } else {
        return instance[method].bind(instance);
    }
};

/**
 * General purpose currying function.
 * @public
 * @function
 * @param   {Function} fn   
 *          function to curry
 * @return  currying function
 */
jcRap.Framework.schonfinkelize = function (fn) {
    var slice       = Array.prototype.slice,
        stored_args = slice.call(arguments, 1);
    return function () {
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
 * @type    {Object}         
 * @return  new namespaced object
 */
jcRap.Framework.namespace = function (name_space, ns_string) {
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
/**
 * @function
 * @description Creates a 2-multidimensional array.
 * @param   {int} x_len First dimesion length.
 * @param   {int} y_len Second dimesion length.
 * @type    {Array}
 * @return  New array created.
 */
jcRap.Framework.createArray = function (x_len, y_len) {
    var x,
        y,
        a = [];
    
    for (x = 0; x < x_len; x += 1) {
        a[x] = [];
        for (y = 0; y < y_len; y += 1) {
            a[x][y] = null;
        }
    }
    return a;
};


/**
 * @class Generic framework queue.
 */
jcRap.Framework.Queue = function (name) {
    this.size  = 0;
    this._head = null;
};

/**
 * @function
 */
jcRap.Framework.Queue.prototype.is_empty = function () {
    return (this.size === 0);
};

/**
 * @function
 */
jcRap.Framework.Queue._new = function(element) {
    var obj = {
        next: null,
        data: element
    };
    return obj;
};

/**
 * @function
 */
jcRap.Framework.Queue.prototype.push = function (element) {
    var trav = this._head;
    
    if (trav === null) {
        this._head = jcRap.Framework.Queue._new(element);
    } else {
        while (trav.next !== null) {
            trav = trav.next;
        }
        trav.next = jcRap.Framework.Queue._new(element);
    }
    this.size += 1;
};

/**
 * @function
 */
jcRap.Framework.Queue.prototype.pop = function () {
    var trav = this._head;
    
    this._head = trav && trav.next;
    this.size  -= 1;

    return trav && trav.data;
};

/**
 * @function
 */
jcRap.Framework.Queue.prototype.pick = function () {
    return this._head && this._head.data;
};

/**
 * @function
 */
jcRap.Framework.Queue.prototype.search = function (element) {
    var trav = this._head;
    
    while (trav && (trav.data !== element)) {
        trav = trav.next;
    }
    
    return (trav !== null);
};

/**
 * @function
 */
jcRap.Framework.Queue.prototype.clean_up = function () {
    this._head = null;
    this.size  = 0;
};


/**
 * @class Framework module unit test.
 * @property {Object} modules   Stores all modules to be run in the unit test.
 * @property {string} running_module    Name of the actual module tested.
 * @property {string} running_utest     Name of the unit test method tested.
 */
jcRap.UnitTest = {};
jcRap.UnitTest.modules        = {};
jcRap.UnitTest.running_module = null;
jcRap.UnitTest.running_utest  = null;

/**
 * @class Unit test module.
 * @description Unit test module contains all information related with a
 *              module, aka class, to be unit tested.
 * @property {Object} klass         Name of the unit test class.
 * @property {int} test_total       Total number of methods tested.
 * @property {string[]} test_passed Array with all unit test methods passed.
 * @property {string[]} test_error  Array with all unit test methods with error.
 * @property {int} assert_total     Total number of assert calls.
 * @property {int} assert_passed    Total number of asserts passed.
 * @property {int} assert_error     Total number of asserts with errors.
 * 
 * @constructor
 * @param   {Object} klass  Unit test class name.
 * @type    jcRap.UnitTest.Module
 * @return  Instance to the new unit test module.
 */
jcRap.UnitTest.Module = function (klass) {
    this.klass         = klass;
    this.test_total    = 0;
    this.test_passed   = [];
    this.test_error    = [];
    this.assert_total  = 0;
    this.assert_passed = 0;
    this.assert_error  = 0;
    return this;
};

/**
 * @function
 * @description Runs all unit test methods in a module. Every method which
 *              name starts with <b>test_</b> is a unit test method.
 */
jcRap.UnitTest.Module.prototype.run = function () {
    var test,
        pattern = /^test_/,
        result;

    for (test in this.klass) {
        if (this.klass.hasOwnProperty(test)) {
            if (pattern.test(test)) {
                result = jcRap.UnitTest.run_test(this.klass, test);
                if (result) {
                    this.test_passed.push(test);
                } else {
                    this.test_error.push(test);
                }
                this.test_total += 1;
            }
        }
    }
    jcRap.Logging.info('Module: ' + this.klass.toString() +
                       ' asserts: ' + this.assert_total + ' [' +
                       this.assert_passed + '/' +
                       this.assert_error + ']');
    jcRap.Logging.info('');
};

/**
 * @function
 * @description Register a new module to be unit tested.
 * @param   {Object} klass  Name of the unit test class to register.
 */
jcRap.UnitTest.register = function (klass) {
    var module = new jcRap.UnitTest.Module(klass);
    jcRap.UnitTest.modules[klass.toString()] = module;
};

/**
 * @function
 * @description Run all unit test modules registered.
 * @param   {string} module Module name to run unit test. When no value is
 *                          passed, all modules unit test are run.
 */
jcRap.UnitTest.run = function (module) {
    var i;

    for (i in this.modules) {
        if (this.modules.hasOwnProperty(i)) {
            if ((module === undefined) || (module && (i.indexOf(module) === 0))) {
                this.modules[i].run();
            }
        }
    }
};

/**
 * @function
 * @description Run a unit test.
 * @param   {Object} test_class Unit test class.
 * @param   {Function} test     Test to run.
 * @param   {Object} setup_data  Optional data to pass to initialize the test.
 * @param   {Object} test_data  Optional data to pass to the test.
 * @type    boolean
 * @return  <b>true</b> Unit test run passed.<p>
 *          <b>false</b> Unit test run didn't pass.
 */
jcRap.UnitTest.run_test = function (test_class, test, setup_data, test_data) {
    var result = false,
        result_str;

    this.running_module = test_class;
    this.running_utest  = test;


    if (test_class.set_up || (typeof test_class.set_up === 'function')) {
        test_class.set_up(setup_data);
    }

    if (test_class[test] || (typeof test_class[test] === 'function')) {
        result_str = 'Unit test: ' + test_class + '.' + test + ' ';
        result = test_class[test](test_data);
        if (result) {
            jcRap.Logging.info(result_str + '[OK]');
        } else {
            jcRap.Logging.error(result_str + '[ERROR]');
        }
    }

    if (test_class.tear_down || (typeof test_class.tear_down === 'function')) {
        test_class.tear_down();
    }

    return result;
};

/**
 * @function
 * @description Check if test value is equal to the pass value. If only one
 *              parameter is passed, it is tested to be <b>true</b>.
 * @param   {Object} test_value Parameter to be tested.
 * @param   {Object} pass_value Paramater to test against.
 * @param   {string} run_module Module running unit tests.
 * @param   {string} run_utest  Unit test running.
 * @param   {string} user_pass_msg Message to be displayed if test passed.
 * @param   {string} user_err_msg  Message to be displayed if test doesn't pass.
 * @type    boolean
 * @return  <b>true</b> Parameters are equal.<p>
 *          <b>false</b> Parameters are not equal.
 * @throws  Error message with the module and unit test running.
 */
jcRap.UnitTest.assert = function (test_value, pass_value, run_module, run_utest,
                            user_pass_msg, user_err_msg) {
    var error_msg,
        module,
        throw_exception = false,
        result          = true;

    /*
     * Set up properly the module and unit test running at this time.
     * If undefined value are given to the method, use module and utest
     * running under the framework.
     * In any other case it takes module and utest given.
     */

    /**
     * @default this.running_module.toString()
     */
    run_module = run_module || this.running_module.toString();

    /**
     * @default this.running_utest
     */
    run_utest  = run_utest  || this.running_utest;

    error_msg  = run_module + "#" + run_utest + ': ' + test_value;
    module     = this.modules[run_module.toString()];

    if (pass_value === undefined) {
        switch (typeof test_value) {
        case 'boolean':
            if (test_value !== true) {
                throw_exception = true;
            }
            break;
        case 'number':
            if (test_value === 0) {
                throw_exception = true;
            }
            break;
        case 'string':
            if (test_value === '') {
                throw_exception = true;
            }
            break;
        case 'object':
        case 'function':
            if ((test_value ===  null) || (test_value === undefined)) {
                throw_exception = true;
            }
//            if (test_value instanceof Array) {
//                if (test_value.length === 0) {
//                    throw_exception = true;
//                }
//            }
            break;
        }
    } else {
        switch (typeof test_value) {
        case 'boolean':
        case 'number':
        case 'string':
            if (test_value !== pass_value) {
                throw_exception = true;
                error_msg       += ' not equal to ' + pass_value;
            }
            break;
        default:
            break;
        }
    }

    try {
        module.assert_total += 1;
        if (throw_exception) {
            module.assert_error += 1;
            if (user_err_msg) {
                error_msg += ' <' + user_err_msg + '>';
            }
            throw error_msg;
        } else {
            module.assert_passed += 1;
        }
    } catch (e) {
        result = false;
        jcRap.Logging.error(e);
    }
    if (!throw_exception && user_pass_msg) {
        jcRap.Logging.info(error_msg + ' <' + user_pass_msg + '>');
    }
    return result;
};

/**
 * @function
 * @description Check if test value is false.
 * @param   {Object} test_value Parameter to be tested.
 * @param   {string} run_module Module running unit tests.
 * @param   {string} run_utest  Unit test running.
 * @type    boolean
 * @return  <b>true</b> Parameter is false.<p>
 *          <b>false</b> Parameter is not false.
 * @throws  Error message with the module and unit test running.
 */
jcRap.UnitTest.assert_false = function (test_value, run_module, run_utest) {
    return jcRap.UnitTest.assert(test_value, false, run_module, run_utest);
};

/**
 * @function
 * @description Check if test value is null.
 * @param   {Object} test_value Parameter to be tested.
 * @param   {string} run_module Module running unit tests.
 * @param   {string} run_utest  Unit test running.
 * @type    boolean
 * @return  <b>true</b> Parameter is null.<p>
 *          <b>false</b> Parameter is not null.
 * @throws  Error message with the module and unit test running.
 */
jcRap.UnitTest.assert_null = function (test_value, run_module, run_utest) {
    return jcRap.UnitTest.assert(test_value, null, run_module, run_utest);
};

/**
 * @function
 * @description Check if test value is undefined.
 * @param   {Object} test_value Parameter to be tested.
 * @param   {string} run_module Module running unit tests.
 * @param   {string} run_utest  Unit test running.
 * @type    boolean
 * @return  <b>true</b> Parameter is undefined.<p>
 *          <b>false</b> Parameter is not undefined.
 * @throws  Error message with the module and unit test running.
 */
jcRap.UnitTest.assert_undef = function (test_value, run_module, run_utest) {
    return jcRap.UnitTest.assert(test_value, undefined, run_module, run_utest);
};

/**
 * @function
 * @description Check if test value is zero.
 * @param   {Object} test_value Parameter to be tested.
 * @param   {string} run_module Module running unit tests.
 * @param   {string} run_utest  Unit test running.
 * @type    boolean
 * @return  <b>true</b> Parameter is zero.<p>
 *          <b>false</b> Parameter is not zero.
 * @throws  Error message with the module and unit test running.
 */
jcRap.UnitTest.assert_zero = function (test_value, run_module, run_utest) {
    return jcRap.UnitTest.assert(test_value, 0, run_module, run_utest);
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