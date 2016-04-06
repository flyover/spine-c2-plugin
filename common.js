// Scripts in this file are included in both the IDE and runtime, so you only
// need to write scripts common to both once.

var CLOSURE_NO_DEPS = true;

// Copyright 2006 The Closure Library Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Bootstrap for the Google JS Library (Closure).
 *
 * In uncompiled mode base.js will write out Closure's deps file, unless the
 * global <code>CLOSURE_NO_DEPS</code> is set to true.  This allows projects to
 * include their own deps file(s) from different locations.
 *
 * @author arv@google.com (Erik Arvidsson)
 *
 * @provideGoog
 */


/**
 * @define {boolean} Overridden to true by the compiler when
 *     --process_closure_primitives is specified.
 */
var COMPILED = false;


/**
 * Base namespace for the Closure library.  Checks to see goog is already
 * defined in the current scope before assigning to prevent clobbering if
 * base.js is loaded more than once.
 *
 * @const
 */
var goog = goog || {};


/**
 * Reference to the global context.  In most cases this will be 'window'.
 */
goog.global = this;


/**
 * A hook for overriding the define values in uncompiled mode.
 *
 * In uncompiled mode, {@code CLOSURE_UNCOMPILED_DEFINES} may be defined before
 * loading base.js.  If a key is defined in {@code CLOSURE_UNCOMPILED_DEFINES},
 * {@code goog.define} will use the value instead of the default value.  This
 * allows flags to be overwritten without compilation (this is normally
 * accomplished with the compiler's "define" flag).
 *
 * Example:
 * <pre>
 *   var CLOSURE_UNCOMPILED_DEFINES = {'goog.DEBUG': false};
 * </pre>
 *
 * @type {Object<string, (string|number|boolean)>|undefined}
 */
goog.global.CLOSURE_UNCOMPILED_DEFINES;


/**
 * A hook for overriding the define values in uncompiled or compiled mode,
 * like CLOSURE_UNCOMPILED_DEFINES but effective in compiled code.  In
 * uncompiled code CLOSURE_UNCOMPILED_DEFINES takes precedence.
 *
 * Also unlike CLOSURE_UNCOMPILED_DEFINES the values must be number, boolean or
 * string literals or the compiler will emit an error.
 *
 * While any @define value may be set, only those set with goog.define will be
 * effective for uncompiled code.
 *
 * Example:
 * <pre>
 *   var CLOSURE_DEFINES = {'goog.DEBUG': false} ;
 * </pre>
 *
 * @type {Object<string, (string|number|boolean)>|undefined}
 */
goog.global.CLOSURE_DEFINES;


/**
 * Returns true if the specified value is not undefined.
 * WARNING: Do not use this to test if an object has a property. Use the in
 * operator instead.
 *
 * @param {?} val Variable to test.
 * @return {boolean} Whether variable is defined.
 */
goog.isDef = function(val) {
  // void 0 always evaluates to undefined and hence we do not need to depend on
  // the definition of the global variable named 'undefined'.
  return val !== void 0;
};


/**
 * Builds an object structure for the provided namespace path, ensuring that
 * names that already exist are not overwritten. For example:
 * "a.b.c" -> a = {};a.b={};a.b.c={};
 * Used by goog.provide and goog.exportSymbol.
 * @param {string} name name of the object that this file defines.
 * @param {*=} opt_object the object to expose at the end of the path.
 * @param {Object=} opt_objectToExportTo The object to add the path to; default
 *     is |goog.global|.
 * @private
 */
goog.exportPath_ = function(name, opt_object, opt_objectToExportTo) {
  var parts = name.split('.');
  var cur = opt_objectToExportTo || goog.global;

  // Internet Explorer exhibits strange behavior when throwing errors from
  // methods externed in this manner.  See the testExportSymbolExceptions in
  // base_test.html for an example.
  if (!(parts[0] in cur) && cur.execScript) {
    cur.execScript('var ' + parts[0]);
  }

  // Certain browsers cannot parse code in the form for((a in b); c;);
  // This pattern is produced by the JSCompiler when it collapses the
  // statement above into the conditional loop below. To prevent this from
  // happening, use a for-loop and reserve the init logic as below.

  // Parentheses added to eliminate strict JS warning in Firefox.
  for (var part; parts.length && (part = parts.shift());) {
    if (!parts.length && goog.isDef(opt_object)) {
      // last part and we have an object; use it
      cur[part] = opt_object;
    } else if (cur[part]) {
      cur = cur[part];
    } else {
      cur = cur[part] = {};
    }
  }
};


/**
 * Defines a named value. In uncompiled mode, the value is retrieved from
 * CLOSURE_DEFINES or CLOSURE_UNCOMPILED_DEFINES if the object is defined and
 * has the property specified, and otherwise used the defined defaultValue.
 * When compiled the default can be overridden using the compiler
 * options or the value set in the CLOSURE_DEFINES object.
 *
 * @param {string} name The distinguished name to provide.
 * @param {string|number|boolean} defaultValue
 */
goog.define = function(name, defaultValue) {
  var value = defaultValue;
  if (!COMPILED) {
    if (goog.global.CLOSURE_UNCOMPILED_DEFINES &&
        Object.prototype.hasOwnProperty.call(
            goog.global.CLOSURE_UNCOMPILED_DEFINES, name)) {
      value = goog.global.CLOSURE_UNCOMPILED_DEFINES[name];
    } else if (goog.global.CLOSURE_DEFINES &&
        Object.prototype.hasOwnProperty.call(
            goog.global.CLOSURE_DEFINES, name)) {
      value = goog.global.CLOSURE_DEFINES[name];
    }
  }
  goog.exportPath_(name, value);
};


/**
 * @define {boolean} DEBUG is provided as a convenience so that debugging code
 * that should not be included in a production js_binary can be easily stripped
 * by specifying --define goog.DEBUG=false to the JSCompiler. For example, most
 * toString() methods should be declared inside an "if (goog.DEBUG)" conditional
 * because they are generally used for debugging purposes and it is difficult
 * for the JSCompiler to statically determine whether they are used.
 */
goog.define('goog.DEBUG', true);


/**
 * @define {string} LOCALE defines the locale being used for compilation. It is
 * used to select locale specific data to be compiled in js binary. BUILD rule
 * can specify this value by "--define goog.LOCALE=<locale_name>" as JSCompiler
 * option.
 *
 * Take into account that the locale code format is important. You should use
 * the canonical Unicode format with hyphen as a delimiter. Language must be
 * lowercase, Language Script - Capitalized, Region - UPPERCASE.
 * There are few examples: pt-BR, en, en-US, sr-Latin-BO, zh-Hans-CN.
 *
 * See more info about locale codes here:
 * http://www.unicode.org/reports/tr35/#Unicode_Language_and_Locale_Identifiers
 *
 * For language codes you should use values defined by ISO 693-1. See it here
 * http://www.w3.org/WAI/ER/IG/ert/iso639.htm. There is only one exception from
 * this rule: the Hebrew language. For legacy reasons the old code (iw) should
 * be used instead of the new code (he), see http://wiki/Main/IIISynonyms.
 */
goog.define('goog.LOCALE', 'en');  // default to en


/**
 * @define {boolean} Whether this code is running on trusted sites.
 *
 * On untrusted sites, several native functions can be defined or overridden by
 * external libraries like Prototype, Datejs, and JQuery and setting this flag
 * to false forces closure to use its own implementations when possible.
 *
 * If your JavaScript can be loaded by a third party site and you are wary about
 * relying on non-standard implementations, specify
 * "--define goog.TRUSTED_SITE=false" to the JSCompiler.
 */
goog.define('goog.TRUSTED_SITE', true);


/**
 * @define {boolean} Whether a project is expected to be running in strict mode.
 *
 * This define can be used to trigger alternate implementations compatible with
 * running in EcmaScript Strict mode or warn about unavailable functionality.
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions_and_function_scope/Strict_mode
 *
 */
goog.define('goog.STRICT_MODE_COMPATIBLE', false);


/**
 * @define {boolean} Whether code that calls {@link goog.setTestOnly} should
 *     be disallowed in the compilation unit.
 */
goog.define('goog.DISALLOW_TEST_ONLY_CODE', COMPILED && !goog.DEBUG);


/**
 * @define {boolean} Whether to use a Chrome app CSP-compliant method for
 *     loading scripts via goog.require. @see appendScriptSrcNode_.
 */
goog.define('goog.ENABLE_CHROME_APP_SAFE_SCRIPT_LOADING', false);


/**
 * Defines a namespace in Closure.
 *
 * A namespace may only be defined once in a codebase. It may be defined using
 * goog.provide() or goog.module().
 *
 * The presence of one or more goog.provide() calls in a file indicates
 * that the file defines the given objects/namespaces.
 * Provided symbols must not be null or undefined.
 *
 * In addition, goog.provide() creates the object stubs for a namespace
 * (for example, goog.provide("goog.foo.bar") will create the object
 * goog.foo.bar if it does not already exist).
 *
 * Build tools also scan for provide/require/module statements
 * to discern dependencies, build dependency files (see deps.js), etc.
 *
 * @see goog.require
 * @see goog.module
 * @param {string} name Namespace provided by this file in the form
 *     "goog.package.part".
 */
goog.provide = function(name) {
  if (!COMPILED) {
    // Ensure that the same namespace isn't provided twice.
    // A goog.module/goog.provide maps a goog.require to a specific file
    if (goog.isProvided_(name)) {
      throw Error('Namespace "' + name + '" already declared.');
    }
  }

  goog.constructNamespace_(name);
};


/**
 * @param {string} name Namespace provided by this file in the form
 *     "goog.package.part".
 * @param {Object=} opt_obj The object to embed in the namespace.
 * @private
 */
goog.constructNamespace_ = function(name, opt_obj) {
  if (!COMPILED) {
    delete goog.implicitNamespaces_[name];

    var namespace = name;
    while ((namespace = namespace.substring(0, namespace.lastIndexOf('.')))) {
      if (goog.getObjectByName(namespace)) {
        break;
      }
      goog.implicitNamespaces_[namespace] = true;
    }
  }

  goog.exportPath_(name, opt_obj);
};


/**
 * Module identifier validation regexp.
 * Note: This is a conservative check, it is very possible to be more lenient,
 *   the primary exclusion here is "/" and "\" and a leading ".", these
 *   restrictions are intended to leave the door open for using goog.require
 *   with relative file paths rather than module identifiers.
 * @private
 */
goog.VALID_MODULE_RE_ = /^[a-zA-Z_$][a-zA-Z0-9._$]*$/;


/**
 * Defines a module in Closure.
 *
 * Marks that this file must be loaded as a module and claims the namespace.
 *
 * A namespace may only be defined once in a codebase. It may be defined using
 * goog.provide() or goog.module().
 *
 * goog.module() has three requirements:
 * - goog.module may not be used in the same file as goog.provide.
 * - goog.module must be the first statement in the file.
 * - only one goog.module is allowed per file.
 *
 * When a goog.module annotated file is loaded, it is enclosed in
 * a strict function closure. This means that:
 * - any variables declared in a goog.module file are private to the file
 * (not global), though the compiler is expected to inline the module.
 * - The code must obey all the rules of "strict" JavaScript.
 * - the file will be marked as "use strict"
 *
 * NOTE: unlike goog.provide, goog.module does not declare any symbols by
 * itself. If declared symbols are desired, use
 * goog.module.declareLegacyNamespace().
 *
 *
 * See the public goog.module proposal: http://goo.gl/Va1hin
 *
 * @param {string} name Namespace provided by this file in the form
 *     "goog.package.part", is expected but not required.
 */
goog.module = function(name) {
  if (!goog.isString(name) ||
      !name ||
      name.search(goog.VALID_MODULE_RE_) == -1) {
    throw Error('Invalid module identifier');
  }
  if (!goog.isInModuleLoader_()) {
    throw Error('Module ' + name + ' has been loaded incorrectly.');
  }
  if (goog.moduleLoaderState_.moduleName) {
    throw Error('goog.module may only be called once per module.');
  }

  // Store the module name for the loader.
  goog.moduleLoaderState_.moduleName = name;
  if (!COMPILED) {
    // Ensure that the same namespace isn't provided twice.
    // A goog.module/goog.provide maps a goog.require to a specific file
    if (goog.isProvided_(name)) {
      throw Error('Namespace "' + name + '" already declared.');
    }
    delete goog.implicitNamespaces_[name];
  }
};


/**
 * @param {string} name The module identifier.
 * @return {?} The module exports for an already loaded module or null.
 *
 * Note: This is not an alternative to goog.require, it does not
 * indicate a hard dependency, instead it is used to indicate
 * an optional dependency or to access the exports of a module
 * that has already been loaded.
 * @suppress {missingProvide}
 */
goog.module.get = function(name) {
  return goog.module.getInternal_(name);
};


/**
 * @param {string} name The module identifier.
 * @return {?} The module exports for an already loaded module or null.
 * @private
 */
goog.module.getInternal_ = function(name) {
  if (!COMPILED) {
    if (goog.isProvided_(name)) {
      // goog.require only return a value with-in goog.module files.
      return name in goog.loadedModules_ ?
          goog.loadedModules_[name] :
          goog.getObjectByName(name);
    } else {
      return null;
    }
  }
};


/**
 * @private {?{moduleName: (string|undefined), declareLegacyNamespace:boolean}}
 */
goog.moduleLoaderState_ = null;


/**
 * @private
 * @return {boolean} Whether a goog.module is currently being initialized.
 */
goog.isInModuleLoader_ = function() {
  return goog.moduleLoaderState_ != null;
};


/**
 * Provide the module's exports as a globally accessible object under the
 * module's declared name.  This is intended to ease migration to goog.module
 * for files that have existing usages.
 * @suppress {missingProvide}
 */
goog.module.declareLegacyNamespace = function() {
  if (!COMPILED && !goog.isInModuleLoader_()) {
    throw new Error('goog.module.declareLegacyNamespace must be called from ' +
        'within a goog.module');
  }
  if (!COMPILED && !goog.moduleLoaderState_.moduleName) {
    throw Error('goog.module must be called prior to ' +
        'goog.module.declareLegacyNamespace.');
  }
  goog.moduleLoaderState_.declareLegacyNamespace = true;
};


/**
 * Marks that the current file should only be used for testing, and never for
 * live code in production.
 *
 * In the case of unit tests, the message may optionally be an exact namespace
 * for the test (e.g. 'goog.stringTest'). The linter will then ignore the extra
 * provide (if not explicitly defined in the code).
 *
 * @param {string=} opt_message Optional message to add to the error that's
 *     raised when used in production code.
 */
goog.setTestOnly = function(opt_message) {
  if (goog.DISALLOW_TEST_ONLY_CODE) {
    opt_message = opt_message || '';
    throw Error('Importing test-only code into non-debug environment' +
                (opt_message ? ': ' + opt_message : '.'));
  }
};


/**
 * Forward declares a symbol. This is an indication to the compiler that the
 * symbol may be used in the source yet is not required and may not be provided
 * in compilation.
 *
 * The most common usage of forward declaration is code that takes a type as a
 * function parameter but does not need to require it. By forward declaring
 * instead of requiring, no hard dependency is made, and (if not required
 * elsewhere) the namespace may never be required and thus, not be pulled
 * into the JavaScript binary. If it is required elsewhere, it will be type
 * checked as normal.
 *
 *
 * @param {string} name The namespace to forward declare in the form of
 *     "goog.package.part".
 */
goog.forwardDeclare = function(name) {};


/**
 * Forward declare type information. Used to assign types to goog.global
 * referenced object that would otherwise result in unknown type references
 * and thus block property disambiguation.
 */
goog.forwardDeclare('Document');
goog.forwardDeclare('HTMLScriptElement');
goog.forwardDeclare('XMLHttpRequest');


if (!COMPILED) {

  /**
   * Check if the given name has been goog.provided. This will return false for
   * names that are available only as implicit namespaces.
   * @param {string} name name of the object to look for.
   * @return {boolean} Whether the name has been provided.
   * @private
   */
  goog.isProvided_ = function(name) {
    return (name in goog.loadedModules_) ||
        (!goog.implicitNamespaces_[name] &&
            goog.isDefAndNotNull(goog.getObjectByName(name)));
  };

  /**
   * Namespaces implicitly defined by goog.provide. For example,
   * goog.provide('goog.events.Event') implicitly declares that 'goog' and
   * 'goog.events' must be namespaces.
   *
   * @type {!Object<string, (boolean|undefined)>}
   * @private
   */
  goog.implicitNamespaces_ = {'goog.module': true};

  // NOTE: We add goog.module as an implicit namespace as goog.module is defined
  // here and because the existing module package has not been moved yet out of
  // the goog.module namespace. This satisifies both the debug loader and
  // ahead-of-time dependency management.
}


/**
 * Returns an object based on its fully qualified external name.  The object
 * is not found if null or undefined.  If you are using a compilation pass that
 * renames property names beware that using this function will not find renamed
 * properties.
 *
 * @param {string} name The fully qualified name.
 * @param {Object=} opt_obj The object within which to look; default is
 *     |goog.global|.
 * @return {?} The value (object or primitive) or, if not found, null.
 */
goog.getObjectByName = function(name, opt_obj) {
  var parts = name.split('.');
  var cur = opt_obj || goog.global;
  for (var part; part = parts.shift(); ) {
    if (goog.isDefAndNotNull(cur[part])) {
      cur = cur[part];
    } else {
      return null;
    }
  }
  return cur;
};


/**
 * Globalizes a whole namespace, such as goog or goog.lang.
 *
 * @param {!Object} obj The namespace to globalize.
 * @param {Object=} opt_global The object to add the properties to.
 * @deprecated Properties may be explicitly exported to the global scope, but
 *     this should no longer be done in bulk.
 */
goog.globalize = function(obj, opt_global) {
  var global = opt_global || goog.global;
  for (var x in obj) {
    global[x] = obj[x];
  }
};


/**
 * Adds a dependency from a file to the files it requires.
 * @param {string} relPath The path to the js file.
 * @param {!Array<string>} provides An array of strings with
 *     the names of the objects this file provides.
 * @param {!Array<string>} requires An array of strings with
 *     the names of the objects this file requires.
 * @param {boolean=} opt_isModule Whether this dependency must be loaded as
 *     a module as declared by goog.module.
 */
goog.addDependency = function(relPath, provides, requires, opt_isModule) {
  if (goog.DEPENDENCIES_ENABLED) {
    var provide, require;
    var path = relPath.replace(/\\/g, '/');
    var deps = goog.dependencies_;
    for (var i = 0; provide = provides[i]; i++) {
      deps.nameToPath[provide] = path;
      deps.pathIsModule[path] = !!opt_isModule;
    }
    for (var j = 0; require = requires[j]; j++) {
      if (!(path in deps.requires)) {
        deps.requires[path] = {};
      }
      deps.requires[path][require] = true;
    }
  }
};




// NOTE(nnaze): The debug DOM loader was included in base.js as an original way
// to do "debug-mode" development.  The dependency system can sometimes be
// confusing, as can the debug DOM loader's asynchronous nature.
//
// With the DOM loader, a call to goog.require() is not blocking -- the script
// will not load until some point after the current script.  If a namespace is
// needed at runtime, it needs to be defined in a previous script, or loaded via
// require() with its registered dependencies.
// User-defined namespaces may need their own deps file.  See http://go/js_deps,
// http://go/genjsdeps, or, externally, DepsWriter.
// https://developers.google.com/closure/library/docs/depswriter
//
// Because of legacy clients, the DOM loader can't be easily removed from
// base.js.  Work is being done to make it disableable or replaceable for
// different environments (DOM-less JavaScript interpreters like Rhino or V8,
// for example). See bootstrap/ for more information.


/**
 * @define {boolean} Whether to enable the debug loader.
 *
 * If enabled, a call to goog.require() will attempt to load the namespace by
 * appending a script tag to the DOM (if the namespace has been registered).
 *
 * If disabled, goog.require() will simply assert that the namespace has been
 * provided (and depend on the fact that some outside tool correctly ordered
 * the script).
 */
goog.define('goog.ENABLE_DEBUG_LOADER', true);


/**
 * @param {string} msg
 * @private
 */
goog.logToConsole_ = function(msg) {
  if (goog.global.console) {
    goog.global.console['error'](msg);
  }
};


/**
 * Implements a system for the dynamic resolution of dependencies that works in
 * parallel with the BUILD system. Note that all calls to goog.require will be
 * stripped by the JSCompiler when the --process_closure_primitives option is
 * used.
 * @see goog.provide
 * @param {string} name Namespace to include (as was given in goog.provide()) in
 *     the form "goog.package.part".
 * @return {?} If called within a goog.module file, the associated namespace or
 *     module otherwise null.
 */
goog.require = function(name) {
  // If the object already exists we do not need do do anything.
  if (!COMPILED) {
    if (goog.ENABLE_DEBUG_LOADER && goog.IS_OLD_IE_) {
      goog.maybeProcessDeferredDep_(name);
    }

    if (goog.isProvided_(name)) {
      if (goog.isInModuleLoader_()) {
        return goog.module.getInternal_(name);
      } else {
        return null;
      }
    }

    if (goog.ENABLE_DEBUG_LOADER) {
      var path = goog.getPathFromDeps_(name);
      if (path) {
        goog.writeScripts_(path);
        return null;
      }
    }

    var errorMessage = 'goog.require could not find: ' + name;
    goog.logToConsole_(errorMessage);

    throw Error(errorMessage);
  }
};


/**
 * Path for included scripts.
 * @type {string}
 */
goog.basePath = '';


/**
 * A hook for overriding the base path.
 * @type {string|undefined}
 */
goog.global.CLOSURE_BASE_PATH;


/**
 * Whether to write out Closure's deps file. By default, the deps are written.
 * @type {boolean|undefined}
 */
goog.global.CLOSURE_NO_DEPS;


/**
 * A function to import a single script. This is meant to be overridden when
 * Closure is being run in non-HTML contexts, such as web workers. It's defined
 * in the global scope so that it can be set before base.js is loaded, which
 * allows deps.js to be imported properly.
 *
 * The function is passed the script source, which is a relative URI. It should
 * return true if the script was imported, false otherwise.
 * @type {(function(string): boolean)|undefined}
 */
goog.global.CLOSURE_IMPORT_SCRIPT;


/**
 * Null function used for default values of callbacks, etc.
 * @return {void} Nothing.
 */
goog.nullFunction = function() {};


/**
 * When defining a class Foo with an abstract method bar(), you can do:
 * Foo.prototype.bar = goog.abstractMethod
 *
 * Now if a subclass of Foo fails to override bar(), an error will be thrown
 * when bar() is invoked.
 *
 * Note: This does not take the name of the function to override as an argument
 * because that would make it more difficult to obfuscate our JavaScript code.
 *
 * @type {!Function}
 * @throws {Error} when invoked to indicate the method should be overridden.
 */
goog.abstractMethod = function() {
  throw Error('unimplemented abstract method');
};


/**
 * Adds a {@code getInstance} static method that always returns the same
 * instance object.
 * @param {!Function} ctor The constructor for the class to add the static
 *     method to.
 */
goog.addSingletonGetter = function(ctor) {
  ctor.getInstance = function() {
    if (ctor.instance_) {
      return ctor.instance_;
    }
    if (goog.DEBUG) {
      // NOTE: JSCompiler can't optimize away Array#push.
      goog.instantiatedSingletons_[goog.instantiatedSingletons_.length] = ctor;
    }
    return ctor.instance_ = new ctor;
  };
};


/**
 * All singleton classes that have been instantiated, for testing. Don't read
 * it directly, use the {@code goog.testing.singleton} module. The compiler
 * removes this variable if unused.
 * @type {!Array<!Function>}
 * @private
 */
goog.instantiatedSingletons_ = [];


/**
 * @define {boolean} Whether to load goog.modules using {@code eval} when using
 * the debug loader.  This provides a better debugging experience as the
 * source is unmodified and can be edited using Chrome Workspaces or similar.
 * However in some environments the use of {@code eval} is banned
 * so we provide an alternative.
 */
goog.define('goog.LOAD_MODULE_USING_EVAL', true);


/**
 * @define {boolean} Whether the exports of goog.modules should be sealed when
 * possible.
 */
goog.define('goog.SEAL_MODULE_EXPORTS', goog.DEBUG);


/**
 * The registry of initialized modules:
 * the module identifier to module exports map.
 * @private @const {!Object<string, ?>}
 */
goog.loadedModules_ = {};


/**
 * True if goog.dependencies_ is available.
 * @const {boolean}
 */
goog.DEPENDENCIES_ENABLED = !COMPILED && goog.ENABLE_DEBUG_LOADER;


if (goog.DEPENDENCIES_ENABLED) {

  /**
   * This object is used to keep track of dependencies and other data that is
   * used for loading scripts.
   * @private
   * @type {{
   *   pathIsModule: !Object<string, boolean>,
   *   nameToPath: !Object<string, string>,
   *   requires: !Object<string, !Object<string, boolean>>,
   *   visited: !Object<string, boolean>,
   *   written: !Object<string, boolean>,
   *   deferred: !Object<string, string>
   * }}
   */
  goog.dependencies_ = {
    pathIsModule: {}, // 1 to 1

    nameToPath: {}, // 1 to 1

    requires: {}, // 1 to many

    // Used when resolving dependencies to prevent us from visiting file twice.
    visited: {},

    written: {}, // Used to keep track of script files we have written.

    deferred: {} // Used to track deferred module evaluations in old IEs
  };


  /**
   * Tries to detect whether is in the context of an HTML document.
   * @return {boolean} True if it looks like HTML document.
   * @private
   */
  goog.inHtmlDocument_ = function() {
    /** @type {Document} */
    var doc = goog.global.document;
    return doc != null && 'write' in doc;  // XULDocument misses write.
  };


  /**
   * Tries to detect the base path of base.js script that bootstraps Closure.
   * @private
   */
  goog.findBasePath_ = function() {
    if (goog.isDef(goog.global.CLOSURE_BASE_PATH)) {
      goog.basePath = goog.global.CLOSURE_BASE_PATH;
      return;
    } else if (!goog.inHtmlDocument_()) {
      return;
    }
    /** @type {Document} */
    var doc = goog.global.document;
    var scripts = doc.getElementsByTagName('SCRIPT');
    // Search backwards since the current script is in almost all cases the one
    // that has base.js.
    for (var i = scripts.length - 1; i >= 0; --i) {
      var script = /** @type {!HTMLScriptElement} */ (scripts[i]);
      var src = script.src;
      var qmark = src.lastIndexOf('?');
      var l = qmark == -1 ? src.length : qmark;
      if (src.substr(l - 7, 7) == 'base.js') {
        goog.basePath = src.substr(0, l - 7);
        return;
      }
    }
  };


  /**
   * Imports a script if, and only if, that script hasn't already been imported.
   * (Must be called at execution time)
   * @param {string} src Script source.
   * @param {string=} opt_sourceText The optionally source text to evaluate
   * @private
   */
  goog.importScript_ = function(src, opt_sourceText) {
    var importScript = goog.global.CLOSURE_IMPORT_SCRIPT ||
        goog.writeScriptTag_;
    if (importScript(src, opt_sourceText)) {
      goog.dependencies_.written[src] = true;
    }
  };


  /** @const @private {boolean} */
  goog.IS_OLD_IE_ = !!(!goog.global.atob && goog.global.document &&
      goog.global.document.all);


  /**
   * Given a URL initiate retrieval and execution of the module.
   * @param {string} src Script source URL.
   * @private
   */
  goog.importModule_ = function(src) {
    // In an attempt to keep browsers from timing out loading scripts using
    // synchronous XHRs, put each load in its own script block.
    var bootstrap = 'goog.retrieveAndExecModule_("' + src + '");';

    if (goog.importScript_('', bootstrap)) {
      goog.dependencies_.written[src] = true;
    }
  };


  /** @private {!Array<string>} */
  goog.queuedModules_ = [];


  /**
   * Return an appropriate module text. Suitable to insert into
   * a script tag (that is unescaped).
   * @param {string} srcUrl
   * @param {string} scriptText
   * @return {string}
   * @private
   */
  goog.wrapModule_ = function(srcUrl, scriptText) {
    if (!goog.LOAD_MODULE_USING_EVAL || !goog.isDef(goog.global.JSON)) {
      return '' +
          'goog.loadModule(function(exports) {' +
          '"use strict";' +
          scriptText +
          '\n' + // terminate any trailing single line comment.
          ';return exports' +
          '});' +
          '\n//# sourceURL=' + srcUrl + '\n';
    } else {
      return '' +
          'goog.loadModule(' +
          goog.global.JSON.stringify(
              scriptText + '\n//# sourceURL=' + srcUrl + '\n') +
          ');';
    }
  };

  // On IE9 and earlier, it is necessary to handle
  // deferred module loads. In later browsers, the
  // code to be evaluated is simply inserted as a script
  // block in the correct order. To eval deferred
  // code at the right time, we piggy back on goog.require to call
  // goog.maybeProcessDeferredDep_.
  //
  // The goog.requires are used both to bootstrap
  // the loading process (when no deps are available) and
  // declare that they should be available.
  //
  // Here we eval the sources, if all the deps are available
  // either already eval'd or goog.require'd.  This will
  // be the case when all the dependencies have already
  // been loaded, and the dependent module is loaded.
  //
  // But this alone isn't sufficient because it is also
  // necessary to handle the case where there is no root
  // that is not deferred.  For that there we register for an event
  // and trigger goog.loadQueuedModules_ handle any remaining deferred
  // evaluations.

  /**
   * Handle any remaining deferred goog.module evals.
   * @private
   */
  goog.loadQueuedModules_ = function() {
    var count = goog.queuedModules_.length;
    if (count > 0) {
      var queue = goog.queuedModules_;
      goog.queuedModules_ = [];
      for (var i = 0; i < count; i++) {
        var path = queue[i];
        goog.maybeProcessDeferredPath_(path);
      }
    }
  };


  /**
   * Eval the named module if its dependencies are
   * available.
   * @param {string} name The module to load.
   * @private
   */
  goog.maybeProcessDeferredDep_ = function(name) {
    if (goog.isDeferredModule_(name) &&
        goog.allDepsAreAvailable_(name)) {
      var path = goog.getPathFromDeps_(name);
      goog.maybeProcessDeferredPath_(goog.basePath + path);
    }
  };

  /**
   * @param {string} name The module to check.
   * @return {boolean} Whether the name represents a
   *     module whose evaluation has been deferred.
   * @private
   */
  goog.isDeferredModule_ = function(name) {
    var path = goog.getPathFromDeps_(name);
    if (path && goog.dependencies_.pathIsModule[path]) {
      var abspath = goog.basePath + path;
      return (abspath) in goog.dependencies_.deferred;
    }
    return false;
  };

  /**
   * @param {string} name The module to check.
   * @return {boolean} Whether the name represents a
   *     module whose declared dependencies have all been loaded
   *     (eval'd or a deferred module load)
   * @private
   */
  goog.allDepsAreAvailable_ = function(name) {
    var path = goog.getPathFromDeps_(name);
    if (path && (path in goog.dependencies_.requires)) {
      for (var requireName in goog.dependencies_.requires[path]) {
        if (!goog.isProvided_(requireName) &&
            !goog.isDeferredModule_(requireName)) {
          return false;
        }
      }
    }
    return true;
  };


  /**
   * @param {string} abspath
   * @private
   */
  goog.maybeProcessDeferredPath_ = function(abspath) {
    if (abspath in goog.dependencies_.deferred) {
      var src = goog.dependencies_.deferred[abspath];
      delete goog.dependencies_.deferred[abspath];
      goog.globalEval(src);
    }
  };


  /**
   * Load a goog.module from the provided URL.  This is not a general purpose
   * code loader and does not support late loading code, that is it should only
   * be used during page load. This method exists to support unit tests and
   * "debug" loaders that would otherwise have inserted script tags. Under the
   * hood this needs to use a synchronous XHR and is not recommeneded for
   * production code.
   *
   * The module's goog.requires must have already been satisified; an exception
   * will be thrown if this is not the case. This assumption is that no
   * "deps.js" file exists, so there is no way to discover and locate the
   * module-to-be-loaded's dependencies and no attempt is made to do so.
   *
   * There should only be one attempt to load a module.  If
   * "goog.loadModuleFromUrl" is called for an already loaded module, an
   * exception will be throw.
   *
   * @param {string} url The URL from which to attempt to load the goog.module.
   */
  goog.loadModuleFromUrl = function(url) {
    // Because this executes synchronously, we don't need to do any additional
    // bookkeeping. When "goog.loadModule" the namespace will be marked as
    // having been provided which is sufficient.
    goog.retrieveAndExecModule_(url);
  };


  /**
   * @param {function(?):?|string} moduleDef The module definition.
   */
  goog.loadModule = function(moduleDef) {
    // NOTE: we allow function definitions to be either in the from
    // of a string to eval (which keeps the original source intact) or
    // in a eval forbidden environment (CSP) we allow a function definition
    // which in its body must call {@code goog.module}, and return the exports
    // of the module.
    var previousState = goog.moduleLoaderState_;
    try {
      goog.moduleLoaderState_ = {
        moduleName: undefined,
        declareLegacyNamespace: false
      };
      var exports;
      if (goog.isFunction(moduleDef)) {
        exports = moduleDef.call(goog.global, {});
      } else if (goog.isString(moduleDef)) {
        exports = goog.loadModuleFromSource_.call(goog.global, moduleDef);
      } else {
        throw Error('Invalid module definition');
      }

      var moduleName = goog.moduleLoaderState_.moduleName;
      if (!goog.isString(moduleName) || !moduleName) {
        throw Error('Invalid module name \"' + moduleName + '\"');
      }

      // Don't seal legacy namespaces as they may be uses as a parent of
      // another namespace
      if (goog.moduleLoaderState_.declareLegacyNamespace) {
        goog.constructNamespace_(moduleName, exports);
      } else if (goog.SEAL_MODULE_EXPORTS && Object.seal) {
        Object.seal(exports);
      }

      goog.loadedModules_[moduleName] = exports;
    } finally {
      goog.moduleLoaderState_ = previousState;
    }
  };


  /**
   * @private @const {function(string):?}
   *
   * The new type inference warns because this function has no formal
   * parameters, but its jsdoc says that it takes one argument.
   * (The argument is used via arguments[0], but NTI does not detect this.)
   * @suppress {newCheckTypes}
   */
  goog.loadModuleFromSource_ = function() {
    // NOTE: we avoid declaring parameters or local variables here to avoid
    // masking globals or leaking values into the module definition.
    'use strict';
    var exports = {};
    eval(arguments[0]);
    return exports;
  };


  /**
   * Writes a new script pointing to {@code src} directly into the DOM.
   *
   * NOTE: This method is not CSP-compliant. @see goog.appendScriptSrcNode_ for
   * the fallback mechanism.
   *
   * @param {string} src The script URL.
   * @private
   */
  goog.writeScriptSrcNode_ = function(src) {
    goog.global.document.write(
        '<script type="text/javascript" src="' + src + '"></' + 'script>');
  };


  /**
   * Appends a new script node to the DOM using a CSP-compliant mechanism. This
   * method exists as a fallback for document.write (which is not allowed in a
   * strict CSP context, e.g., Chrome apps).
   *
   * NOTE: This method is not analogous to using document.write to insert a
   * <script> tag; specifically, the user agent will execute a script added by
   * document.write immediately after the current script block finishes
   * executing, whereas the DOM-appended script node will not be executed until
   * the entire document is parsed and executed. That is to say, this script is
   * added to the end of the script execution queue.
   *
   * The page must not attempt to call goog.required entities until after the
   * document has loaded, e.g., in or after the window.onload callback.
   *
   * @param {string} src The script URL.
   * @private
   */
  goog.appendScriptSrcNode_ = function(src) {
    /** @type {Document} */
    var doc = goog.global.document;
    var scriptEl = /** @type {HTMLScriptElement} */ (
        doc.createElement('script'));
    scriptEl.type = 'text/javascript';
    scriptEl.src = src;
    scriptEl.defer = false;
    scriptEl.async = false;
    doc.head.appendChild(scriptEl);
  };


  /**
   * The default implementation of the import function. Writes a script tag to
   * import the script.
   *
   * @param {string} src The script url.
   * @param {string=} opt_sourceText The optionally source text to evaluate
   * @return {boolean} True if the script was imported, false otherwise.
   * @private
   */
  goog.writeScriptTag_ = function(src, opt_sourceText) {
    if (goog.inHtmlDocument_()) {
      /** @type {!HTMLDocument} */
      var doc = goog.global.document;

      // If the user tries to require a new symbol after document load,
      // something has gone terribly wrong. Doing a document.write would
      // wipe out the page. This does not apply to the CSP-compliant method
      // of writing script tags.
      if (!goog.ENABLE_CHROME_APP_SAFE_SCRIPT_LOADING &&
          doc.readyState == 'complete') {
        // Certain test frameworks load base.js multiple times, which tries
        // to write deps.js each time. If that happens, just fail silently.
        // These frameworks wipe the page between each load of base.js, so this
        // is OK.
        var isDeps = /\bdeps.js$/.test(src);
        if (isDeps) {
          return false;
        } else {
          throw Error('Cannot write "' + src + '" after document load');
        }
      }

      var isOldIE = goog.IS_OLD_IE_;

      if (opt_sourceText === undefined) {
        if (!isOldIE) {
          if (goog.ENABLE_CHROME_APP_SAFE_SCRIPT_LOADING) {
            goog.appendScriptSrcNode_(src);
          } else {
            goog.writeScriptSrcNode_(src);
          }
        } else {
          var state = " onreadystatechange='goog.onScriptLoad_(this, " +
              ++goog.lastNonModuleScriptIndex_ + ")' ";
          doc.write(
              '<script type="text/javascript" src="' +
                  src + '"' + state + '></' + 'script>');
        }
      } else {
        doc.write(
            '<script type="text/javascript">' +
            opt_sourceText +
            '</' + 'script>');
      }
      return true;
    } else {
      return false;
    }
  };


  /** @private {number} */
  goog.lastNonModuleScriptIndex_ = 0;


  /**
   * A readystatechange handler for legacy IE
   * @param {!HTMLScriptElement} script
   * @param {number} scriptIndex
   * @return {boolean}
   * @private
   */
  goog.onScriptLoad_ = function(script, scriptIndex) {
    // for now load the modules when we reach the last script,
    // later allow more inter-mingling.
    if (script.readyState == 'complete' &&
        goog.lastNonModuleScriptIndex_ == scriptIndex) {
      goog.loadQueuedModules_();
    }
    return true;
  };

  /**
   * Resolves dependencies based on the dependencies added using addDependency
   * and calls importScript_ in the correct order.
   * @param {string} pathToLoad The path from which to start discovering
   *     dependencies.
   * @private
   */
  goog.writeScripts_ = function(pathToLoad) {
    /** @type {!Array<string>} The scripts we need to write this time. */
    var scripts = [];
    var seenScript = {};
    var deps = goog.dependencies_;

    /** @param {string} path */
    function visitNode(path) {
      if (path in deps.written) {
        return;
      }

      // We have already visited this one. We can get here if we have cyclic
      // dependencies.
      if (path in deps.visited) {
        return;
      }

      deps.visited[path] = true;

      if (path in deps.requires) {
        for (var requireName in deps.requires[path]) {
          // If the required name is defined, we assume that it was already
          // bootstrapped by other means.
          if (!goog.isProvided_(requireName)) {
            if (requireName in deps.nameToPath) {
              visitNode(deps.nameToPath[requireName]);
            } else {
              throw Error('Undefined nameToPath for ' + requireName);
            }
          }
        }
      }

      if (!(path in seenScript)) {
        seenScript[path] = true;
        scripts.push(path);
      }
    }

    visitNode(pathToLoad);

    // record that we are going to load all these scripts.
    for (var i = 0; i < scripts.length; i++) {
      var path = scripts[i];
      goog.dependencies_.written[path] = true;
    }

    // If a module is loaded synchronously then we need to
    // clear the current inModuleLoader value, and restore it when we are
    // done loading the current "requires".
    var moduleState = goog.moduleLoaderState_;
    goog.moduleLoaderState_ = null;

    for (var i = 0; i < scripts.length; i++) {
      var path = scripts[i];
      if (path) {
        if (!deps.pathIsModule[path]) {
          goog.importScript_(goog.basePath + path);
        } else {
          goog.importModule_(goog.basePath + path);
        }
      } else {
        goog.moduleLoaderState_ = moduleState;
        throw Error('Undefined script input');
      }
    }

    // restore the current "module loading state"
    goog.moduleLoaderState_ = moduleState;
  };


  /**
   * Looks at the dependency rules and tries to determine the script file that
   * fulfills a particular rule.
   * @param {string} rule In the form goog.namespace.Class or project.script.
   * @return {?string} Url corresponding to the rule, or null.
   * @private
   */
  goog.getPathFromDeps_ = function(rule) {
    if (rule in goog.dependencies_.nameToPath) {
      return goog.dependencies_.nameToPath[rule];
    } else {
      return null;
    }
  };

  goog.findBasePath_();

  // Allow projects to manage the deps files themselves.
  if (!goog.global.CLOSURE_NO_DEPS) {
    goog.importScript_(goog.basePath + 'deps.js');
  }
}


/**
 * Normalize a file path by removing redundant ".." and extraneous "." file
 * path components.
 * @param {string} path
 * @return {string}
 * @private
 */
goog.normalizePath_ = function(path) {
  var components = path.split('/');
  var i = 0;
  while (i < components.length) {
    if (components[i] == '.') {
      components.splice(i, 1);
    } else if (i && components[i] == '..' &&
        components[i - 1] && components[i - 1] != '..') {
      components.splice(--i, 2);
    } else {
      i++;
    }
  }
  return components.join('/');
};


/**
 * Loads file by synchronous XHR. Should not be used in production environments.
 * @param {string} src Source URL.
 * @return {string} File contents.
 * @private
 */
goog.loadFileSync_ = function(src) {
  if (goog.global.CLOSURE_LOAD_FILE_SYNC) {
    return goog.global.CLOSURE_LOAD_FILE_SYNC(src);
  } else {
    /** @type {XMLHttpRequest} */
    var xhr = new goog.global['XMLHttpRequest']();
    xhr.open('get', src, false);
    xhr.send();
    return xhr.responseText;
  }
};


/**
 * Retrieve and execute a module.
 * @param {string} src Script source URL.
 * @private
 */
goog.retrieveAndExecModule_ = function(src) {
  if (!COMPILED) {
    // The full but non-canonicalized URL for later use.
    var originalPath = src;
    // Canonicalize the path, removing any /./ or /../ since Chrome's debugging
    // console doesn't auto-canonicalize XHR loads as it does <script> srcs.
    src = goog.normalizePath_(src);

    var importScript = goog.global.CLOSURE_IMPORT_SCRIPT ||
        goog.writeScriptTag_;

    var scriptText = goog.loadFileSync_(src);

    if (scriptText != null) {
      var execModuleScript = goog.wrapModule_(src, scriptText);
      var isOldIE = goog.IS_OLD_IE_;
      if (isOldIE) {
        goog.dependencies_.deferred[originalPath] = execModuleScript;
        goog.queuedModules_.push(originalPath);
      } else {
        importScript(src, execModuleScript);
      }
    } else {
      throw new Error('load of ' + src + 'failed');
    }
  }
};


//==============================================================================
// Language Enhancements
//==============================================================================


/**
 * This is a "fixed" version of the typeof operator.  It differs from the typeof
 * operator in such a way that null returns 'null' and arrays return 'array'.
 * @param {?} value The value to get the type of.
 * @return {string} The name of the type.
 */
goog.typeOf = function(value) {
  var s = typeof value;
  if (s == 'object') {
    if (value) {
      // Check these first, so we can avoid calling Object.prototype.toString if
      // possible.
      //
      // IE improperly marshals tyepof across execution contexts, but a
      // cross-context object will still return false for "instanceof Object".
      if (value instanceof Array) {
        return 'array';
      } else if (value instanceof Object) {
        return s;
      }

      // HACK: In order to use an Object prototype method on the arbitrary
      //   value, the compiler requires the value be cast to type Object,
      //   even though the ECMA spec explicitly allows it.
      var className = Object.prototype.toString.call(
          /** @type {!Object} */ (value));
      // In Firefox 3.6, attempting to access iframe window objects' length
      // property throws an NS_ERROR_FAILURE, so we need to special-case it
      // here.
      if (className == '[object Window]') {
        return 'object';
      }

      // We cannot always use constructor == Array or instanceof Array because
      // different frames have different Array objects. In IE6, if the iframe
      // where the array was created is destroyed, the array loses its
      // prototype. Then dereferencing val.splice here throws an exception, so
      // we can't use goog.isFunction. Calling typeof directly returns 'unknown'
      // so that will work. In this case, this function will return false and
      // most array functions will still work because the array is still
      // array-like (supports length and []) even though it has lost its
      // prototype.
      // Mark Miller noticed that Object.prototype.toString
      // allows access to the unforgeable [[Class]] property.
      //  15.2.4.2 Object.prototype.toString ( )
      //  When the toString method is called, the following steps are taken:
      //      1. Get the [[Class]] property of this object.
      //      2. Compute a string value by concatenating the three strings
      //         "[object ", Result(1), and "]".
      //      3. Return Result(2).
      // and this behavior survives the destruction of the execution context.
      if ((className == '[object Array]' ||
           // In IE all non value types are wrapped as objects across window
           // boundaries (not iframe though) so we have to do object detection
           // for this edge case.
           typeof value.length == 'number' &&
           typeof value.splice != 'undefined' &&
           typeof value.propertyIsEnumerable != 'undefined' &&
           !value.propertyIsEnumerable('splice')

          )) {
        return 'array';
      }
      // HACK: There is still an array case that fails.
      //     function ArrayImpostor() {}
      //     ArrayImpostor.prototype = [];
      //     var impostor = new ArrayImpostor;
      // this can be fixed by getting rid of the fast path
      // (value instanceof Array) and solely relying on
      // (value && Object.prototype.toString.vall(value) === '[object Array]')
      // but that would require many more function calls and is not warranted
      // unless closure code is receiving objects from untrusted sources.

      // IE in cross-window calls does not correctly marshal the function type
      // (it appears just as an object) so we cannot use just typeof val ==
      // 'function'. However, if the object has a call property, it is a
      // function.
      if ((className == '[object Function]' ||
          typeof value.call != 'undefined' &&
          typeof value.propertyIsEnumerable != 'undefined' &&
          !value.propertyIsEnumerable('call'))) {
        return 'function';
      }

    } else {
      return 'null';
    }

  } else if (s == 'function' && typeof value.call == 'undefined') {
    // In Safari typeof nodeList returns 'function', and on Firefox typeof
    // behaves similarly for HTML{Applet,Embed,Object}, Elements and RegExps. We
    // would like to return object for those and we can detect an invalid
    // function by making sure that the function object has a call method.
    return 'object';
  }
  return s;
};


/**
 * Returns true if the specified value is null.
 * @param {?} val Variable to test.
 * @return {boolean} Whether variable is null.
 */
goog.isNull = function(val) {
  return val === null;
};


/**
 * Returns true if the specified value is defined and not null.
 * @param {?} val Variable to test.
 * @return {boolean} Whether variable is defined and not null.
 */
goog.isDefAndNotNull = function(val) {
  // Note that undefined == null.
  return val != null;
};


/**
 * Returns true if the specified value is an array.
 * @param {?} val Variable to test.
 * @return {boolean} Whether variable is an array.
 */
goog.isArray = function(val) {
  return goog.typeOf(val) == 'array';
};


/**
 * Returns true if the object looks like an array. To qualify as array like
 * the value needs to be either a NodeList or an object with a Number length
 * property. As a special case, a function value is not array like, because its
 * length property is fixed to correspond to the number of expected arguments.
 * @param {?} val Variable to test.
 * @return {boolean} Whether variable is an array.
 */
goog.isArrayLike = function(val) {
  var type = goog.typeOf(val);
  // We do not use goog.isObject here in order to exclude function values.
  return type == 'array' || type == 'object' && typeof val.length == 'number';
};


/**
 * Returns true if the object looks like a Date. To qualify as Date-like the
 * value needs to be an object and have a getFullYear() function.
 * @param {?} val Variable to test.
 * @return {boolean} Whether variable is a like a Date.
 */
goog.isDateLike = function(val) {
  return goog.isObject(val) && typeof val.getFullYear == 'function';
};


/**
 * Returns true if the specified value is a string.
 * @param {?} val Variable to test.
 * @return {boolean} Whether variable is a string.
 */
goog.isString = function(val) {
  return typeof val == 'string';
};


/**
 * Returns true if the specified value is a boolean.
 * @param {?} val Variable to test.
 * @return {boolean} Whether variable is boolean.
 */
goog.isBoolean = function(val) {
  return typeof val == 'boolean';
};


/**
 * Returns true if the specified value is a number.
 * @param {?} val Variable to test.
 * @return {boolean} Whether variable is a number.
 */
goog.isNumber = function(val) {
  return typeof val == 'number';
};


/**
 * Returns true if the specified value is a function.
 * @param {?} val Variable to test.
 * @return {boolean} Whether variable is a function.
 */
goog.isFunction = function(val) {
  return goog.typeOf(val) == 'function';
};


/**
 * Returns true if the specified value is an object.  This includes arrays and
 * functions.
 * @param {?} val Variable to test.
 * @return {boolean} Whether variable is an object.
 */
goog.isObject = function(val) {
  var type = typeof val;
  return type == 'object' && val != null || type == 'function';
  // return Object(val) === val also works, but is slower, especially if val is
  // not an object.
};


/**
 * Gets a unique ID for an object. This mutates the object so that further calls
 * with the same object as a parameter returns the same value. The unique ID is
 * guaranteed to be unique across the current session amongst objects that are
 * passed into {@code getUid}. There is no guarantee that the ID is unique or
 * consistent across sessions. It is unsafe to generate unique ID for function
 * prototypes.
 *
 * @param {Object} obj The object to get the unique ID for.
 * @return {number} The unique ID for the object.
 */
goog.getUid = function(obj) {
  // TODO(arv): Make the type stricter, do not accept null.

  // In Opera window.hasOwnProperty exists but always returns false so we avoid
  // using it. As a consequence the unique ID generated for BaseClass.prototype
  // and SubClass.prototype will be the same.
  return obj[goog.UID_PROPERTY_] ||
      (obj[goog.UID_PROPERTY_] = ++goog.uidCounter_);
};


/**
 * Whether the given object is already assigned a unique ID.
 *
 * This does not modify the object.
 *
 * @param {!Object} obj The object to check.
 * @return {boolean} Whether there is an assigned unique id for the object.
 */
goog.hasUid = function(obj) {
  return !!obj[goog.UID_PROPERTY_];
};


/**
 * Removes the unique ID from an object. This is useful if the object was
 * previously mutated using {@code goog.getUid} in which case the mutation is
 * undone.
 * @param {Object} obj The object to remove the unique ID field from.
 */
goog.removeUid = function(obj) {
  // TODO(arv): Make the type stricter, do not accept null.

  // In IE, DOM nodes are not instances of Object and throw an exception if we
  // try to delete.  Instead we try to use removeAttribute.
  if (obj !== null && 'removeAttribute' in obj) {
    obj.removeAttribute(goog.UID_PROPERTY_);
  }
  /** @preserveTry */
  try {
    delete obj[goog.UID_PROPERTY_];
  } catch (ex) {
  }
};


/**
 * Name for unique ID property. Initialized in a way to help avoid collisions
 * with other closure JavaScript on the same page.
 * @type {string}
 * @private
 */
goog.UID_PROPERTY_ = 'closure_uid_' + ((Math.random() * 1e9) >>> 0);


/**
 * Counter for UID.
 * @type {number}
 * @private
 */
goog.uidCounter_ = 0;


/**
 * Adds a hash code field to an object. The hash code is unique for the
 * given object.
 * @param {Object} obj The object to get the hash code for.
 * @return {number} The hash code for the object.
 * @deprecated Use goog.getUid instead.
 */
goog.getHashCode = goog.getUid;


/**
 * Removes the hash code field from an object.
 * @param {Object} obj The object to remove the field from.
 * @deprecated Use goog.removeUid instead.
 */
goog.removeHashCode = goog.removeUid;


/**
 * Clones a value. The input may be an Object, Array, or basic type. Objects and
 * arrays will be cloned recursively.
 *
 * WARNINGS:
 * <code>goog.cloneObject</code> does not detect reference loops. Objects that
 * refer to themselves will cause infinite recursion.
 *
 * <code>goog.cloneObject</code> is unaware of unique identifiers, and copies
 * UIDs created by <code>getUid</code> into cloned results.
 *
 * @param {*} obj The value to clone.
 * @return {*} A clone of the input value.
 * @deprecated goog.cloneObject is unsafe. Prefer the goog.object methods.
 */
goog.cloneObject = function(obj) {
  var type = goog.typeOf(obj);
  if (type == 'object' || type == 'array') {
    if (obj.clone) {
      return obj.clone();
    }
    var clone = type == 'array' ? [] : {};
    for (var key in obj) {
      clone[key] = goog.cloneObject(obj[key]);
    }
    return clone;
  }

  return obj;
};


/**
 * A native implementation of goog.bind.
 * @param {Function} fn A function to partially apply.
 * @param {Object|undefined} selfObj Specifies the object which this should
 *     point to when the function is run.
 * @param {...*} var_args Additional arguments that are partially applied to the
 *     function.
 * @return {!Function} A partially-applied form of the function bind() was
 *     invoked as a method of.
 * @private
 * @suppress {deprecated} The compiler thinks that Function.prototype.bind is
 *     deprecated because some people have declared a pure-JS version.
 *     Only the pure-JS version is truly deprecated.
 */
goog.bindNative_ = function(fn, selfObj, var_args) {
  return /** @type {!Function} */ (fn.call.apply(fn.bind, arguments));
};


/**
 * A pure-JS implementation of goog.bind.
 * @param {Function} fn A function to partially apply.
 * @param {Object|undefined} selfObj Specifies the object which this should
 *     point to when the function is run.
 * @param {...*} var_args Additional arguments that are partially applied to the
 *     function.
 * @return {!Function} A partially-applied form of the function bind() was
 *     invoked as a method of.
 * @private
 */
goog.bindJs_ = function(fn, selfObj, var_args) {
  if (!fn) {
    throw new Error();
  }

  if (arguments.length > 2) {
    var boundArgs = Array.prototype.slice.call(arguments, 2);
    return function() {
      // Prepend the bound arguments to the current arguments.
      var newArgs = Array.prototype.slice.call(arguments);
      Array.prototype.unshift.apply(newArgs, boundArgs);
      return fn.apply(selfObj, newArgs);
    };

  } else {
    return function() {
      return fn.apply(selfObj, arguments);
    };
  }
};


/**
 * Partially applies this function to a particular 'this object' and zero or
 * more arguments. The result is a new function with some arguments of the first
 * function pre-filled and the value of this 'pre-specified'.
 *
 * Remaining arguments specified at call-time are appended to the pre-specified
 * ones.
 *
 * Also see: {@link #partial}.
 *
 * Usage:
 * <pre>var barMethBound = goog.bind(myFunction, myObj, 'arg1', 'arg2');
 * barMethBound('arg3', 'arg4');</pre>
 *
 * @param {?function(this:T, ...)} fn A function to partially apply.
 * @param {T} selfObj Specifies the object which this should point to when the
 *     function is run.
 * @param {...*} var_args Additional arguments that are partially applied to the
 *     function.
 * @return {!Function} A partially-applied form of the function goog.bind() was
 *     invoked as a method of.
 * @template T
 * @suppress {deprecated} See above.
 */
goog.bind = function(fn, selfObj, var_args) {
  // TODO(nicksantos): narrow the type signature.
  if (Function.prototype.bind &&
      // NOTE(nicksantos): Somebody pulled base.js into the default Chrome
      // extension environment. This means that for Chrome extensions, they get
      // the implementation of Function.prototype.bind that calls goog.bind
      // instead of the native one. Even worse, we don't want to introduce a
      // circular dependency between goog.bind and Function.prototype.bind, so
      // we have to hack this to make sure it works correctly.
      Function.prototype.bind.toString().indexOf('native code') != -1) {
    goog.bind = goog.bindNative_;
  } else {
    goog.bind = goog.bindJs_;
  }
  return goog.bind.apply(null, arguments);
};


/**
 * Like goog.bind(), except that a 'this object' is not required. Useful when
 * the target function is already bound.
 *
 * Usage:
 * var g = goog.partial(f, arg1, arg2);
 * g(arg3, arg4);
 *
 * @param {Function} fn A function to partially apply.
 * @param {...*} var_args Additional arguments that are partially applied to fn.
 * @return {!Function} A partially-applied form of the function goog.partial()
 *     was invoked as a method of.
 */
goog.partial = function(fn, var_args) {
  var args = Array.prototype.slice.call(arguments, 1);
  return function() {
    // Clone the array (with slice()) and append additional arguments
    // to the existing arguments.
    var newArgs = args.slice();
    newArgs.push.apply(newArgs, arguments);
    return fn.apply(this, newArgs);
  };
};


/**
 * Copies all the members of a source object to a target object. This method
 * does not work on all browsers for all objects that contain keys such as
 * toString or hasOwnProperty. Use goog.object.extend for this purpose.
 * @param {Object} target Target.
 * @param {Object} source Source.
 */
goog.mixin = function(target, source) {
  for (var x in source) {
    target[x] = source[x];
  }

  // For IE7 or lower, the for-in-loop does not contain any properties that are
  // not enumerable on the prototype object (for example, isPrototypeOf from
  // Object.prototype) but also it will not include 'replace' on objects that
  // extend String and change 'replace' (not that it is common for anyone to
  // extend anything except Object).
};


/**
 * @return {number} An integer value representing the number of milliseconds
 *     between midnight, January 1, 1970 and the current time.
 */
goog.now = (goog.TRUSTED_SITE && Date.now) || (function() {
  // Unary plus operator converts its operand to a number which in the case of
  // a date is done by calling getTime().
  return +new Date();
});


/**
 * Evals JavaScript in the global scope.  In IE this uses execScript, other
 * browsers use goog.global.eval. If goog.global.eval does not evaluate in the
 * global scope (for example, in Safari), appends a script tag instead.
 * Throws an exception if neither execScript or eval is defined.
 * @param {string} script JavaScript string.
 */
goog.globalEval = function(script) {
  if (goog.global.execScript) {
    goog.global.execScript(script, 'JavaScript');
  } else if (goog.global.eval) {
    // Test to see if eval works
    if (goog.evalWorksForGlobals_ == null) {
      goog.global.eval('var _evalTest_ = 1;');
      if (typeof goog.global['_evalTest_'] != 'undefined') {
        try {
          delete goog.global['_evalTest_'];
        } catch (ignore) {
          // Microsoft edge fails the deletion above in strict mode.
        }
        goog.evalWorksForGlobals_ = true;
      } else {
        goog.evalWorksForGlobals_ = false;
      }
    }

    if (goog.evalWorksForGlobals_) {
      goog.global.eval(script);
    } else {
      /** @type {Document} */
      var doc = goog.global.document;
      var scriptElt = /** @type {!HTMLScriptElement} */ (
          doc.createElement('SCRIPT'));
      scriptElt.type = 'text/javascript';
      scriptElt.defer = false;
      // Note(user): can't use .innerHTML since "t('<test>')" will fail and
      // .text doesn't work in Safari 2.  Therefore we append a text node.
      scriptElt.appendChild(doc.createTextNode(script));
      doc.body.appendChild(scriptElt);
      doc.body.removeChild(scriptElt);
    }
  } else {
    throw Error('goog.globalEval not available');
  }
};


/**
 * Indicates whether or not we can call 'eval' directly to eval code in the
 * global scope. Set to a Boolean by the first call to goog.globalEval (which
 * empirically tests whether eval works for globals). @see goog.globalEval
 * @type {?boolean}
 * @private
 */
goog.evalWorksForGlobals_ = null;


/**
 * Optional map of CSS class names to obfuscated names used with
 * goog.getCssName().
 * @private {!Object<string, string>|undefined}
 * @see goog.setCssNameMapping
 */
goog.cssNameMapping_;


/**
 * Optional obfuscation style for CSS class names. Should be set to either
 * 'BY_WHOLE' or 'BY_PART' if defined.
 * @type {string|undefined}
 * @private
 * @see goog.setCssNameMapping
 */
goog.cssNameMappingStyle_;


/**
 * Handles strings that are intended to be used as CSS class names.
 *
 * This function works in tandem with @see goog.setCssNameMapping.
 *
 * Without any mapping set, the arguments are simple joined with a hyphen and
 * passed through unaltered.
 *
 * When there is a mapping, there are two possible styles in which these
 * mappings are used. In the BY_PART style, each part (i.e. in between hyphens)
 * of the passed in css name is rewritten according to the map. In the BY_WHOLE
 * style, the full css name is looked up in the map directly. If a rewrite is
 * not specified by the map, the compiler will output a warning.
 *
 * When the mapping is passed to the compiler, it will replace calls to
 * goog.getCssName with the strings from the mapping, e.g.
 *     var x = goog.getCssName('foo');
 *     var y = goog.getCssName(this.baseClass, 'active');
 *  becomes:
 *     var x = 'foo';
 *     var y = this.baseClass + '-active';
 *
 * If one argument is passed it will be processed, if two are passed only the
 * modifier will be processed, as it is assumed the first argument was generated
 * as a result of calling goog.getCssName.
 *
 * @param {string} className The class name.
 * @param {string=} opt_modifier A modifier to be appended to the class name.
 * @return {string} The class name or the concatenation of the class name and
 *     the modifier.
 */
goog.getCssName = function(className, opt_modifier) {
  var getMapping = function(cssName) {
    return goog.cssNameMapping_[cssName] || cssName;
  };

  var renameByParts = function(cssName) {
    // Remap all the parts individually.
    var parts = cssName.split('-');
    var mapped = [];
    for (var i = 0; i < parts.length; i++) {
      mapped.push(getMapping(parts[i]));
    }
    return mapped.join('-');
  };

  var rename;
  if (goog.cssNameMapping_) {
    rename = goog.cssNameMappingStyle_ == 'BY_WHOLE' ?
        getMapping : renameByParts;
  } else {
    rename = function(a) {
      return a;
    };
  }

  if (opt_modifier) {
    return className + '-' + rename(opt_modifier);
  } else {
    return rename(className);
  }
};


/**
 * Sets the map to check when returning a value from goog.getCssName(). Example:
 * <pre>
 * goog.setCssNameMapping({
 *   "goog": "a",
 *   "disabled": "b",
 * });
 *
 * var x = goog.getCssName('goog');
 * // The following evaluates to: "a a-b".
 * goog.getCssName('goog') + ' ' + goog.getCssName(x, 'disabled')
 * </pre>
 * When declared as a map of string literals to string literals, the JSCompiler
 * will replace all calls to goog.getCssName() using the supplied map if the
 * --process_closure_primitives flag is set.
 *
 * @param {!Object} mapping A map of strings to strings where keys are possible
 *     arguments to goog.getCssName() and values are the corresponding values
 *     that should be returned.
 * @param {string=} opt_style The style of css name mapping. There are two valid
 *     options: 'BY_PART', and 'BY_WHOLE'.
 * @see goog.getCssName for a description.
 */
goog.setCssNameMapping = function(mapping, opt_style) {
  goog.cssNameMapping_ = mapping;
  goog.cssNameMappingStyle_ = opt_style;
};


/**
 * To use CSS renaming in compiled mode, one of the input files should have a
 * call to goog.setCssNameMapping() with an object literal that the JSCompiler
 * can extract and use to replace all calls to goog.getCssName(). In uncompiled
 * mode, JavaScript code should be loaded before this base.js file that declares
 * a global variable, CLOSURE_CSS_NAME_MAPPING, which is used below. This is
 * to ensure that the mapping is loaded before any calls to goog.getCssName()
 * are made in uncompiled mode.
 *
 * A hook for overriding the CSS name mapping.
 * @type {!Object<string, string>|undefined}
 */
goog.global.CLOSURE_CSS_NAME_MAPPING;


if (!COMPILED && goog.global.CLOSURE_CSS_NAME_MAPPING) {
  // This does not call goog.setCssNameMapping() because the JSCompiler
  // requires that goog.setCssNameMapping() be called with an object literal.
  goog.cssNameMapping_ = goog.global.CLOSURE_CSS_NAME_MAPPING;
}


/**
 * Gets a localized message.
 *
 * This function is a compiler primitive. If you give the compiler a localized
 * message bundle, it will replace the string at compile-time with a localized
 * version, and expand goog.getMsg call to a concatenated string.
 *
 * Messages must be initialized in the form:
 * <code>
 * var MSG_NAME = goog.getMsg('Hello {$placeholder}', {'placeholder': 'world'});
 * </code>
 *
 * @param {string} str Translatable string, places holders in the form {$foo}.
 * @param {Object<string, string>=} opt_values Maps place holder name to value.
 * @return {string} message with placeholders filled.
 */
goog.getMsg = function(str, opt_values) {
  if (opt_values) {
    str = str.replace(/\{\$([^}]+)}/g, function(match, key) {
      return (opt_values != null && key in opt_values) ?
          opt_values[key] : match;
    });
  }
  return str;
};


/**
 * Gets a localized message. If the message does not have a translation, gives a
 * fallback message.
 *
 * This is useful when introducing a new message that has not yet been
 * translated into all languages.
 *
 * This function is a compiler primitive. Must be used in the form:
 * <code>var x = goog.getMsgWithFallback(MSG_A, MSG_B);</code>
 * where MSG_A and MSG_B were initialized with goog.getMsg.
 *
 * @param {string} a The preferred message.
 * @param {string} b The fallback message.
 * @return {string} The best translated message.
 */
goog.getMsgWithFallback = function(a, b) {
  return a;
};


/**
 * Exposes an unobfuscated global namespace path for the given object.
 * Note that fields of the exported object *will* be obfuscated, unless they are
 * exported in turn via this function or goog.exportProperty.
 *
 * Also handy for making public items that are defined in anonymous closures.
 *
 * ex. goog.exportSymbol('public.path.Foo', Foo);
 *
 * ex. goog.exportSymbol('public.path.Foo.staticFunction', Foo.staticFunction);
 *     public.path.Foo.staticFunction();
 *
 * ex. goog.exportSymbol('public.path.Foo.prototype.myMethod',
 *                       Foo.prototype.myMethod);
 *     new public.path.Foo().myMethod();
 *
 * @param {string} publicPath Unobfuscated name to export.
 * @param {*} object Object the name should point to.
 * @param {Object=} opt_objectToExportTo The object to add the path to; default
 *     is goog.global.
 */
goog.exportSymbol = function(publicPath, object, opt_objectToExportTo) {
  goog.exportPath_(publicPath, object, opt_objectToExportTo);
};


/**
 * Exports a property unobfuscated into the object's namespace.
 * ex. goog.exportProperty(Foo, 'staticFunction', Foo.staticFunction);
 * ex. goog.exportProperty(Foo.prototype, 'myMethod', Foo.prototype.myMethod);
 * @param {Object} object Object whose static property is being exported.
 * @param {string} publicName Unobfuscated name to export.
 * @param {*} symbol Object the name should point to.
 */
goog.exportProperty = function(object, publicName, symbol) {
  object[publicName] = symbol;
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * Usage:
 * <pre>
 * function ParentClass(a, b) { }
 * ParentClass.prototype.foo = function(a) { };
 *
 * function ChildClass(a, b, c) {
 *   ChildClass.base(this, 'constructor', a, b);
 * }
 * goog.inherits(ChildClass, ParentClass);
 *
 * var child = new ChildClass('a', 'b', 'see');
 * child.foo(); // This works.
 * </pre>
 *
 * @param {!Function} childCtor Child class.
 * @param {!Function} parentCtor Parent class.
 */
goog.inherits = function(childCtor, parentCtor) {
  /** @constructor */
  function tempCtor() {}
  tempCtor.prototype = parentCtor.prototype;
  childCtor.superClass_ = parentCtor.prototype;
  childCtor.prototype = new tempCtor();
  /** @override */
  childCtor.prototype.constructor = childCtor;

  /**
   * Calls superclass constructor/method.
   *
   * This function is only available if you use goog.inherits to
   * express inheritance relationships between classes.
   *
   * NOTE: This is a replacement for goog.base and for superClass_
   * property defined in childCtor.
   *
   * @param {!Object} me Should always be "this".
   * @param {string} methodName The method name to call. Calling
   *     superclass constructor can be done with the special string
   *     'constructor'.
   * @param {...*} var_args The arguments to pass to superclass
   *     method/constructor.
   * @return {*} The return value of the superclass method/constructor.
   */
  childCtor.base = function(me, methodName, var_args) {
    // Copying using loop to avoid deop due to passing arguments object to
    // function. This is faster in many JS engines as of late 2014.
    var args = new Array(arguments.length - 2);
    for (var i = 2; i < arguments.length; i++) {
      args[i - 2] = arguments[i];
    }
    return parentCtor.prototype[methodName].apply(me, args);
  };
};


/**
 * Call up to the superclass.
 *
 * If this is called from a constructor, then this calls the superclass
 * constructor with arguments 1-N.
 *
 * If this is called from a prototype method, then you must pass the name of the
 * method as the second argument to this function. If you do not, you will get a
 * runtime error. This calls the superclass' method with arguments 2-N.
 *
 * This function only works if you use goog.inherits to express inheritance
 * relationships between your classes.
 *
 * This function is a compiler primitive. At compile-time, the compiler will do
 * macro expansion to remove a lot of the extra overhead that this function
 * introduces. The compiler will also enforce a lot of the assumptions that this
 * function makes, and treat it as a compiler error if you break them.
 *
 * @param {!Object} me Should always be "this".
 * @param {*=} opt_methodName The method name if calling a super method.
 * @param {...*} var_args The rest of the arguments.
 * @return {*} The return value of the superclass method.
 * @suppress {es5Strict} This method can not be used in strict mode, but
 *     all Closure Library consumers must depend on this file.
 */
goog.base = function(me, opt_methodName, var_args) {
  var caller = arguments.callee.caller;

  if (goog.STRICT_MODE_COMPATIBLE || (goog.DEBUG && !caller)) {
    throw Error('arguments.caller not defined.  goog.base() cannot be used ' +
                'with strict mode code. See ' +
                'http://www.ecma-international.org/ecma-262/5.1/#sec-C');
  }

  if (caller.superClass_) {
    // Copying using loop to avoid deop due to passing arguments object to
    // function. This is faster in many JS engines as of late 2014.
    var ctorArgs = new Array(arguments.length - 1);
    for (var i = 1; i < arguments.length; i++) {
      ctorArgs[i - 1] = arguments[i];
    }
    // This is a constructor. Call the superclass constructor.
    return caller.superClass_.constructor.apply(me, ctorArgs);
  }

  // Copying using loop to avoid deop due to passing arguments object to
  // function. This is faster in many JS engines as of late 2014.
  var args = new Array(arguments.length - 2);
  for (var i = 2; i < arguments.length; i++) {
    args[i - 2] = arguments[i];
  }
  var foundCaller = false;
  for (var ctor = me.constructor;
       ctor; ctor = ctor.superClass_ && ctor.superClass_.constructor) {
    if (ctor.prototype[opt_methodName] === caller) {
      foundCaller = true;
    } else if (foundCaller) {
      return ctor.prototype[opt_methodName].apply(me, args);
    }
  }

  // If we did not find the caller in the prototype chain, then one of two
  // things happened:
  // 1) The caller is an instance method.
  // 2) This method was not called by the right caller.
  if (me[opt_methodName] === caller) {
    return me.constructor.prototype[opt_methodName].apply(me, args);
  } else {
    throw Error(
        'goog.base called from a method of one name ' +
        'to a method of a different name');
  }
};


/**
 * Allow for aliasing within scope functions.  This function exists for
 * uncompiled code - in compiled code the calls will be inlined and the aliases
 * applied.  In uncompiled code the function is simply run since the aliases as
 * written are valid JavaScript.
 *
 *
 * @param {function()} fn Function to call.  This function can contain aliases
 *     to namespaces (e.g. "var dom = goog.dom") or classes
 *     (e.g. "var Timer = goog.Timer").
 */
goog.scope = function(fn) {
  fn.call(goog.global);
};


/*
 * To support uncompiled, strict mode bundles that use eval to divide source
 * like so:
 *    eval('someSource;//# sourceUrl sourcefile.js');
 * We need to export the globally defined symbols "goog" and "COMPILED".
 * Exporting "goog" breaks the compiler optimizations, so we required that
 * be defined externally.
 * NOTE: We don't use goog.exportSymbol here because we don't want to trigger
 * extern generation when that compiler option is enabled.
 */
if (!COMPILED) {
  goog.global['COMPILED'] = COMPILED;
}


//==============================================================================
// goog.defineClass implementation
//==============================================================================


/**
 * Creates a restricted form of a Closure "class":
 *   - from the compiler's perspective, the instance returned from the
 *     constructor is sealed (no new properties may be added).  This enables
 *     better checks.
 *   - the compiler will rewrite this definition to a form that is optimal
 *     for type checking and optimization (initially this will be a more
 *     traditional form).
 *
 * @param {Function} superClass The superclass, Object or null.
 * @param {goog.defineClass.ClassDescriptor} def
 *     An object literal describing
 *     the class.  It may have the following properties:
 *     "constructor": the constructor function
 *     "statics": an object literal containing methods to add to the constructor
 *        as "static" methods or a function that will receive the constructor
 *        function as its only parameter to which static properties can
 *        be added.
 *     all other properties are added to the prototype.
 * @return {!Function} The class constructor.
 */
goog.defineClass = function(superClass, def) {
  // TODO(johnlenz): consider making the superClass an optional parameter.
  var constructor = def.constructor;
  var statics = def.statics;
  // Wrap the constructor prior to setting up the prototype and static methods.
  if (!constructor || constructor == Object.prototype.constructor) {
    constructor = function() {
      throw Error('cannot instantiate an interface (no constructor defined).');
    };
  }

  var cls = goog.defineClass.createSealingConstructor_(constructor, superClass);
  if (superClass) {
    goog.inherits(cls, superClass);
  }

  // Remove all the properties that should not be copied to the prototype.
  delete def.constructor;
  delete def.statics;

  goog.defineClass.applyProperties_(cls.prototype, def);
  if (statics != null) {
    if (statics instanceof Function) {
      statics(cls);
    } else {
      goog.defineClass.applyProperties_(cls, statics);
    }
  }

  return cls;
};


/**
 * @typedef {{
 *   constructor: (!Function|undefined),
 *   statics: (Object|undefined|function(Function):void)
 * }}
 * @suppress {missingProvide}
 */
goog.defineClass.ClassDescriptor;


/**
 * @define {boolean} Whether the instances returned by
 * goog.defineClass should be sealed when possible.
 */
goog.define('goog.defineClass.SEAL_CLASS_INSTANCES', goog.DEBUG);


/**
 * If goog.defineClass.SEAL_CLASS_INSTANCES is enabled and Object.seal is
 * defined, this function will wrap the constructor in a function that seals the
 * results of the provided constructor function.
 *
 * @param {!Function} ctr The constructor whose results maybe be sealed.
 * @param {Function} superClass The superclass constructor.
 * @return {!Function} The replacement constructor.
 * @private
 */
goog.defineClass.createSealingConstructor_ = function(ctr, superClass) {
  if (goog.defineClass.SEAL_CLASS_INSTANCES &&
      Object.seal instanceof Function) {
    // Don't seal subclasses of unsealable-tagged legacy classes.
    if (superClass && superClass.prototype &&
        superClass.prototype[goog.UNSEALABLE_CONSTRUCTOR_PROPERTY_]) {
      return ctr;
    }
    /**
     * @this {Object}
     * @return {?}
     */
    var wrappedCtr = function() {
      // Don't seal an instance of a subclass when it calls the constructor of
      // its super class as there is most likely still setup to do.
      var instance = ctr.apply(this, arguments) || this;
      instance[goog.UID_PROPERTY_] = instance[goog.UID_PROPERTY_];
      if (this.constructor === wrappedCtr) {
        Object.seal(instance);
      }
      return instance;
    };
    return wrappedCtr;
  }
  return ctr;
};


// TODO(johnlenz): share these values with the goog.object
/**
 * The names of the fields that are defined on Object.prototype.
 * @type {!Array<string>}
 * @private
 * @const
 */
goog.defineClass.OBJECT_PROTOTYPE_FIELDS_ = [
  'constructor',
  'hasOwnProperty',
  'isPrototypeOf',
  'propertyIsEnumerable',
  'toLocaleString',
  'toString',
  'valueOf'
];


// TODO(johnlenz): share this function with the goog.object
/**
 * @param {!Object} target The object to add properties to.
 * @param {!Object} source The object to copy properties from.
 * @private
 */
goog.defineClass.applyProperties_ = function(target, source) {
  // TODO(johnlenz): update this to support ES5 getters/setters

  var key;
  for (key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      target[key] = source[key];
    }
  }

  // For IE the for-in-loop does not contain any properties that are not
  // enumerable on the prototype object (for example isPrototypeOf from
  // Object.prototype) and it will also not include 'replace' on objects that
  // extend String and change 'replace' (not that it is common for anyone to
  // extend anything except Object).
  for (var i = 0; i < goog.defineClass.OBJECT_PROTOTYPE_FIELDS_.length; i++) {
    key = goog.defineClass.OBJECT_PROTOTYPE_FIELDS_[i];
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      target[key] = source[key];
    }
  }
};


/**
 * Sealing classes breaks the older idiom of assigning properties on the
 * prototype rather than in the constructor.  As such, goog.defineClass
 * must not seal subclasses of these old-style classes until they are fixed.
 * Until then, this marks a class as "broken", instructing defineClass
 * not to seal subclasses.
 * @param {!Function} ctr The legacy constructor to tag as unsealable.
 */
goog.tagUnsealableClass = function(ctr) {
  if (!COMPILED && goog.defineClass.SEAL_CLASS_INSTANCES) {
    ctr.prototype[goog.UNSEALABLE_CONSTRUCTOR_PROPERTY_] = true;
  }
};


/**
 * Name for unsealable tag property.
 * @const @private {string}
 */
goog.UNSEALABLE_CONSTRUCTOR_PROPERTY_ = 'goog_defineClass_legacy_unsealable';
goog.provide('atlas');
goog.provide('atlas.Data');
goog.provide('atlas.Page');
goog.provide('atlas.Site');

/**
 * @constructor
 */
atlas.Page = function() {
  var page = this;
  page.name = "";
  page.w = 0;
  page.h = 0;
  page.format = "RGBA8888";
  page.min_filter = "linear";
  page.mag_filter = "linear";
  page.wrap_s = "clamp-to-edge";
  page.wrap_t = "clamp-to-edge";
}

/**
 * @constructor
 */
atlas.Site = function() {
  var site = this;
  site.page = null;
  site.x = 0;
  site.y = 0;
  site.w = 0;
  site.h = 0;
  site.rotate = 0;
  site.offset_x = 0;
  site.offset_y = 0;
  site.original_w = 0;
  site.original_h = 0;
  site.index = -1;
}

/**
 * @constructor
 */
atlas.Data = function() {
  var data = this;
  data.pages = [];
  data.sites = {};
}

/**
 * @return {atlas.Data}
 */
atlas.Data.prototype.drop = function() {
  var data = this;
  data.pages = [];
  data.sites = {};
  return data;
}

/**
 * @return {atlas.Data}
 * @param {string} text
 */
atlas.Data.prototype.import = function(text) {
  return this.importAtlasText(text);
}

/**
 * @return {string}
 * @param {string=} text
 */
atlas.Data.prototype.export = function(text) {
  return this.exportAtlasText(text);
}

/**
 * @return {atlas.Data}
 * @param {string} text
 */
atlas.Data.prototype.importAtlasText = function(text) {
  var lines = text.split(/\n|\r\n/);
  return this.importAtlasTextLines(lines);
}

/**
 * @return {string}
 * @param {string=} text
 */
atlas.Data.prototype.exportAtlasText = function(text) {
  var lines = this.exportAtlasTextLines([])
  return (text || "") + lines.join('\n');
}

/**
 * @return {atlas.Data}
 * @param {Array.<string>} lines
 */
atlas.Data.prototype.importAtlasTextLines = function(lines) {
  var data = this;

  data.pages = [];
  data.sites = {};

  function trim(s) {
    return s.replace(/^\s+|\s+$/g, "");
  }

  var page = null;
  var site = null;

  var match = null;

  lines.forEach(function(line) {
    if (trim(line).length === 0) {
      page = null;
      site = null;
    } else if ((match = line.match(/^size: (.*),(.*)$/))) {
      page.w = parseInt(match[1], 10);
      page.h = parseInt(match[2], 10);
    } else if ((match = line.match(/^format: (.*)$/))) {
      page.format = match[1];
    } else if ((match = line.match(/^filter: (.*),(.*)$/))) {
      page.min_filter = match[1];
      page.mag_filter = match[2];
    } else if ((match = line.match(/^repeat: (.*)$/))) {
      var repeat = match[1];
      page.wrap_s = ((repeat === 'x') || (repeat === 'xy')) ? ('Repeat') : ('ClampToEdge');
      page.wrap_t = ((repeat === 'y') || (repeat === 'xy')) ? ('Repeat') : ('ClampToEdge');
    } else if ((match = line.match(/^orig: (.*)[,| x] (.*)$/))) {
      var original_w = parseInt(match[1], 10);
      var original_h = parseInt(match[2], 10);
      console.log("page:orig", original_w, original_h);
    } else if (page === null) {
      page = new atlas.Page();
      page.name = line;
      data.pages.push(page);
    } else {
      if ((match = line.match(/^ {2}rotate: (.*)$/))) {
        site.rotate = (match[1] !== 'false') ? (-1) : (0); // -90 degrees
      } else if ((match = line.match(/^ {2}xy: (.*), (.*)$/))) {
        site.x = parseInt(match[1], 10);
        site.y = parseInt(match[2], 10);
      } else if ((match = line.match(/^ {2}size: (.*), (.*)$/))) {
        site.w = parseInt(match[1], 10);
        site.h = parseInt(match[2], 10);
      } else if ((match = line.match(/^ {2}orig: (.*), (.*)$/))) {
        site.original_w = parseInt(match[1], 10);
        site.original_h = parseInt(match[2], 10);
      } else if ((match = line.match(/^ {2}offset: (.*), (.*)$/))) {
        site.offset_x = parseInt(match[1], 10);
        site.offset_y = parseInt(match[2], 10);
      } else if ((match = line.match(/^ {2}index: (.*)$/))) {
        site.index = parseInt(match[1], 10);
      } else {
        if (site) {
          site.original_w = site.original_w || site.w;
          site.original_h = site.original_h || site.h;
        }

        site = new atlas.Site();
        site.page = page;
        data.sites[line] = site;
      }
    }
  });

  return data;
}

/**
 * @return {string}
 * @param {Array.<string>=} lines
 */
atlas.Data.prototype.exportAtlasTextLines = function(lines) {
  lines = lines || [];

  var data = this;

  data.pages.forEach(function(page) {
    lines.push(""); // empty line denotes new page
    lines.push(page.name);
    lines.push("size: " + page.w + "," + page.h);
    lines.push("format: " + page.format);
    lines.push("filter: " + page.min_filter + "," + page.mag_filter);
    var repeat = 'none';
    if ((page.wrap_s === 'Repeat') && (page.wrap_t === 'Repeat')) {
      repeat = 'xy';
    } else if (page.wrap_s === 'Repeat') {
      repeat = 'x';
    } else if (page.wrap_t === 'Repeat') {
      repeat = 'y';
    }
    lines.push("repeat: " + repeat);

    Object.keys(data.sites).forEach(function(site_key) {
      var site = data.sites[site_key];
      if (site.page !== page) {
        return;
      }
      lines.push(site_key);
      lines.push("  rotate: " + (site.rotate !== 0 ? 'true' : 'false'));
      lines.push("  xy: " + site.x + ", " + site.y);
      lines.push("  size: " + site.w + ", " + site.h);
      lines.push("  orig: " + site.original_w + ", " + site.original_h);
      lines.push("  offset: " + site.offset_x + ", " + site.offset_y);
      lines.push("  index: " + site.index);
    });
  });

  return lines;
}

/**
 * @return {atlas.Data}
 * @param {string} tps_text
 */
atlas.Data.prototype.importTpsText = function(tps_text) {
  var data = this;

  data.pages = [];
  data.sites = {};

  return data.importTpsTextPage(tps_text, 0);
}

/**
 * @return {atlas.Data}
 * @param {string} tps_text
 * @param {number=} page_index
 */
atlas.Data.prototype.importTpsTextPage = function(tps_text, page_index) {
  var data = this;

  page_index = page_index || 0;

  var tps_json = JSON.parse(tps_text);

  var page = data.pages[page_index] = new atlas.Page();

  if (tps_json.meta) {
    // TexturePacker only supports one page
    page.w = tps_json.meta.size.w;
    page.h = tps_json.meta.size.h;
    page.name = tps_json.meta.image;
  }

  Object.keys(tps_json.frames).forEach(function(key) {
    var frame = tps_json.frames[key];
    var site = data.sites[key] = new atlas.Site();
    site.page = page;
    site.x = frame.frame.x;
    site.y = frame.frame.y;
    site.w = frame.frame.w;
    site.h = frame.frame.h;
    site.rotate = (frame.rotated) ? (1) : (0); // 90 degrees
    site.offset_x = (frame.spriteSourceSize && frame.spriteSourceSize.x) || 0;
    site.offset_y = (frame.spriteSourceSize && frame.spriteSourceSize.y) || 0;
    site.original_w = (frame.sourceSize && frame.sourceSize.w) || site.w;
    site.original_h = (frame.sourceSize && frame.sourceSize.h) || site.h;
  });

  return data;
}
/**
 * Copyright (c) Flyover Games, LLC
 *
 * Isaac Burns isaacburns@gmail.com
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated
 * documentation files (the "Software"), to deal in the Software
 * without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to
 * whom the Software is furnished to do so, subject to the
 * following conditions:
 *
 * The above copyright notice and this permission notice shall
 * be included in all copies or substantial portions of the
 * Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY
 * KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
 * WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
 * PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
 * OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

/**
 * A JavaScript API for the Spine JSON animation data format.
 */
goog.provide('spine');

/**
 * @return {boolean}
 * @param {Object.<string,?>|Array.<?>} json
 * @param {string|number} key
 * @param {boolean=} def
 */
spine.loadBool = function(json, key, def) {
  var value = json[key];
  switch (typeof(value)) {
    case 'string':
      return (value === 'true') ? true : false;
    case 'boolean':
      return value;
    default:
      return def || false;
  }
}

/**
 * @return {void}
 * @param {Object.<string,?>|Array.<?>} json
 * @param {string|number} key
 * @param {boolean} value
 * @param {boolean=} def
 */
spine.saveBool = function(json, key, value, def) {
  if ((typeof(def) !== 'boolean') || (value !== def)) {
    json[key] = value;
  }
}

/**
 * @return {number}
 * @param {Object.<string,?>|Array.<?>} json
 * @param {string|number} key
 * @param {number=} def
 */
spine.loadFloat = function(json, key, def) {
  var value = json[key];
  switch (typeof(value)) {
    case 'string':
      return parseFloat(value);
    case 'number':
      return value;
    default:
      return def || 0;
  }
}

/**
 * @return {void}
 * @param {Object.<string,?>|Array.<?>} json
 * @param {string|number} key
 * @param {number} value
 * @param {number=} def
 */
spine.saveFloat = function(json, key, value, def) {
  if ((typeof(def) !== 'number') || (value !== def)) {
    json[key] = value;
  }
}

/**
 * @return {number}
 * @param {Object.<string,?>|Array.<?>} json
 * @param {string|number} key
 * @param {number=} def
 */
spine.loadInt = function(json, key, def) {
  var value = json[key];
  switch (typeof(value)) {
    case 'string':
      return parseInt(value, 10);
    case 'number':
      return 0 | value;
    default:
      return def || 0;
  }
}

/**
 * @return {void}
 * @param {Object.<string,?>|Array.<?>} json
 * @param {string|number} key
 * @param {number} value
 * @param {number=} def
 */
spine.saveInt = function(json, key, value, def) {
  if ((typeof(def) !== 'number') || (value !== def)) {
    json[key] = value;
  }
}

/**
 * @return {string}
 * @param {Object.<string,?>|Array.<?>} json
 * @param {string|number} key
 * @param {string=} def
 */
spine.loadString = function(json, key, def) {
  var value = json[key];
  switch (typeof(value)) {
    case 'string':
      return value;
    default:
      return def || "";
  }
}

/**
 * @return {void}
 * @param {Object.<string,?>|Array.<?>} json
 * @param {string|number} key
 * @param {string} value
 * @param {string=} def
 */
spine.saveString = function(json, key, value, def) {
  if ((typeof(def) !== 'string') || (value !== def)) {
    json[key] = value;
  }
}

/**
 * @constructor
 */
spine.Color = function() {}

/** @type {number} */
spine.Color.prototype.r = 1;
/** @type {number} */
spine.Color.prototype.g = 1;
/** @type {number} */
spine.Color.prototype.b = 1;
/** @type {number} */
spine.Color.prototype.a = 1;

/**
 * @return {spine.Color}
 * @param {spine.Color} other
 */
spine.Color.prototype.copy = function(other) {
  var color = this;
  color.r = other.r;
  color.g = other.g;
  color.b = other.b;
  color.a = other.a;
  return color;
}

/**
 * @return {spine.Color}
 * @param {Object.<string,?>} json
 */
spine.Color.prototype.load = function(json) {
  var color = this;
  var rgba = 0xffffffff;
  switch (typeof(json)) {
    case 'string':
      rgba = parseInt(json, 16);
      break;
    case 'number':
      rgba = 0 | json;
      break;
    default:
      rgba = 0xffffffff;
      break;
  }
  color.r = ((rgba >> 24) & 0xff) / 255;
  color.g = ((rgba >> 16) & 0xff) / 255;
  color.b = ((rgba >> 8) & 0xff) / 255;
  color.a = (rgba & 0xff) / 255;
  return color;
}

/**
 * @return {string}
 */
spine.Color.prototype.toString = function() {
  var color = this;
  return "rgba(" + (color.r * 255).toFixed(0) + "," + (color.g * 255).toFixed(0) + "," + (color.b * 255).toFixed(0) + "," + color.a + ")";
}

// from: http://github.com/arian/cubic-bezier
/**
 * @return {function(number):number}
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 * @param {number=} epsilon
 */
spine.BezierCurve = function(x1, y1, x2, y2, epsilon) {

  /*
  function orig_curveX(t){
    var v = 1 - t;
    return 3 * v * v * t * x1 + 3 * v * t * t * x2 + t * t * t;
  };

  function orig_curveY(t){
    var v = 1 - t;
    return 3 * v * v * t * y1 + 3 * v * t * t * y2 + t * t * t;
  };

  function orig_derivativeCurveX(t){
    var v = 1 - t;
    return 3 * (2 * (t - 1) * t + v * v) * x1 + 3 * (- t * t * t + 2 * v * t) * x2;
  };
  */

  /*

  B(t) = P0*(1-t)^3 + 3*P1*(1-t)^2*t + 3*P2*(1-t)*t^2 + P3*t^3
  B'(t) = P0 - 3*(P0 - P1)*t + 3*(P0 - 2*P1 + P2)*t^2 - (P0 - 3*P1 + 3*P2 - P3)*t^3

  if P0:(0,0) and P3:(1,1)
  B(t) = 3*P1*(1-t)^2*t + 3*P2*(1-t)*t^2 + t^3
  B'(t) = 3*P1*t - 3*(2*P1 - P2)*t^2 + (3*P1 - 3*P2 + 1)*t^3

  */

  function curveX(t) {
    var t2 = t * t;
    var t3 = t2 * t;
    var v = 1 - t;
    var v2 = v * v;
    return 3 * x1 * v2 * t + 3 * x2 * v * t2 + t3;
  }

  function curveY(t) {
    var t2 = t * t;
    var t3 = t2 * t;
    var v = 1 - t;
    var v2 = v * v;
    return 3 * y1 * v2 * t + 3 * y2 * v * t2 + t3;
  }

  function derivativeCurveX(t) {
    var t2 = t * t;
    var t3 = t2 * t;
    return 3 * x1 * t - 3 * (2 * x1 - x2) * t2 + (3 * x1 - 3 * x2 + 1) * t3;
  }

  epsilon = epsilon || 1e-6;

  return function(percent) {
    var x = percent,
      t0, t1, t2, x2, d2, i;

    // First try a few iterations of Newton's method -- normally very fast.
    for (t2 = x, i = 0; i < 8; ++i) {
      x2 = curveX(t2) - x;
      if (Math.abs(x2) < epsilon) return curveY(t2);
      d2 = derivativeCurveX(t2);
      if (Math.abs(d2) < epsilon) break;
      t2 = t2 - (x2 / d2);
    }

    t0 = 0, t1 = 1, t2 = x;

    if (t2 < t0) return curveY(t0);
    if (t2 > t1) return curveY(t1);

    // Fallback to the bisection method for reliability.
    while (t0 < t1) {
      x2 = curveX(t2);
      if (Math.abs(x2 - x) < epsilon) return curveY(t2);
      if (x > x2) t0 = t2;
      else t1 = t2;
      t2 = (t1 - t0) * 0.5 + t0;
    }

    // Failure
    return curveY(t2);
  };
}

// from: spine-libgdx/src/com/esotericsoftware/spine/Animation.java
/**
 * @return {function(number):number}
 * @param {number} cx1
 * @param {number} cy1
 * @param {number} cx2
 * @param {number} cy2
 */
spine.StepBezierCurve = function(cx1, cy1, cx2, cy2) {
  var bezierSegments = 10;
  var subdiv_step = 1 / bezierSegments;
  var subdiv_step2 = subdiv_step * subdiv_step;
  var subdiv_step3 = subdiv_step2 * subdiv_step;
  var pre1 = 3 * subdiv_step;
  var pre2 = 3 * subdiv_step2;
  var pre4 = 6 * subdiv_step2;
  var pre5 = 6 * subdiv_step3;
  var tmp1x = -cx1 * 2 + cx2;
  var tmp1y = -cy1 * 2 + cy2;
  var tmp2x = (cx1 - cx2) * 3 + 1;
  var tmp2y = (cy1 - cy2) * 3 + 1;
  var curves_0 = (cx1 * pre1 + tmp1x * pre2 + tmp2x * subdiv_step3);
  var curves_1 = (cy1 * pre1 + tmp1y * pre2 + tmp2y * subdiv_step3);
  var curves_2 = (tmp1x * pre4 + tmp2x * pre5);
  var curves_3 = (tmp1y * pre4 + tmp2y * pre5);
  var curves_4 = (tmp2x * pre5);
  var curves_5 = (tmp2y * pre5);

  return function(percent) {
    var dfx = curves_0;
    var dfy = curves_1;
    var ddfx = curves_2;
    var ddfy = curves_3;
    var dddfx = curves_4;
    var dddfy = curves_5;

    var x = dfx,
      y = dfy;
    var i = bezierSegments - 2;
    while (true) {
      if (x >= percent) {
        var lastX = x - dfx;
        var lastY = y - dfy;
        return lastY + (y - lastY) * (percent - lastX) / (x - lastX);
      }
      if (i === 0) break;
      i--;
      dfx += ddfx;
      dfy += ddfy;
      ddfx += dddfx;
      ddfy += dddfy;
      x += dfx;
      y += dfy;
    }
    return y + (1 - y) * (percent - x) / (1 - x); // Last point is 1,1.
  };
}

/**
 * @constructor
 */
spine.Curve = function() {}

/**
 * @type {function(number):number}
 */
spine.Curve.prototype.evaluate = function(t) {
  return t;
};

/**
 * @return {spine.Curve}
 * @param {?} json
 */
spine.Curve.prototype.load = function(json) {
  var curve = this;

  // default: linear
  curve.evaluate = function(t) {
    return t;
  };

  if ((typeof(json) === 'string') && (json === 'stepped')) {
    // stepped
    curve.evaluate = function() {
      return 0;
    };
  } else if ((typeof(json) === 'object') && (typeof(json.length) === 'number') && (json.length === 4)) {
    // bezier
    var x1 = spine.loadFloat(json, 0, 0);
    var y1 = spine.loadFloat(json, 1, 0);
    var x2 = spine.loadFloat(json, 2, 1);
    var y2 = spine.loadFloat(json, 3, 1);
    //curve.evaluate = spine.BezierCurve(x1, y1, x2, y2);
    curve.evaluate = spine.StepBezierCurve(x1, y1, x2, y2);
  }
  return curve;
}

/**
 * @return {number}
 * @param {number} num
 * @param {number} min
 * @param {number} max
 */
spine.wrap = function(num, min, max) {
  if (min < max) {
    if (num < min) {
      return max - ((min - num) % (max - min));
    } else {
      return min + ((num - min) % (max - min));
    }
  } else if (min === max) {
    return min;
  } else {
    return num;
  }
}

/**
 * @return {number}
 * @param {number} a
 * @param {number} b
 * @param {number} t
 */
spine.tween = function(a, b, t) {
  return a + ((b - a) * t);
}

/**
 * @return {number}
 * @param {number} angle
 */
spine.wrapAngleRadians = function(angle) {
  if (angle <= 0) {
    return ((angle - Math.PI) % (2 * Math.PI)) + Math.PI;
  } else {
    return ((angle + Math.PI) % (2 * Math.PI)) - Math.PI;
  }
}

/**
 * @return {number}
 * @param {number} a
 * @param {number} b
 * @param {number} t
 */
spine.tweenAngle = function(a, b, t) {
  return spine.wrapAngleRadians(a + (spine.wrapAngleRadians(b - a) * t));
}

/**
 * @constructor
 * @param {number=} rad
 */
spine.Angle = function(rad) {
  this.rad = rad || 0;
}

Object.defineProperty(spine.Angle.prototype, 'deg', {
  /** @this {spine.Angle} */
  get: function() {
    return this.rad * 180 / Math.PI;
  },
  /** @this {spine.Angle} */
  set: function(value) {
    this.rad = value * Math.PI / 180;
  }
});

Object.defineProperty(spine.Angle.prototype, 'cos', {
  /** @this {spine.Angle} */
  get: function() {
    return Math.cos(this.rad);
  }
});

Object.defineProperty(spine.Angle.prototype, 'sin', {
  /** @this {spine.Angle} */
  get: function() {
    return Math.sin(this.rad);
  }
});

/**
 * @return {spine.Angle}
 */
spine.Angle.prototype.selfIdentity = function() {
  this.rad = 0;
  return this;
}

/**
 * @return {spine.Angle}
 * @param {spine.Angle} other
 */
spine.Angle.prototype.copy = function(other) {
  this.rad = other.rad;
  return this;
}

/**
 * @constructor
 * @param {number=} x
 * @param {number=} y
 */
spine.Vector = function(x, y) {
  this.x = x || 0;
  this.y = y || 0;
}

/** @type {number} */
spine.Vector.prototype.x = 0;
/** @type {number} */
spine.Vector.prototype.y = 0;

/**
 * @return {spine.Vector}
 * @param {spine.Vector} other
 */
spine.Vector.prototype.copy = function(other) {
  this.x = other.x;
  this.y = other.y;
  return this;
}

/**
 * @return {boolean}
 * @param {spine.Vector} a
 * @param {spine.Vector} b
 * @param {number=} epsilon
 */
spine.Vector.equal = function(a, b, epsilon) {
  epsilon = epsilon || 1e-6;
  if (Math.abs(a.x - b.x) > epsilon) {
    return false;
  }
  if (Math.abs(a.y - b.y) > epsilon) {
    return false;
  }
  return true;
}

/**
 * @return {spine.Vector}
 * @param {spine.Vector} a
 * @param {spine.Vector} b
 * @param {spine.Vector=} out
 */
spine.Vector.add = function(a, b, out) {
  out = out || new spine.Vector();
  out.x = a.x + b.x;
  out.y = a.y + b.y;
  return out;
}

/**
 * @return {spine.Vector}
 * @param {spine.Vector} other
 * @param {spine.Vector=} out
 */
spine.Vector.prototype.add = function(other, out) {
  return spine.Vector.add(this, other, out);
}

/**
 * @return {spine.Vector}
 * @param {spine.Vector} other
 */
spine.Vector.prototype.selfAdd = function(other) {
  //return spine.Vector.add(this, other, this);
  this.x += other.x;
  this.y += other.y;
  return this;
}

/**
 * @return {spine.Vector}
 * @param {spine.Vector} a
 * @param {spine.Vector} b
 * @param {number} pct
 * @param {spine.Vector=} out
 */
spine.Vector.tween = function(a, b, pct, out) {
  out = out || new spine.Vector();
  out.x = spine.tween(a.x, b.x, pct);
  out.y = spine.tween(a.y, b.y, pct);
  return out;
}

/**
 * @return {spine.Vector}
 * @param {spine.Vector} other
 * @param {number} pct
 * @param {spine.Vector=} out
 */
spine.Vector.prototype.tween = function(other, pct, out) {
  return spine.Vector.tween(this, other, pct, out);
}

/**
 * @return {spine.Vector}
 * @param {spine.Vector} other
 * @param {number} pct
 */
spine.Vector.prototype.selfTween = function(other, pct) {
  return spine.Vector.tween(this, other, pct, this);
}

/**
 * @constructor
 * @extends {spine.Vector}
 */
spine.Position = function() {
  goog.base(this, 0, 0);
}

goog.inherits(spine.Position, spine.Vector);

/**
 * @constructor
 * @extends {spine.Angle}
 */
spine.Rotation = function() {
  goog.base(this, 0);
}

goog.inherits(spine.Rotation, spine.Angle);

/**
 * @constructor
 * @extends {spine.Vector}
 */
spine.Scale = function() {
  goog.base(this, 1, 1);
}

goog.inherits(spine.Scale, spine.Vector);

/**
 * @return {spine.Scale}
 */
spine.Scale.prototype.selfIdentity = function() {
  this.x = 1;
  this.y = 1;
  return this;
}

/**
 * @constructor
 */
spine.Space = function() {
  var space = this;
  space.position = new spine.Position();
  space.rotation = new spine.Rotation();
  space.scale = new spine.Scale();
}

/** @type {spine.Position} */
spine.Space.prototype.position;
/** @type {spine.Rotation} */
spine.Space.prototype.rotation;
/** @type {spine.Scale} */
spine.Space.prototype.scale;

/**
 * @return {spine.Space}
 * @param {spine.Space} other
 */
spine.Space.prototype.copy = function(other) {
  var space = this;
  space.position.copy(other.position);
  space.rotation.copy(other.rotation);
  space.scale.copy(other.scale);
  return space;
}

/**
 * @return {spine.Space}
 * @param {Object.<string,?>} json
 */
spine.Space.prototype.load = function(json) {
  var space = this;
  space.position.x = spine.loadFloat(json, 'x', 0);
  space.position.y = spine.loadFloat(json, 'y', 0);
  space.rotation.deg = spine.loadFloat(json, 'rotation', 0);
  space.scale.x = spine.loadFloat(json, 'scaleX', 1);
  space.scale.y = spine.loadFloat(json, 'scaleY', 1);
  return space;
}

/**
 * @return {boolean}
 * @param {spine.Space} a
 * @param {spine.Space} b
 * @param {number=} epsilon
 */
spine.Space.equal = function(a, b, epsilon) {
  epsilon = epsilon || 1e-6;
  if (Math.abs(a.position.x - b.position.x) > epsilon) {
    return false;
  }
  if (Math.abs(a.position.y - b.position.y) > epsilon) {
    return false;
  }
  if (Math.abs(a.rotation.rad - b.rotation.rad) > epsilon) {
    return false;
  }
  if (Math.abs(a.scale.x - b.scale.x) > epsilon) {
    return false;
  }
  if (Math.abs(a.scale.y - b.scale.y) > epsilon) {
    return false;
  }
  return true;
}

/**
 * @return {spine.Space}
 * @param {spine.Space=} out
 */
spine.Space.identity = function(out) {
  out = out || new spine.Space();
  out.position.x = 0;
  out.position.y = 0;
  out.rotation.rad = 0;
  out.scale.x = 1;
  out.scale.y = 1;
  return out;
}

/**
 * @return {spine.Space}
 * @param {spine.Space} space
 * @param {number} x
 * @param {number} y
 */
spine.Space.translate = function(space, x, y) {
  x *= space.scale.x;
  y *= space.scale.y;
  var rad = space.rotation.rad;
  var c = Math.cos(rad);
  var s = Math.sin(rad);
  var tx = c * x - s * y;
  var ty = s * x + c * y;
  space.position.x += tx;
  space.position.y += ty;
  return space;
}

/**
 * @return {spine.Space}
 * @param {spine.Space} space
 * @param {number} rad
 */
spine.Space.rotate = function(space, rad) {
  space.rotation.rad += rad;
  space.rotation.rad = spine.wrapAngleRadians(space.rotation.rad);
  return space;
}

/**
 * @return {spine.Space}
 * @param {spine.Space} space
 * @param {number} x
 * @param {number} y
 */
spine.Space.scale = function(space, x, y) {
  space.scale.x *= x;
  space.scale.y *= y;
  return space;
}

/**
 * @return {spine.Space}
 * @param {spine.Space} space
 * @param {spine.Space=} out
 */
spine.Space.invert = function(space, out) {
  // invert
  // out.sca = space.sca.inv();
  // out.rot = space.rot.inv();
  // out.pos = space.pos.neg().rotate(space.rot.inv()).mul(space.sca.inv());

  out = out || new spine.Space();
  var inv_scale_x = 1 / space.scale.x;
  var inv_scale_y = 1 / space.scale.y;
  var inv_rotation = -space.rotation.rad;
  var inv_x = -space.position.x;
  var inv_y = -space.position.y;
  out.scale.x = inv_scale_x;
  out.scale.y = inv_scale_y;
  out.rotation.rad = inv_rotation;
  var x = inv_x;
  var y = inv_y;
  var rad = inv_rotation;
  var c = Math.cos(rad);
  var s = Math.sin(rad);
  var tx = c * x - s * y;
  var ty = s * x + c * y;
  out.position.x = tx * inv_scale_x;
  out.position.y = ty * inv_scale_y;
  return out;
}

/**
 * @return {spine.Space}
 * @param {spine.Space} a
 * @param {spine.Space} b
 * @param {spine.Space=} out
 */
spine.Space.combine = function(a, b, out) {
  // combine
  // out.pos = b.pos.mul(a.sca).rotate(a.rot).add(a.pos);
  // out.rot = b.rot.mul(a.rot);
  // out.sca = b.sca.mul(a.sca);

  out = out || new spine.Space();
  var x = b.position.x * a.scale.x;
  var y = b.position.y * a.scale.y;
  var rad = a.rotation.rad;
  var c = Math.cos(rad);
  var s = Math.sin(rad);
  var tx = c * x - s * y;
  var ty = s * x + c * y;
  out.position.x = tx + a.position.x;
  out.position.y = ty + a.position.y;
  if ((a.scale.x * a.scale.y) < 0.0) {
    out.rotation.rad = spine.wrapAngleRadians(a.rotation.rad - b.rotation.rad);
  } else {
    out.rotation.rad = spine.wrapAngleRadians(b.rotation.rad + a.rotation.rad);
  }
  out.scale.x = b.scale.x * a.scale.x;
  out.scale.y = b.scale.y * a.scale.y;
  return out;
}

/**
 * @return {spine.Space}
 * @param {spine.Space} ab
 * @param {spine.Space} a
 * @param {spine.Space=} out
 */
spine.Space.extract = function(ab, a, out) {
  // extract
  // out.sca = ab.sca.mul(a.sca.inv());
  // out.rot = ab.rot.mul(a.rot.inv());
  // out.pos = ab.pos.add(a.pos.neg()).rotate(a.rot.inv()).mul(a.sca.inv());

  out = out || new spine.Space();
  out.scale.x = ab.scale.x / a.scale.x;
  out.scale.y = ab.scale.y / a.scale.y;
  if ((a.scale.x * a.scale.y) < 0.0) {
    out.rotation.rad = spine.wrapAngleRadians(a.rotation.rad + ab.rotation.rad);
  } else {
    out.rotation.rad = spine.wrapAngleRadians(ab.rotation.rad - a.rotation.rad);
  }
  var x = ab.position.x - a.position.x;
  var y = ab.position.y - a.position.y;
  var rad = -a.rotation.rad;
  var c = Math.cos(rad);
  var s = Math.sin(rad);
  var tx = c * x - s * y;
  var ty = s * x + c * y;
  out.position.x = tx / a.scale.x;
  out.position.y = ty / a.scale.y;
  return out;
}

/**
 * @return {spine.Vector}
 * @param {spine.Space} space
 * @param {spine.Vector} v
 * @param {spine.Vector=} out
 */
spine.Space.transform = function(space, v, out) {
  out = out || new spine.Vector();
  var x = v.x * space.scale.x;
  var y = v.y * space.scale.y;
  var rad = space.rotation.rad;
  var c = Math.cos(rad);
  var s = Math.sin(rad);
  var tx = c * x - s * y;
  var ty = s * x + c * y;
  out.x = tx + space.position.x;
  out.y = ty + space.position.y;
  return out;
}

/**
 * @return {spine.Vector}
 * @param {spine.Space} space
 * @param {spine.Vector} v
 * @param {spine.Vector=} out
 */
spine.Space.untransform = function(space, v, out) {
  out = out || new spine.Vector();
  var x = v.x - space.position.x;
  var y = v.y - space.position.y;
  var rad = -space.rotation.rad;
  var c = Math.cos(rad);
  var s = Math.sin(rad);
  var tx = c * x - s * y;
  var ty = s * x + c * y;
  out.x = tx / space.scale.x;
  out.y = ty / space.scale.y;
  return out;
}

/**
 * @return {spine.Space}
 * @param {spine.Space} a
 * @param {spine.Space} b
 * @param {number} tween
 * @param {spine.Space=} out
 */
spine.Space.tween = function(a, b, tween, out) {
    out.position.x = spine.tween(a.position.x, b.position.x, tween);
    out.position.y = spine.tween(a.position.y, b.position.y, tween);
    out.rotation.rad = spine.tweenAngle(a.rotation.rad, b.rotation.rad, tween);
    out.scale.x = spine.tween(a.scale.x, b.scale.x, tween);
    out.scale.y = spine.tween(a.scale.y, b.scale.y, tween);
    return out;
  }
  /**
   * @constructor
   */
spine.Bone = function() {
  var bone = this;
  bone.local_space = new spine.Space();
  bone.world_space = new spine.Space();
}

/** @type {string} */
spine.Bone.prototype.parent_key = "";
/** @type {number} */
spine.Bone.prototype.length = 0;
/** @type {spine.Space} */
spine.Bone.prototype.local_space;
/** @type {spine.Space} */
spine.Bone.prototype.world_space;
/** @type {boolean} */
spine.Bone.prototype.inherit_rotation = true;
/** @type {boolean} */
spine.Bone.prototype.inherit_scale = true;

/**
 * @return {spine.Bone}
 * @param {spine.Bone} other
 */
spine.Bone.prototype.copy = function(other) {
  var bone = this;
  bone.parent_key = other.parent_key;
  bone.length = other.length;
  bone.local_space.copy(other.local_space);
  bone.world_space.copy(other.world_space);
  bone.inherit_rotation = other.inherit_rotation;
  bone.inherit_scale = other.inherit_scale;
  return bone;
}

/**
 * @return {spine.Bone}
 * @param {Object.<string,?>} json
 */
spine.Bone.prototype.load = function(json) {
  var bone = this;
  bone.parent_key = spine.loadString(json, 'parent', "");
  bone.length = spine.loadFloat(json, 'length', 0);
  bone.local_space.load(json);
  bone.world_space.copy(bone.local_space);
  bone.inherit_rotation = spine.loadBool(json, 'inheritRotation', true);
  bone.inherit_scale = spine.loadBool(json, 'inheritScale', true);
  return bone;
}

/**
 * @return {spine.Bone}
 * @param {spine.Bone} bone
 * @param {Object.<string,spine.Bone>} bones
 */
spine.Bone.flatten = function(bone, bones) {
  var parent_bone = bones[bone.parent_key];
  if (parent_bone) {
    spine.Bone.flatten(parent_bone, bones);

    //spine.Space.combine(parent_bone.world_space, bone.local_space, bone.world_space);

    var a = parent_bone.world_space;
    var b = bone.local_space;
    var out = bone.world_space;

    var x = b.position.x * a.scale.x;
    var y = b.position.y * a.scale.y;
    var rad = a.rotation.rad;
    var c = Math.cos(rad);
    var s = Math.sin(rad);
    var tx = c * x - s * y;
    var ty = s * x + c * y;
    out.position.x = tx + a.position.x;
    out.position.y = ty + a.position.y;

    if (bone.inherit_rotation) {
      if ((a.scale.x * a.scale.y) < 0.0) {
        out.rotation.rad = spine.wrapAngleRadians(a.rotation.rad - b.rotation.rad);
      } else {
        out.rotation.rad = spine.wrapAngleRadians(b.rotation.rad + a.rotation.rad);
      }
    } else {
      out.rotation.rad = b.rotation.rad;
    }

    if (bone.inherit_scale) {
      out.scale.x = b.scale.x * a.scale.x;
      out.scale.y = b.scale.y * a.scale.y;
    } else {
      out.scale.x = b.scale.x;
      out.scale.y = b.scale.y;
    }
  } else {
    bone.world_space.copy(bone.local_space);
  }

  return bone;
}

/**
 * @constructor
 */
spine.Ikc = function() {
  var ikc = this;
  ikc.bone_keys = [];
}

/** @type {string} */
spine.Ikc.prototype.name = "";
/** @type {Array.<string>} */
spine.Ikc.prototype.bone_keys;
/** @type {string} */
spine.Ikc.prototype.target_key = "";
/** @type {number} */
spine.Ikc.prototype.mix = 1;
/** @type {boolean} */
spine.Ikc.prototype.bend_positive = true;

/**
 * @return {spine.Ikc}
 * @param {Object.<string,?>} json
 */
spine.Ikc.prototype.load = function(json) {
  var ikc = this;
  ikc.name = spine.loadString(json, 'name', "");
  ikc.bone_keys = json['bones'] || [];
  ikc.target_key = spine.loadString(json, 'target', "");
  ikc.mix = spine.loadFloat(json, 'mix', 1);
  ikc.bend_positive = spine.loadBool(json, 'bendPositive', true);
  return ikc;
}

/**
 * @constructor
 */
spine.Slot = function() {
  var slot = this;
  slot.color = new spine.Color();
}

/** @type {string} */
spine.Slot.prototype.bone_key = "";
/** @type {spine.Color} */
spine.Slot.prototype.color;
/** @type {string} */
spine.Slot.prototype.attachment_key = "";
/** @type {string} */
spine.Slot.prototype.blend = "normal";

/**
 * @return {spine.Slot}
 * @param {spine.Slot} other
 */
spine.Slot.prototype.copy = function(other) {
  var slot = this;
  slot.bone_key = other.bone_key;
  slot.color.copy(other.color);
  slot.attachment_key = other.attachment_key;
  slot.blend = other.blend;
  return slot;
}

/**
 * @return {spine.Slot}
 * @param {Object.<string,?>} json
 */
spine.Slot.prototype.load = function(json) {
  var slot = this;
  slot.bone_key = spine.loadString(json, 'bone', "");
  slot.color.load(json.color);
  slot.attachment_key = spine.loadString(json, 'attachment', "");
  slot.blend = spine.loadString(json, 'blend', "normal");
  return slot;
}

/**
 * @constructor
 * @param {string} type
 */
spine.Attachment = function(type) {
  this.type = type;
}

/** @type {string} */
spine.Attachment.prototype.type = "region";
/** @type {string} */
spine.Attachment.prototype.name = "";
/** @type {string} */
spine.Attachment.prototype.path = "";

/**
 * @return {spine.Attachment}
 * @param {Object.<string,?>} json
 */
spine.Attachment.prototype.load = function(json) {
  var attachment = this;
  var attachment_type = spine.loadString(json, 'type', "region");
  if (attachment_type !== attachment.type) {
    throw new Error();
  }
  attachment.name = spine.loadString(json, 'name', "");
  attachment.path = spine.loadString(json, 'path', "");
  return attachment;
}

/**
 * @constructor
 * @extends {spine.Attachment}
 */
spine.RegionAttachment = function() {
  goog.base(this, 'region');
  this.local_space = new spine.Space();
}

goog.inherits(spine.RegionAttachment, spine.Attachment);

/** @type {spine.Space} */
spine.RegionAttachment.prototype.local_space;
/** @type {number} */
spine.RegionAttachment.prototype.width = 0;
/** @type {number} */
spine.RegionAttachment.prototype.height = 0;

/**
 * @return {spine.Attachment}
 * @param {Object.<string,?>} json
 */
spine.RegionAttachment.prototype.load = function(json) {
  goog.base(this, 'load', json);

  var attachment = this;
  attachment.local_space.load(json);
  attachment.width = spine.loadFloat(json, 'width', 0);
  attachment.height = spine.loadFloat(json, 'height', 0);
  return attachment;
}

/**
 * @constructor
 * @extends {spine.Attachment}
 */
spine.BoundingBoxAttachment = function() {
  goog.base(this, 'boundingbox');
  this.vertices = [];
}

goog.inherits(spine.BoundingBoxAttachment, spine.Attachment);

/**
 * @type {Array.<number>}
 */
spine.BoundingBoxAttachment.prototype.vertices;

/**
 * @return {spine.Attachment}
 * @param {Object.<string,?>} json
 */
spine.BoundingBoxAttachment.prototype.load = function(json) {
  goog.base(this, 'load', json);

  var attachment = this;
  /// The x/y pairs that make up the vertices of the polygon.
  attachment.vertices = json.vertices || [];
  return attachment;
}

/**
 * @constructor
 * @extends {spine.Attachment}
 */
spine.MeshAttachment = function() {
  goog.base(this, 'mesh');
  this.color = new spine.Color();
  this.triangles = [];
  this.edges = [];
  this.vertices = [];
  this.uvs = [];
}

goog.inherits(spine.MeshAttachment, spine.Attachment);

/**
 * @type {spine.Color}
 */
spine.MeshAttachment.prototype.color;

/**
 * @type {Array.<number>}
 */
spine.MeshAttachment.prototype.triangles;

/**
 * @type {Array.<number>}
 */
spine.MeshAttachment.prototype.edges;

/**
 * @type {Array.<number>}
 */
spine.MeshAttachment.prototype.vertices;

/**
 * @type {Array.<number>}
 */
spine.MeshAttachment.prototype.uvs;

/**
 * @type {number}
 */
spine.MeshAttachment.prototype.hull = 0;

/**
 * @return {spine.Attachment}
 * @param {Object.<string,?>} json
 */
spine.MeshAttachment.prototype.load = function(json) {
  goog.base(this, 'load', json);

  var attachment = this;
  attachment.color.load(json.color);
  attachment.triangles = json.triangles || [];
  attachment.edges = json.edges || [];
  attachment.vertices = json.vertices || [];
  attachment.uvs = json.uvs || [];
  attachment.hull = spine.loadInt(json, 'hull', 0);
  return attachment;
}

/**
 * @constructor
 * @extends {spine.Attachment}
 */
spine.WeightedMeshAttachment = function() {
  goog.base(this, 'weightedmesh');
  this.color = new spine.Color();
  this.triangles = [];
  this.edges = [];
  this.vertices = [];
  this.uvs = [];
}

goog.inherits(spine.WeightedMeshAttachment, spine.Attachment);

/**
 * @type {spine.Color}
 */
spine.WeightedMeshAttachment.prototype.color;

/**
 * @type {Array.<number>}
 */
spine.WeightedMeshAttachment.prototype.triangles;

/**
 * @type {Array.<number>}
 */
spine.WeightedMeshAttachment.prototype.edges;

/**
 * @type {Array.<number>}
 */
spine.WeightedMeshAttachment.prototype.vertices;

/**
 * @type {Array.<number>}
 */
spine.WeightedMeshAttachment.prototype.uvs;

/**
 * @type {number}
 */
spine.WeightedMeshAttachment.prototype.hull = 0;

/**
 * @return {spine.Attachment}
 * @param {Object.<string,?>} json
 */
spine.WeightedMeshAttachment.prototype.load = function(json) {
  goog.base(this, 'load', json);

  var attachment = this;
  attachment.color.load(json.color);
  attachment.triangles = json.triangles || [];
  attachment.edges = json.edges || [];
  attachment.vertices = json.vertices || [];
  attachment.uvs = json.uvs || [];
  attachment.hull = spine.loadInt(json, 'hull', 0);
  return attachment;
}

/**
 * @constructor
 */
spine.SkinSlot = function() {
  var skin_slot = this;
  skin_slot.attachments = {};
  skin_slot.attachment_keys = [];
}

/** @type {Object.<string,spine.Attachment>} */
spine.SkinSlot.prototype.attachments;

/** @type {Array.<string>} */
spine.SkinSlot.prototype.attachment_keys;

/**
 * @return {spine.SkinSlot}
 * @param {Object.<string,?>} json
 */
spine.SkinSlot.prototype.load = function(json) {
  var skin_slot = this;
  skin_slot.attachment_keys = Object.keys(json || {});
  skin_slot.attachment_keys.forEach(function(attachment_key) {
    var json_attachment = json[attachment_key];
    switch (json_attachment.type) {
      case 'region':
      default:
        skin_slot.attachments[attachment_key] = new spine.RegionAttachment().load(json_attachment);
        break;
      case 'boundingbox':
        skin_slot.attachments[attachment_key] = new spine.BoundingBoxAttachment().load(json_attachment);
        break;
      case 'mesh':
        skin_slot.attachments[attachment_key] = new spine.MeshAttachment().load(json_attachment);
        break;
      case 'skinnedmesh':
        json_attachment.type = 'weightedmesh';
      case 'weightedmesh':
        skin_slot.attachments[attachment_key] = new spine.WeightedMeshAttachment().load(json_attachment);
        break;
    }
  });
  return skin_slot;
}

/**
 * @constructor
 */
spine.Skin = function() {
  var skin = this;
  skin.slots = {};
  skin.slot_keys = [];
}

/** @type {string} */
spine.Skin.prototype.name = "";

/** @type {Object.<string,spine.SkinSlot>} */
spine.Skin.prototype.slots;

/** @type {Array.<string>} */
spine.Skin.prototype.slot_keys;

/**
 * @return {spine.Skin}
 * @param {Object.<string,?>} json
 */
spine.Skin.prototype.load = function(json) {
  var skin = this;
  skin.name = spine.loadString(json, 'name', "");
  skin.slot_keys = Object.keys(json || {});
  skin.slot_keys.forEach(function(slot_key) {
    skin.slots[slot_key] = new spine.SkinSlot().load(json[slot_key]);
  });
  return skin;
}

/**
 * @return {void}
 * @param {function(string, spine.SkinSlot, string, spine.Attachment):void} callback
 */
spine.Skin.prototype.iterateAttachments = function(callback) {
  var skin = this;
  skin.slot_keys.forEach(function(slot_key) {
    var skin_slot = skin.slots[slot_key];
    skin_slot.attachment_keys.forEach(function(attachment_key) {
      var attachment = skin_slot.attachments[attachment_key];
      callback(slot_key, skin_slot, attachment.path || attachment.name || attachment_key, attachment);
    });
  });
}

/**
 * @constructor
 */
spine.Event = function() {}

/** @type {string} */
spine.Event.prototype.name = "";
/** @type {number} */
spine.Event.prototype.int_value = 0;
/** @type {number} */
spine.Event.prototype.float_value = 0;
/** @type {string} */
spine.Event.prototype.string_value = "";

/**
 * @return {spine.Event}
 * @param {spine.Event} other
 */
spine.Event.prototype.copy = function(other) {
  this.name = other.name;
  this.int_value = other.int_value;
  this.float_value = other.float_value;
  this.string_value = other.string_value;
  return this;
}

/**
 * @return {spine.Event}
 * @param {Object.<string,?>} json
 */
spine.Event.prototype.load = function(json) {
  this.name = spine.loadString(json, 'name', "");
  if (typeof(json['int']) === 'number') {
    this.int_value = spine.loadInt(json, 'int', 0);
  }
  if (typeof(json['float']) === 'number') {
    this.float_value = spine.loadFloat(json, 'float', 0);
  }
  if (typeof(json['string']) === 'string') {
    this.string_value = spine.loadString(json, 'string', "");
  }

  return this;
}

/**
 * @constructor
 */
spine.Keyframe = function() {}

/** @type {number} */
spine.Keyframe.prototype.time = 0;

/**
 * @return {spine.Keyframe}
 */
spine.Keyframe.prototype.drop = function() {
  this.time = 0;
  return this;
}

/**
 * @return {spine.Keyframe}
 * @param {Object.<string,?>} json
 */
spine.Keyframe.prototype.load = function(json) {
  this.time = 1000 * spine.loadFloat(json, 'time', 0); // convert to ms
  return this;
}

/**
 * @return {spine.Keyframe}
 * @param {Object.<string,?>} json
 */
spine.Keyframe.prototype.save = function(json) {
  spine.saveFloat(json, 'time', this.time / 1000, 0); // convert to s
  return this;
}

/**
 * @return {number}
 * @param {Array.<spine.Keyframe>} array
 * @param {number} time
 */
spine.Keyframe.find = function(array, time) {
  if (!array) {
    return -1;
  }
  if (array.length <= 0) {
    return -1;
  }
  if (time < array[0].time) {
    return -1;
  }
  var last = array.length - 1;
  if (time >= array[last].time) {
    return last;
  }
  var lo = 0;
  var hi = last;
  if (hi === 0) {
    return 0;
  }
  var current = hi >> 1;
  while (true) {
    if (array[current + 1].time <= time) {
      lo = current + 1;
    } else {
      hi = current;
    }
    if (lo === hi) {
      return lo;
    }
    current = (lo + hi) >> 1;
  }
}

/**
 * @return {number}
 * @param {spine.Keyframe} a
 * @param {spine.Keyframe} b
 */
spine.Keyframe.compare = function(a, b) {
  return a.time - b.time;
}

/**
 * @constructor
 * @extends {spine.Keyframe}
 */
spine.BoneKeyframe = function() {
  goog.base(this);
  this.curve = new spine.Curve();
}

goog.inherits(spine.BoneKeyframe, spine.Keyframe);

/** @type {spine.Curve} */
spine.BoneKeyframe.prototype.curve;

/**
 * @return {spine.BoneKeyframe}
 * @param {Object.<string,?>} json
 */
spine.BoneKeyframe.prototype.load = function(json) {
  goog.base(this, 'load', json);
  this.curve.load(json.curve);
  return this;
}

/**
 * @constructor
 * @extends {spine.BoneKeyframe}
 */
spine.TranslateKeyframe = function() {
  goog.base(this);
  this.position = new spine.Position();
}

goog.inherits(spine.TranslateKeyframe, spine.BoneKeyframe);

/** @type {spine.Position} */
spine.TranslateKeyframe.prototype.position;

/**
 * @return {spine.TranslateKeyframe}
 * @param {Object.<string,?>} json
 */
spine.TranslateKeyframe.prototype.load = function(json) {
  goog.base(this, 'load', json);
  this.position.x = spine.loadFloat(json, 'x', 0);
  this.position.y = spine.loadFloat(json, 'y', 0);
  return this;
}

/**
 * @constructor
 * @extends {spine.BoneKeyframe}
 */
spine.RotateKeyframe = function() {
  goog.base(this);
  this.rotation = new spine.Rotation();
}

goog.inherits(spine.RotateKeyframe, spine.BoneKeyframe);

/** @type {spine.Rotation} */
spine.RotateKeyframe.prototype.rotation;

/**
 * @return {spine.RotateKeyframe}
 * @param {Object.<string,?>} json
 */
spine.RotateKeyframe.prototype.load = function(json) {
  goog.base(this, 'load', json);
  this.rotation.deg = spine.loadFloat(json, 'angle', 0);
  return this;
}

/**
 * @constructor
 * @extends {spine.BoneKeyframe}
 */
spine.ScaleKeyframe = function() {
  goog.base(this);
  this.scale = new spine.Scale();
}

goog.inherits(spine.ScaleKeyframe, spine.BoneKeyframe);

/** @type {spine.Scale} */
spine.ScaleKeyframe.prototype.scale;

/**
 * @return {spine.ScaleKeyframe}
 * @param {Object.<string,?>} json
 */
spine.ScaleKeyframe.prototype.load = function(json) {
  goog.base(this, 'load', json);
  this.scale.x = spine.loadFloat(json, 'x', 1);
  this.scale.y = spine.loadFloat(json, 'y', 1);
  return this;
}

/**
 * @constructor
 */
spine.AnimBone = function() {}

/** @type {number} */
spine.AnimBone.prototype.min_time = 0;
/** @type {number} */
spine.AnimBone.prototype.max_time = 0;
/** @type {Array.<spine.TranslateKeyframe>} */
spine.AnimBone.prototype.translate_keyframes = null;
/** @type {Array.<spine.RotateKeyframe>} */
spine.AnimBone.prototype.rotate_keyframes = null;
/** @type {Array.<spine.ScaleKeyframe>} */
spine.AnimBone.prototype.scale_keyframes = null;

/**
 * @return {spine.AnimBone}
 * @param {Object.<string,?>} json
 */
spine.AnimBone.prototype.load = function(json) {
  var anim_bone = this;
  anim_bone.min_time = 0;
  anim_bone.max_time = 0;
  anim_bone.translate_keyframes = null;
  anim_bone.rotate_keyframes = null;
  anim_bone.scale_keyframes = null;

  Object.keys(json || {}).forEach(function(key) {
    switch (key) {
      case 'translate':
        anim_bone.translate_keyframes = [];
        json.translate.forEach(function(translate_json) {
          var translate_keyframe = new spine.TranslateKeyframe().load(translate_json);
          anim_bone.translate_keyframes.push(translate_keyframe);
          anim_bone.min_time = Math.min(anim_bone.min_time, translate_keyframe.time);
          anim_bone.max_time = Math.max(anim_bone.max_time, translate_keyframe.time);
        });
        anim_bone.translate_keyframes.sort(spine.Keyframe.compare);
        break;
      case 'rotate':
        anim_bone.rotate_keyframes = [];
        json.rotate.forEach(function(rotate_json) {
          var rotate_keyframe = new spine.RotateKeyframe().load(rotate_json);
          anim_bone.rotate_keyframes.push(rotate_keyframe);
          anim_bone.min_time = Math.min(anim_bone.min_time, rotate_keyframe.time);
          anim_bone.max_time = Math.max(anim_bone.max_time, rotate_keyframe.time);
        });
        anim_bone.rotate_keyframes.sort(spine.Keyframe.compare);
        break;
      case 'scale':
        anim_bone.scale_keyframes = [];
        json.scale.forEach(function(scale_json) {
          var scale_keyframe = new spine.ScaleKeyframe().load(scale_json);
          anim_bone.scale_keyframes.push(scale_keyframe);
          anim_bone.min_time = Math.min(anim_bone.min_time, scale_keyframe.time);
          anim_bone.max_time = Math.max(anim_bone.max_time, scale_keyframe.time);
        });
        anim_bone.scale_keyframes.sort(spine.Keyframe.compare);
        break;
      default:
        console.log("TODO: spine.AnimBone::load", key);
        break;
    }
  });

  return anim_bone;
}

/**
 * @constructor
 * @extends {spine.Keyframe}
 */
spine.SlotKeyframe = function() {
  goog.base(this);
}

goog.inherits(spine.SlotKeyframe, spine.Keyframe);

/**
 * @return {spine.SlotKeyframe}
 * @param {Object.<string,?>} json
 */
spine.SlotKeyframe.prototype.load = function(json) {
  goog.base(this, 'load', json);
  return this;
}

/**
 * @constructor
 * @extends {spine.SlotKeyframe}
 */
spine.ColorKeyframe = function() {
  goog.base(this);

  this.color = new spine.Color();
  this.curve = new spine.Curve();
}

goog.inherits(spine.ColorKeyframe, spine.SlotKeyframe);

/** @type {spine.Color} */
spine.ColorKeyframe.prototype.color;
/** @type {spine.Curve} */
spine.ColorKeyframe.prototype.curve;

/**
 * @return {spine.ColorKeyframe}
 * @param {Object.<string,?>} json
 */
spine.ColorKeyframe.prototype.load = function(json) {
  goog.base(this, 'load', json);
  this.color.load(json.color);
  this.curve.load(json.curve);
  return this;
}

/**
 * @constructor
 * @extends {spine.SlotKeyframe}
 */
spine.AttachmentKeyframe = function() {
  goog.base(this);
}

goog.inherits(spine.AttachmentKeyframe, spine.SlotKeyframe);


/** @type {string} */
spine.AttachmentKeyframe.prototype.name = "";

/**
 * @return {spine.AttachmentKeyframe}
 * @param {Object.<string,?>} json
 */
spine.AttachmentKeyframe.prototype.load = function(json) {
  goog.base(this, 'load', json);
  this.name = spine.loadString(json, 'name', "");
  return this;
}

/**
 * @constructor
 */
spine.AnimSlot = function() {}

/** @type {number} */
spine.AnimSlot.prototype.min_time = 0;
/** @type {number} */
spine.AnimSlot.prototype.max_time = 0;
/** @type {Array.<spine.ColorKeyframe>} */
spine.AnimSlot.prototype.color_keyframes = null;
/** @type {Array.<spine.AttachmentKeyframe>} */
spine.AnimSlot.prototype.attachment_keyframes = null;

/**
 * @return {spine.AnimSlot}
 * @param {Object.<string,?>} json
 */
spine.AnimSlot.prototype.load = function(json) {
  var anim_slot = this;
  anim_slot.min_time = 0;
  anim_slot.max_time = 0;
  anim_slot.color_keyframes = null;
  anim_slot.attachment_keyframes = null;

  Object.keys(json || {}).forEach(function(key) {
    switch (key) {
      case 'color':
        anim_slot.color_keyframes = [];
        json[key].forEach(function(color) {
          var color_keyframe = new spine.ColorKeyframe().load(color);
          anim_slot.min_time = Math.min(anim_slot.min_time, color_keyframe.time);
          anim_slot.max_time = Math.max(anim_slot.max_time, color_keyframe.time);
          anim_slot.color_keyframes.push(color_keyframe);
        });
        anim_slot.color_keyframes.sort(spine.Keyframe.compare);
        break;
      case 'attachment':
        anim_slot.attachment_keyframes = [];
        json[key].forEach(function(attachment) {
          var attachment_keyframe = new spine.AttachmentKeyframe().load(attachment);
          anim_slot.min_time = Math.min(anim_slot.min_time, attachment_keyframe.time);
          anim_slot.max_time = Math.max(anim_slot.max_time, attachment_keyframe.time);
          anim_slot.attachment_keyframes.push(attachment_keyframe);
        });
        anim_slot.attachment_keyframes.sort(spine.Keyframe.compare);
        break;
      default:
        console.log("TODO: spine.AnimSlot::load", key);
        break;
    }
  })

  return anim_slot;
}

/**
 * @constructor
 * @extends {spine.Keyframe}
 */
spine.EventKeyframe = function() {
  goog.base(this);
}

goog.inherits(spine.EventKeyframe, spine.Keyframe);

/** @type {string} */
spine.EventKeyframe.prototype.name = "";
/** @type {number} */
spine.EventKeyframe.prototype.int_value = 0;
/** @type {number} */
spine.EventKeyframe.prototype.float_value = 0;
/** @type {string} */
spine.EventKeyframe.prototype.string_value = "";

/**
 * @return {spine.EventKeyframe}
 * @param {Object.<string,?>} json
 */
spine.EventKeyframe.prototype.load = function(json) {
  goog.base(this, 'load', json);
  this.name = spine.loadString(json, 'name', "");
  if (typeof(json['int']) === 'number') {
    this.int_value = spine.loadInt(json, 'int', 0);
  }
  if (typeof(json['float']) === 'number') {
    this.float_value = spine.loadFloat(json, 'float', 0);
  }
  if (typeof(json['string']) === 'string') {
    this.string_value = spine.loadString(json, 'string', "");
  }
  return this;
}

/**
 * @constructor
 */
spine.SlotOffset = function() {}

/** @type {string} */
spine.SlotOffset.prototype.slot_key = "";
/** @type {number} */
spine.SlotOffset.prototype.offset = 0;

/**
 * @return {spine.SlotOffset}
 * @param {Object.<string,?>} json
 */
spine.SlotOffset.prototype.load = function(json) {
  this.slot_key = spine.loadString(json, 'slot', "");
  this.offset = spine.loadInt(json, 'offset', 0);
  return this;
}

/**
 * @constructor
 * @extends {spine.Keyframe}
 */
spine.OrderKeyframe = function() {
  goog.base(this);

  this.slot_offsets = [];
}

goog.inherits(spine.OrderKeyframe, spine.Keyframe);

/** @type {Array.<spine.SlotOffset>} */
spine.OrderKeyframe.slot_offsets;

/**
 * @return {spine.OrderKeyframe}
 * @param {Object.<string,?>} json
 */
spine.OrderKeyframe.prototype.load = function(json) {
  goog.base(this, 'load', json);
  var order_keyframe = this;
  order_keyframe.slot_offsets = [];

  Object.keys(json || {}).forEach(function(key) {
    switch (key) {
      case 'offsets':
        json[key].forEach(function(offset) {
          order_keyframe.slot_offsets.push(new spine.SlotOffset().load(offset));
        });
        break;
    }
  });
  return order_keyframe;
}

/**
 * @constructor
 * @extends {spine.Keyframe}
 */
spine.IkcKeyframe = function() {
  goog.base(this);

  this.curve = new spine.Curve();
}

goog.inherits(spine.IkcKeyframe, spine.Keyframe);

/** @type {spine.Curve} */
spine.IkcKeyframe.prototype.curve;

/** @type {number} */
spine.IkcKeyframe.prototype.mix = 1;

/** @type {boolean} */
spine.IkcKeyframe.prototype.bend_positive = true;

/**
 * @return {spine.IkcKeyframe}
 * @param {Object.<string,?>} json
 */
spine.IkcKeyframe.prototype.load = function(json) {
  goog.base(this, 'load', json);
  this.curve.load(json);
  this.mix = spine.loadFloat(json, 'mix', 1);
  this.bend_positive = spine.loadBool(json, 'bendPositive', true);
  return this;
}

/**
 * @constructor
 */
spine.AnimIkc = function() {}

/** @type {number} */
spine.AnimIkc.prototype.min_time = 0;
/** @type {number} */
spine.AnimIkc.prototype.max_time = 0;
/** @type {Array.<spine.IkcKeyframe>} */
spine.AnimIkc.prototype.ikc_keyframes = null;

/**
 * @return {spine.AnimIkc}
 * @param {Object.<string,?>} json
 */
spine.AnimIkc.prototype.load = function(json) {
  var anim_ikc = this;
  anim_ikc.min_time = 0;
  anim_ikc.max_time = 0;
  anim_ikc.ikc_keyframes = [];

  json.forEach(function(ikc) {
    var ikc_keyframe = new spine.IkcKeyframe().load(ikc);
    anim_ikc.min_time = Math.min(anim_ikc.min_time, ikc_keyframe.time);
    anim_ikc.max_time = Math.max(anim_ikc.max_time, ikc_keyframe.time);
    anim_ikc.ikc_keyframes.push(ikc_keyframe);
  });
  anim_ikc.ikc_keyframes.sort(spine.Keyframe.compare);

  return anim_ikc;
}

/**
 * @constructor
 * @extends {spine.Keyframe}
 */
spine.FfdKeyframe = function() {
  goog.base(this);

  this.curve = new spine.Curve();
  this.vertices = [];
}

goog.inherits(spine.FfdKeyframe, spine.Keyframe);

/** @type {spine.Curve} */
spine.FfdKeyframe.prototype.curve;

/** @type {number} */
spine.FfdKeyframe.prototype.offset = 0;

/** @type {Array.<number>} */
spine.FfdKeyframe.prototype.vertices;

/**
 * @return {spine.FfdKeyframe}
 * @param {Object.<string,?>} json
 */
spine.FfdKeyframe.prototype.load = function(json) {
  goog.base(this, 'load', json);
  this.curve.load(json);
  this.offset = spine.loadInt(json, 'offset', 0);
  this.vertices = json.vertices || [];
  return this;
}

/**
 * @constructor
 */
spine.FfdAttachment = function() {}

/** @type {number} */
spine.FfdAttachment.prototype.min_time = 0;
/** @type {number} */
spine.FfdAttachment.prototype.max_time = 0;
/** @type {Array.<spine.FfdKeyframe>} */
spine.FfdAttachment.prototype.ffd_keyframes = null;

/**
 * @return {spine.FfdAttachment}
 * @param {Object.<string,?>} json
 */
spine.FfdAttachment.prototype.load = function(json) {
  var ffd_attachment = this;

  ffd_attachment.min_time = 0;
  ffd_attachment.max_time = 0;
  ffd_attachment.ffd_keyframes = [];

  json.forEach(function(ffd_keyframe_json) {
    var ffd_keyframe = new spine.FfdKeyframe().load(ffd_keyframe_json);
    ffd_attachment.min_time = Math.min(ffd_attachment.min_time, ffd_keyframe.time);
    ffd_attachment.max_time = Math.max(ffd_attachment.max_time, ffd_keyframe.time);
    ffd_attachment.ffd_keyframes.push(ffd_keyframe);
  });

  ffd_attachment.ffd_keyframes.sort(spine.Keyframe.compare);

  return ffd_attachment;
}

/**
 * @constructor
 */
spine.FfdSlot = function() {
  var ffd_slot = this;
  ffd_slot.ffd_attachments = {};
  ffd_slot.ffd_attachment_keys = [];
}

/** @type {Object.<string,spine.FfdAttachment>} */
spine.FfdSlot.prototype.ffd_attachments;

/** @type {Array.<string>} */
spine.FfdSlot.prototype.ffd_attachment_keys;

/**
 * @return {spine.FfdSlot}
 * @param {Object.<string,?>} json
 */
spine.FfdSlot.prototype.load = function(json) {
  var ffd_slot = this;

  ffd_slot.ffd_attachments = {};
  ffd_slot.ffd_attachment_keys = Object.keys(json || {});
  ffd_slot.ffd_attachment_keys.forEach(function(key) {
    ffd_slot.ffd_attachments[key] = new spine.FfdAttachment().load(json[key]);
  });

  return ffd_slot;
}

/**
 * @return {void}
 * @param {function(string, spine.FfdAttachment):void} callback
 */
spine.FfdSlot.prototype.iterateAttachments = function(callback) {
  var ffd_slot = this;

  ffd_slot.ffd_attachment_keys.forEach(function(ffd_attachment_key) {
    var ffd_attachment = ffd_slot.ffd_attachments[ffd_attachment_key];

    callback(ffd_attachment_key, ffd_attachment);
  });
}

/**
 * @constructor
 */
spine.AnimFfd = function() {
  var anim_ffd = this;
  anim_ffd.ffd_slots = {};
}

/** @type {number} */
spine.AnimFfd.prototype.min_time = 0;
/** @type {number} */
spine.AnimFfd.prototype.max_time = 0;
/** @type {Object.<string,spine.FfdSlot>} */
spine.AnimFfd.prototype.ffd_slots;
/** @type {Array.<string>} */
spine.AnimFfd.prototype.ffd_slot_keys;

/**
 * @return {spine.AnimFfd}
 * @param {Object.<string,?>} json
 */
spine.AnimFfd.prototype.load = function(json) {
  var anim_ffd = this;

  anim_ffd.min_time = 0;
  anim_ffd.max_time = 0;
  anim_ffd.ffd_slots = {};
  anim_ffd.ffd_slot_keys = Object.keys(json || {});
  anim_ffd.ffd_slot_keys.forEach(function(key) {
    anim_ffd.ffd_slots[key] = new spine.FfdSlot().load(json[key]);
  });

  anim_ffd.iterateAttachments(function(ffd_slot_key, ffd_slot, ffd_attachment_key, ffd_attachment) {
    anim_ffd.min_time = Math.min(anim_ffd.min_time, ffd_attachment.min_time);
    anim_ffd.max_time = Math.max(anim_ffd.max_time, ffd_attachment.max_time);
  });

  return anim_ffd;
}

/**
 * @return {void}
 * @param {function(string, spine.FfdSlot, string, spine.FfdAttachment):void} callback
 */
spine.AnimFfd.prototype.iterateAttachments = function(callback) {
  var anim_ffd = this;

  anim_ffd.ffd_slot_keys.forEach(function(ffd_slot_key) {
    var ffd_slot = anim_ffd.ffd_slots[ffd_slot_key];

    ffd_slot.iterateAttachments(function(ffd_attachment_key, ffd_attachment) {
      callback(ffd_slot_key, ffd_slot, ffd_attachment_key, ffd_attachment);
    });
  });
}

/**
 * @constructor
 */
spine.Animation = function() {
  var anim = this;
  anim.bones = {};
  anim.slots = {};
  anim.ikcs = {};
  anim.ffds = {};
}

/** @type {string} */
spine.Animation.prototype.name = "";

/** @type {Object.<string,spine.AnimBone>} */
spine.Animation.prototype.bones;
/** @type {Object.<string,spine.AnimSlot>} */
spine.Animation.prototype.slots;
/** @type {Array.<spine.EventKeyframe>} */
spine.Animation.prototype.event_keyframes = null;
/** @type {Array.<spine.OrderKeyframe>} */
spine.Animation.prototype.order_keyframes = null;
/** @type {Object.<string,spine.AnimIkc>} */
spine.Animation.prototype.ikcs;
/** @type {Object.<string,spine.AnimFfd>} */
spine.Animation.prototype.ffds;

/** @type {number} */
spine.Animation.prototype.min_time = 0;
/** @type {number} */
spine.Animation.prototype.max_time = 0;
/** @type {number} */
spine.Animation.prototype.length = 0;

/**
 * @return {spine.Animation}
 * @param {Object.<string,?>} json
 */
spine.Animation.prototype.load = function(json) {
  var anim = this;

  anim.bones = {};
  anim.slots = {};
  anim.event_keyframes = null;
  anim.order_keyframes = null;
  anim.ikcs = {};
  anim.ffds = {};

  anim.min_time = 0;
  anim.max_time = 0;

  Object.keys(json || {}).forEach(function(key) {
    switch (key) {
      case 'bones':
        Object.keys(json[key] || {}).forEach(function(bone_key) {
          var anim_bone = new spine.AnimBone().load(json[key][bone_key]);
          anim.min_time = Math.min(anim.min_time, anim_bone.min_time);
          anim.max_time = Math.max(anim.max_time, anim_bone.max_time);
          anim.bones[bone_key] = anim_bone;
        });
        break;
      case 'slots':
        Object.keys(json[key] || {}).forEach(function(slot_key) {
          var anim_slot = new spine.AnimSlot().load(json[key][slot_key]);
          anim.min_time = Math.min(anim.min_time, anim_slot.min_time);
          anim.max_time = Math.max(anim.max_time, anim_slot.max_time);
          anim.slots[slot_key] = anim_slot;
        });
        break;
      case 'events':
        anim.event_keyframes = [];
        json[key].forEach(function(event) {
          var event_keyframe = new spine.EventKeyframe().load(event);
          anim.min_time = Math.min(anim.min_time, event_keyframe.time);
          anim.max_time = Math.max(anim.max_time, event_keyframe.time);
          anim.event_keyframes.push(event_keyframe);
        });
        anim.event_keyframes.sort(spine.Keyframe.compare);
        break;
      case 'drawOrder':
      case 'draworder':
        anim.order_keyframes = [];
        json[key].forEach(function(order) {
          var order_keyframe = new spine.OrderKeyframe().load(order);
          anim.min_time = Math.min(anim.min_time, order_keyframe.time);
          anim.max_time = Math.max(anim.max_time, order_keyframe.time);
          anim.order_keyframes.push(order_keyframe);
        });
        anim.order_keyframes.sort(spine.Keyframe.compare);
        break;
      case 'ik':
        Object.keys(json[key] || {}).forEach(function(ikc_key) {
          var anim_ikc = new spine.AnimIkc().load(json[key][ikc_key]);
          anim.min_time = Math.min(anim.min_time, anim_ikc.min_time);
          anim.max_time = Math.max(anim.max_time, anim_ikc.max_time);
          anim.ikcs[ikc_key] = anim_ikc;
        });
        break;
      case 'ffd':
        Object.keys(json[key] || {}).forEach(function(ffd_key) {
          var anim_ffd = new spine.AnimFfd().load(json[key][ffd_key]);
          anim.min_time = Math.min(anim.min_time, anim_ffd.min_time);
          anim.max_time = Math.max(anim.max_time, anim_ffd.max_time);
          anim.ffds[ffd_key] = anim_ffd;
        });
        break;
      default:
        console.log("TODO: spine.Animation::load", key);
        break;
    }
  });

  anim.length = anim.max_time - anim.min_time;

  return anim;
}

/**
 * @constructor
 */
spine.Skeleton = function() {}

/** @type {string} */
spine.Skeleton.prototype.hash = "";
/** @type {string} */
spine.Skeleton.prototype.spine = "";
/** @type {number} */
spine.Skeleton.prototype.width = 0;
/** @type {number} */
spine.Skeleton.prototype.height = 0;
/** @type {string} */
spine.Skeleton.prototype.images = "";

/**
 * @return {spine.Skeleton}
 * @param {Object.<string,?>} json
 */
spine.Skeleton.prototype.load = function(json) {
  var skel = this;

  skel.hash = spine.loadString(json, 'hash', "");
  skel.spine = spine.loadString(json, 'spine', "");
  skel.width = spine.loadInt(json, 'width', 0);
  skel.height = spine.loadInt(json, 'height', 0);
  skel.images = spine.loadString(json, 'images', "");

  return skel;
}

/**
 * @constructor
 */
spine.Data = function() {
  var data = this;
  data.skeleton = new spine.Skeleton();
  data.bones = {};
  data.bone_keys = [];
  data.ikcs = {};
  data.ikc_keys = [];
  data.slots = {};
  data.slot_keys = [];
  data.skins = {};
  data.skin_keys = [];
  data.events = {};
  data.event_keys = [];
  data.anims = {};
  data.anim_keys = [];
}

/** @type {string} */
spine.Data.prototype.name = "";

/** @type {spine.Skeleton} */
spine.Data.prototype.skeleton;
/** @type {Object.<string,spine.Bone>} */
spine.Data.prototype.bones;
/** @type {Array.<string>} */
spine.Data.prototype.bone_keys;
/** @type {Object.<string,spine.Ikc>} */
spine.Data.prototype.ikcs;
/** @type {Array.<string>} */
spine.Data.prototype.ikc_keys;
/** @type {Object.<string,spine.Slot>} */
spine.Data.prototype.slots;
/** @type {Array.<string>} */
spine.Data.prototype.slot_keys;
/** @type {Object.<string,spine.Skin>} */
spine.Data.prototype.skins;
/** @type {Array.<string>} */
spine.Data.prototype.skin_keys;
/** @type {Object.<string,spine.Event>} */
spine.Data.prototype.events;
/** @type {Array.<string>} */
spine.Data.prototype.event_keys;
/** @type {Object.<string,spine.Animation>} */
spine.Data.prototype.anims;
/** @type {Array.<string>} */
spine.Data.prototype.anim_keys;

/**
 * @return {spine.Data}
 * @param {?} json
 */
spine.Data.prototype.load = function(json) {
  var data = this;

  data.bones = {};
  data.bone_keys = [];
  data.ikcs = {};
  data.ikc_keys = [];
  data.slots = {};
  data.slot_keys = [];
  data.skins = {};
  data.skin_keys = [];
  data.events = {};
  data.event_keys = [];
  data.anims = {};
  data.anim_keys = [];

  Object.keys(json || {}).forEach(function(key) {
    switch (key) {
      case 'skeleton':
        data.skeleton.load(json[key]);
        break;
      case 'bones':
        var json_bones = json[key];
        json_bones.forEach(function(bone, bone_index) {
          data.bones[bone.name] = new spine.Bone().load(bone);
          data.bone_keys[bone_index] = bone.name;
        });
        break;
      case 'ik':
        var json_ik = json[key];
        json_ik.forEach(function(ikc, ikc_index) {
          data.ikcs[ikc.name] = new spine.Ikc().load(ikc);
          data.ikc_keys[ikc_index] = ikc.name;
        });
        // sort by ancestry
        data.ikc_keys = data.ikc_keys.sort(function(a, b) {
          var ikc_a = data.ikcs[a];
          var ikc_b = data.ikcs[b];
          for (var ia = 0; ia < ikc_a.bone_keys.length; ++ia) {
            var bone_a = data.bones[ikc_a.bone_keys[ia]];
            for (var ib = 0; ib < ikc_b.bone_keys.length; ++ib) {
              var bone_b = data.bones[ikc_b.bone_keys[ib]];
              var bone_a_parent = data.bones[bone_a.parent_key];
              while (bone_a_parent) {
                if (bone_a_parent === bone_b) {
                  return 1;
                }
                bone_a_parent = data.bones[bone_a_parent.parent_key];
              }
              var bone_b_parent = data.bones[bone_b.parent_key];
              while (bone_b_parent) {
                if (bone_b_parent === bone_a) {
                  return -1;
                }
                bone_b_parent = data.bones[bone_b_parent.parent_key];
              }
            }
          }
          return 0;
        });
        break;
      case 'slots':
        var json_slots = json[key];
        json_slots.forEach(function(slot, slot_index) {
          data.slots[slot.name] = new spine.Slot().load(slot);
          data.slot_keys[slot_index] = slot.name;
        });
        break;
      case 'skins':
        var json_skins = json[key] || {};
        data.skin_keys = Object.keys(json_skins);
        data.skin_keys.forEach(function(skin_key) {
          var skin = data.skins[skin_key] = new spine.Skin().load(json_skins[skin_key]);
          skin.name = skin.name || skin_key;
        });
        break;
      case 'events':
        var json_events = json[key] || {};
        data.event_keys = Object.keys(json_events);
        data.event_keys.forEach(function(event_key) {
          var event = data.events[event_key] = new spine.Event().load(json_events[event_key]);
          event.name = event.name || event_key;
        });
        break;
      case 'animations':
        var json_animations = json[key] || {};
        data.anim_keys = Object.keys(json_animations);
        data.anim_keys.forEach(function(anim_key) {
          var anim = data.anims[anim_key] = new spine.Animation().load(json_animations[anim_key]);
          anim.name = anim.name || anim_key;
        });
        break;
      default:
        console.log("TODO: spine.Skeleton::load", key);
        break;
    }
  });

  data.iterateBones(function(bone_key, bone) {
    spine.Bone.flatten(bone, data.bones);
  });

  return data;
}

/**
 * @return {spine.Data}
 * @param {?} json
 */
spine.Data.prototype.loadSkeleton = function(json) {
  var data = this;
  data.skeleton.load(json);
  return data;
}

/**
 * @return {spine.Data}
 * @param {?} json
 */
spine.Data.prototype.loadEvent = function(name, json) {
  var data = this;
  var event = data.events[name] = new spine.Event().load(json);
  event.name = event.name || name;
  return data;
}

/**
 * @return {spine.Data}
 * @param {?} json
 */
spine.Data.prototype.loadAnimation = function(name, json) {
  var data = this;
  var anim = data.anims[name] = new spine.Animation().load(json);
  anim.name = anim.name || name;
  return data;
}

/**
 * @return {Object.<string,spine.Skin>}
 */
spine.Data.prototype.getSkins = function() {
  var data = this;
  return data.skins;
}

/**
 * @return {Object.<string,spine.Event>}
 */
spine.Data.prototype.getEvents = function() {
  var data = this;
  return data.events;
}

/**
 * @return {Object.<string,spine.Animation>}
 */
spine.Data.prototype.getAnims = function() {
  var data = this;
  return data.anims;
}

/**
 * @return {void}
 * @param {function(string, spine.Bone):void} callback
 */
spine.Data.prototype.iterateBones = function(callback) {
  var data = this;
  data.bone_keys.forEach(function(bone_key) {
    var data_bone = data.bones[bone_key];
    callback(bone_key, data_bone);
  });
}

/**
 * @return {void}
 * @param {function(string, spine.Slot, spine.SkinSlot, string, spine.Attachment):void} callback
 */
spine.Data.prototype.iterateAttachments = function(skin_key, callback) {
  var data = this;
  var skin = data.skins[skin_key];
  var default_skin = data.skins['default'];
  data.slot_keys.forEach(function(slot_key) {
    var data_slot = data.slots[slot_key];
    var skin_slot = skin && (skin.slots[slot_key] || default_skin.slots[slot_key]);
    var attachment = skin_slot && skin_slot.attachments[data_slot.attachment_key];
    var attachment_key = (attachment && (attachment.path || attachment.name)) || data_slot.attachment_key;
    callback(slot_key, data_slot, skin_slot, attachment_key, attachment);
  });
}

/**
 * @return {void}
 * @param {function(string, spine.Skin):void} callback
 */
spine.Data.prototype.iterateSkins = function(callback) {
  var data = this;
  data.skin_keys.forEach(function(skin_key) {
    var skin = data.skins[skin_key];
    callback(skin_key, skin);
  });
}

/**
 * @return {void}
 * @param {function(string, spine.Event):void} callback
 */
spine.Data.prototype.iterateEvents = function(callback) {
  var data = this;
  data.event_keys.forEach(function(event_key) {
    var event = data.events[event_key];
    callback(event_key, event);
  });
}

/**
 * @return {void}
 * @param {function(string, spine.Animation):void} callback
 */
spine.Data.prototype.iterateAnims = function(callback) {
  var data = this;
  data.anim_keys.forEach(function(anim_key) {
    var anim = data.anims[anim_key];
    callback(anim_key, anim);
  });
}

/**
 * @constructor
 * @param {spine.Data=} data
 */
spine.Pose = function(data) {
  var pose = this;
  pose.data = data || null;
  pose.bones = {};
  pose.bone_keys = [];
  pose.slots = {};
  pose.slot_keys = [];
  pose.events = [];
}

/** @type {spine.Data} */
spine.Pose.prototype.data;

/** @type {string} */
spine.Pose.prototype.skin_key = "";
/** @type {string} */
spine.Pose.prototype.anim_key = "";
/** @type {number} */
spine.Pose.prototype.time = 0;
/** @type {number} */
spine.Pose.prototype.elapsed_time = 0;

/** @type {boolean} */
spine.Pose.prototype.dirty = true;

/** @type {Object.<string,spine.Bone>} */
spine.Pose.prototype.bones;

/** @type {Array.<string>} */
spine.Pose.prototype.bone_keys;

/** @type {Object.<string,spine.Slot>} */
spine.Pose.prototype.slots;

/** @type {Array.<string>} */
spine.Pose.prototype.slot_keys;

/** @type {Array.<spine.Event>} */
spine.Pose.prototype.events;

/**
 * @return {spine.Skeleton}
 */
spine.Pose.prototype.curSkel = function() {
  var pose = this;
  var data = pose.data;
  return data && data.skeleton;
}

/**
 * @return {Object.<string,spine.Skin>}
 */
spine.Pose.prototype.getSkins = function() {
  var pose = this;
  var data = pose.data;
  return data && data.skins;
}

/**
 * @return {spine.Skin}
 */
spine.Pose.prototype.curSkin = function() {
  var pose = this;
  var data = pose.data;
  return data && data.skins[pose.skin_key];
}

/**
 * @return {string}
 */
spine.Pose.prototype.getSkin = function() {
  var pose = this;
  return pose.skin_key;
}

/**
 * @return {void}
 * @param {string} skin_key
 */
spine.Pose.prototype.setSkin = function(skin_key) {
  var pose = this;
  if (pose.skin_key !== skin_key) {
    pose.skin_key = skin_key;
  }
}

/**
 * @return {Object.<string,spine.Event>}
 */
spine.Pose.prototype.getEvents = function() {
  var pose = this;
  var data = pose.data;
  return data && data.events;
}

/**
 * @return {Object.<string,spine.Animation>}
 */
spine.Pose.prototype.getAnims = function() {
  var pose = this;
  var data = pose.data;
  return data && data.anims;
}

/**
 * @return {spine.Animation}
 */
spine.Pose.prototype.curAnim = function() {
  var pose = this;
  var data = pose.data;
  return data && data.anims[pose.anim_key];
}

/**
 * @return {number}
 */
spine.Pose.prototype.curAnimLength = function() {
  var pose = this;
  var data = pose.data;
  var anim = data && data.anims[pose.anim_key];
  return (anim && anim.length) || 0;
}

/**
 * @return {string}
 */
spine.Pose.prototype.getAnim = function() {
  var pose = this;
  return pose.anim_key;
}

/**
 * @return {void}
 * @param {string} anim_key
 */
spine.Pose.prototype.setAnim = function(anim_key) {
  var pose = this;
  if (pose.anim_key !== anim_key) {
    pose.anim_key = anim_key;
    var data = pose.data;
    var anim = data && data.anims[pose.anim_key];
    if (anim) {
      pose.time = spine.wrap(pose.time, anim.min_time, anim.max_time);
    }
    pose.elapsed_time = 0;
    pose.dirty = true;
  }
}

/**
 * @return {number}
 */
spine.Pose.prototype.getTime = function() {
  var pose = this;
  return pose.time;
}

/**
 * @return {void}
 * @param {number} time
 */
spine.Pose.prototype.setTime = function(time) {
  var pose = this;
  var data = pose.data;
  var anim = data && data.anims[pose.anim_key];
  if (anim) {
    time = spine.wrap(time, anim.min_time, anim.max_time);
  }

  if (pose.time !== time) {
    pose.time = time;
    pose.elapsed_time = 0;
    pose.dirty = true;
  }
}

/**
 * @return {void}
 * @param {number} elapsed_time
 */
spine.Pose.prototype.update = function(elapsed_time) {
  var pose = this;
  pose.elapsed_time += elapsed_time;
  pose.dirty = true;
}

/**
 * @return {void}
 */
spine.Pose.prototype.strike = function() {
  var pose = this;
  if (!pose.dirty) {
    return;
  }
  pose.dirty = false;

  var data = pose.data;

  var anim = data && data.anims[pose.anim_key];

  var prev_time = pose.time;
  var elapsed_time = pose.elapsed_time;

  pose.time = pose.time + pose.elapsed_time; // accumulate elapsed time
  pose.elapsed_time = 0; // reset elapsed time for next strike

  var wrapped_min = false;
  var wrapped_max = false;
  if (anim) {
    wrapped_min = (elapsed_time < 0) && (pose.time <= anim.min_time);
    wrapped_max = (elapsed_time > 0) && (pose.time >= anim.max_time);
    pose.time = spine.wrap(pose.time, anim.min_time, anim.max_time);
  }

  var time = pose.time;

  var keyframe_index;
  var pct;

  data.bone_keys.forEach(function(bone_key) {
    var data_bone = data.bones[bone_key];
    var pose_bone = pose.bones[bone_key] || (pose.bones[bone_key] = new spine.Bone());

    // start with a copy of the data bone
    pose_bone.copy(data_bone);

    // tween anim bone if keyframes are available
    var anim_bone = anim && anim.bones[bone_key];
    if (anim_bone) {
      keyframe_index = spine.Keyframe.find(anim_bone.translate_keyframes, time);
      if (keyframe_index !== -1) {
        var translate_keyframe0 = anim_bone.translate_keyframes[keyframe_index];
        var translate_keyframe1 = anim_bone.translate_keyframes[keyframe_index + 1];
        if (translate_keyframe1) {
          pct = translate_keyframe0.curve.evaluate((time - translate_keyframe0.time) / (translate_keyframe1.time - translate_keyframe0.time));
          pose_bone.local_space.position.x += spine.tween(translate_keyframe0.position.x, translate_keyframe1.position.x, pct);
          pose_bone.local_space.position.y += spine.tween(translate_keyframe0.position.y, translate_keyframe1.position.y, pct);
        } else {
          pose_bone.local_space.position.x += translate_keyframe0.position.x;
          pose_bone.local_space.position.y += translate_keyframe0.position.y;
        }
      }

      keyframe_index = spine.Keyframe.find(anim_bone.rotate_keyframes, time);
      if (keyframe_index !== -1) {
        var rotate_keyframe0 = anim_bone.rotate_keyframes[keyframe_index];
        var rotate_keyframe1 = anim_bone.rotate_keyframes[keyframe_index + 1];
        if (rotate_keyframe1) {
          pct = rotate_keyframe0.curve.evaluate((time - rotate_keyframe0.time) / (rotate_keyframe1.time - rotate_keyframe0.time));
          pose_bone.local_space.rotation.rad += spine.tweenAngle(rotate_keyframe0.rotation.rad, rotate_keyframe1.rotation.rad, pct);
        } else {
          pose_bone.local_space.rotation.rad += rotate_keyframe0.rotation.rad;
        }
      }

      keyframe_index = spine.Keyframe.find(anim_bone.scale_keyframes, time);
      if (keyframe_index !== -1) {
        var scale_keyframe0 = anim_bone.scale_keyframes[keyframe_index];
        var scale_keyframe1 = anim_bone.scale_keyframes[keyframe_index + 1];
        if (scale_keyframe1) {
          pct = scale_keyframe0.curve.evaluate((time - scale_keyframe0.time) / (scale_keyframe1.time - scale_keyframe0.time));
          pose_bone.local_space.scale.x += spine.tween(scale_keyframe0.scale.x, scale_keyframe1.scale.x, pct) - 1;
          pose_bone.local_space.scale.y += spine.tween(scale_keyframe0.scale.y, scale_keyframe1.scale.y, pct) - 1;
        } else {
          pose_bone.local_space.scale.x += scale_keyframe0.scale.x - 1;
          pose_bone.local_space.scale.y += scale_keyframe0.scale.y - 1;
        }
      }
    }
  });

  pose.bone_keys = data.bone_keys;

  // ik constraints

  data.ikc_keys.forEach(function(ikc_key) {
    function clamp(n, lo, hi) {
      return (n < lo) ? (lo) : ((n > hi) ? (hi) : (n));
    }

    var ikc = data.ikcs[ikc_key];
    var ikc_mix = ikc.mix;
    var ikc_bend_positive = ikc.bend_positive;

    var anim_ikc = anim && anim.ikcs[ikc_key];
    if (anim_ikc) {
      keyframe_index = spine.Keyframe.find(anim_ikc.ikc_keyframes, time);
      if (keyframe_index !== -1) {
        var ikc_keyframe0 = anim_ikc.ikc_keyframes[keyframe_index];
        var ikc_keyframe1 = anim_ikc.ikc_keyframes[keyframe_index + 1];
        if (ikc_keyframe1) {
          pct = ikc_keyframe0.curve.evaluate((time - ikc_keyframe0.time) / (ikc_keyframe1.time - ikc_keyframe0.time));
          ikc_mix = spine.tween(ikc_keyframe0.mix, ikc_keyframe1.mix, pct);
        } else {
          ikc_mix = ikc_keyframe0.mix;
        }
        // no tweening ik bend direction
        ikc_bend_positive = ikc_keyframe0.bend_positive;
      }
    }

    var target = pose.bones[ikc.target_key];
    spine.Bone.flatten(target, pose.bones);
    var target_x = target.world_space.position.x;
    var target_y = target.world_space.position.y;
    var alpha = ikc_mix;
    var bend_direction = (ikc_bend_positive) ? (1) : (-1);

    if (alpha === 0) {
      return;
    }

    switch (ikc.bone_keys.length) {
      case 1:
        var bone = pose.bones[ikc.bone_keys[0]];
        spine.Bone.flatten(bone, pose.bones);
        var parent_rotation = 0;
        var bone_parent = pose.bones[bone.parent_key];
        if (bone_parent && bone.inherit_rotation) {
          spine.Bone.flatten(bone_parent, pose.bones);
          parent_rotation = bone_parent.world_space.rotation.rad;
        }
        target_x -= bone.world_space.position.x;
        target_y -= bone.world_space.position.y;
        bone.local_space.rotation.rad = spine.tweenAngle(bone.local_space.rotation.rad, Math.atan2(target_y, target_x) - parent_rotation, alpha);
        break;
      case 2:
        var parent = pose.bones[ikc.bone_keys[0]];
        spine.Bone.flatten(parent, pose.bones);
        var child = pose.bones[ikc.bone_keys[1]];
        spine.Bone.flatten(child, pose.bones);
        var position = new spine.Vector();
        var parent_parent = pose.bones[parent.parent_key];
        if (parent_parent) {
          position.x = target_x;
          position.y = target_y;
          spine.Bone.flatten(parent_parent, pose.bones);
          spine.Space.untransform(parent_parent.world_space, position, position); // world to local
          target_x = (position.x - parent.local_space.position.x) * parent_parent.world_space.scale.x;
          target_y = (position.y - parent.local_space.position.y) * parent_parent.world_space.scale.y;
        } else {
          target_x -= parent.local_space.position.x;
          target_y -= parent.local_space.position.y;
        }
        position.copy(child.local_space.position);
        var child_parent = pose.bones[child.parent_key];
        if (child_parent !== parent) {
          spine.Bone.flatten(child_parent, pose.bones);
          spine.Space.transform(child_parent.world_space, position, position); // local to world
          spine.Space.untransform(parent.world_space, position, position); // world to local
        }
        var child_x = position.x * parent.world_space.scale.x;
        var child_y = position.y * parent.world_space.scale.y;
        var offset = Math.atan2(child_y, child_x);
        var len1 = Math.sqrt(child_x * child_x + child_y * child_y);
        var len2 = child.length * child.world_space.scale.x;
        var cos_denom = 2 * len1 * len2;
        if (cos_denom < 0.0001) {
          child.local_space.rotation.rad = spine.tweenAngle(child.local_space.rotation.rad, Math.atan2(target_y, target_x) - parent.local_space.rotation.rad, alpha);
          return;
        }
        var cos = clamp((target_x * target_x + target_y * target_y - len1 * len1 - len2 * len2) / cos_denom, -1, 1);
        var rad = Math.acos(cos) * bend_direction;
        var sin = Math.sin(rad);
        var adjacent = len2 * cos + len1;
        var opposite = len2 * sin;
        var parent_angle = Math.atan2(target_y * adjacent - target_x * opposite, target_x * adjacent + target_y * opposite);
        parent.local_space.rotation.rad = spine.tweenAngle(parent.local_space.rotation.rad, (parent_angle - offset), alpha);
        var child_angle = rad;
        if (child_parent !== parent) {
          child_angle += parent.world_space.rotation.rad - child_parent.world_space.rotation.rad;
        }
        child.local_space.rotation.rad = spine.tweenAngle(child.local_space.rotation.rad, (child_angle + offset), alpha);
        break;
    }
  });

  pose.iterateBones(function(bone_key, bone) {
    spine.Bone.flatten(bone, pose.bones);
  });

  data.slot_keys.forEach(function(slot_key) {
    var data_slot = data.slots[slot_key];
    var pose_slot = pose.slots[slot_key] || (pose.slots[slot_key] = new spine.Slot());

    // start with a copy of the data slot
    pose_slot.copy(data_slot);

    // tween anim slot if keyframes are available
    var anim_slot = anim && anim.slots[slot_key];
    if (anim_slot) {
      keyframe_index = spine.Keyframe.find(anim_slot.color_keyframes, time);
      if (keyframe_index !== -1) {
        var color_keyframe0 = anim_slot.color_keyframes[keyframe_index];
        var color_keyframe1 = anim_slot.color_keyframes[keyframe_index + 1];
        if (color_keyframe1) {
          pct = color_keyframe0.curve.evaluate((time - color_keyframe0.time) / (color_keyframe1.time - color_keyframe0.time));
          pose_slot.color.r = spine.tween(color_keyframe0.color.r, color_keyframe1.color.r, pct);
          pose_slot.color.g = spine.tween(color_keyframe0.color.g, color_keyframe1.color.g, pct);
          pose_slot.color.b = spine.tween(color_keyframe0.color.b, color_keyframe1.color.b, pct);
          pose_slot.color.a = spine.tween(color_keyframe0.color.a, color_keyframe1.color.a, pct);
        } else {
          pose_slot.color.r = color_keyframe0.color.r;
          pose_slot.color.g = color_keyframe0.color.g;
          pose_slot.color.b = color_keyframe0.color.b;
          pose_slot.color.a = color_keyframe0.color.a;
        }
      }

      keyframe_index = spine.Keyframe.find(anim_slot.attachment_keyframes, time);
      if (keyframe_index !== -1) {
        var attachment_keyframe0 = anim_slot.attachment_keyframes[keyframe_index];
        // no tweening attachments
        pose_slot.attachment_key = attachment_keyframe0.name;
      }
    }
  });

  pose.slot_keys = data.slot_keys;

  if (anim) {
    keyframe_index = spine.Keyframe.find(anim.order_keyframes, time);
    if (keyframe_index !== -1) {
      var order_keyframe = anim.order_keyframes[keyframe_index];
      pose.slot_keys = data.slot_keys.slice(0); // copy array before reordering
      order_keyframe.slot_offsets.forEach(function(slot_offset) {
        var slot_index = pose.slot_keys.indexOf(slot_offset.slot_key);
        if (slot_index !== -1) {
          // delete old position
          pose.slot_keys.splice(slot_index, 1);
          // insert new position
          pose.slot_keys.splice(slot_index + slot_offset.offset, 0, slot_offset.slot_key);
        }
      });
    }
  }

  pose.events.length = 0;

  if (anim && anim.event_keyframes) {
    var add_event = function(event_keyframe) {
      var pose_event = new spine.Event();
      var data_event = data.events[event_keyframe.name];
      if (data_event) {
        pose_event.copy(data_event);
      }
      pose_event.int_value = event_keyframe.int_value || pose_event.int_value;
      pose_event.float_value = event_keyframe.float_value || pose_event.float_value;
      pose_event.string_value = event_keyframe.string_value || pose_event.string_value;
      pose.events.push(pose_event);
    }

    if (elapsed_time < 0) {
      if (wrapped_min) {
        // min    prev_time           time      max
        //  |         |                |         |
        //  ----------x                o<---------
        // all events between min_time and prev_time, not including prev_time
        // all events between max_time and time
        anim.event_keyframes.forEach(function(event_keyframe) {
          if (((anim.min_time <= event_keyframe.time) && (event_keyframe.time < prev_time)) ||
            ((time <= event_keyframe.time) && (event_keyframe.time <= anim.max_time))) {
            add_event(event_keyframe);
          }
        });
      } else {
        // min       time          prev_time    max
        //  |         |                |         |
        //            o<---------------x
        // all events between time and prev_time, not including prev_time
        anim.event_keyframes.forEach(function(event_keyframe) {
          if ((time <= event_keyframe.time) && (event_keyframe.time < prev_time)) {
            add_event(event_keyframe);
          }
        });
      }
    } else {
      if (wrapped_max) {
        // min       time          prev_time    max
        //  |         |                |         |
        //  --------->o                x----------
        // all events between prev_time and max_time, not including prev_time
        // all events between min_time and time
        anim.event_keyframes.forEach(function(event_keyframe) {
          if (((anim.min_time <= event_keyframe.time) && (event_keyframe.time <= time)) ||
            ((prev_time < event_keyframe.time) && (event_keyframe.time <= anim.max_time))) {
            add_event(event_keyframe);
          }
        });
      } else {
        // min    prev_time           time      max
        //  |         |                |         |
        //            x--------------->o
        // all events between prev_time and time, not including prev_time
        anim.event_keyframes.forEach(function(event_keyframe) {
          if ((prev_time < event_keyframe.time) && (event_keyframe.time <= time)) {
            add_event(event_keyframe);
          }
        });
      }
    }
  }
}

/**
 * @return {void}
 * @param {function(string, spine.Bone):void} callback
 */
spine.Pose.prototype.iterateBones = function(callback) {
  var pose = this;
  pose.bone_keys.forEach(function(bone_key) {
    var bone = pose.bones[bone_key];
    callback(bone_key, bone);
  });
}

/**
 * @return {void}
 * @param {function(string, spine.Slot, spine.SkinSlot, string, spine.Attachment):void} callback
 */
spine.Pose.prototype.iterateAttachments = function(callback) {
  var pose = this;
  var data = pose.data;
  var skin = data && data.skins[pose.skin_key];
  var default_skin = data && data.skins['default'];
  pose.slot_keys.forEach(function(slot_key) {
    var pose_slot = pose.slots[slot_key];
    var skin_slot = skin && (skin.slots[slot_key] || default_skin.slots[slot_key]);
    var attachment = skin_slot && skin_slot.attachments[pose_slot.attachment_key];
    var attachment_key = (attachment && (attachment.path || attachment.name)) || pose_slot.attachment_key;
    callback(slot_key, pose_slot, skin_slot, attachment_key, attachment);
  });
}

spine.deprecated = function() {
  console.log("deprecated");
}

Object.defineProperty(spine, 'color', {
  get: function() {
    spine.deprecated();
    return spine.Color;
  }
});

Object.defineProperty(spine, 'skel_bone', {
  get: function() {
    spine.deprecated();
    return spine.Bone;
  }
});
Object.defineProperty(spine.Bone.prototype, 'x', {
  get: /** @this {spine.Bone} */ function() {
    spine.deprecated();
    return this.local_space.position.x;
  }
});
Object.defineProperty(spine.Bone.prototype, 'y', {
  get: /** @this {spine.Bone} */ function() {
    spine.deprecated();
    return this.local_space.position.y;
  }
});
Object.defineProperty(spine.Bone.prototype, 'rotation', {
  get: /** @this {spine.Bone} */ function() {
    spine.deprecated();
    return this.local_space.rotation.deg;
  }
});
Object.defineProperty(spine.Bone.prototype, 'scaleX', {
  get: /** @this {spine.Bone} */ function() {
    spine.deprecated();
    return this.local_space.scale.x;
  }
});
Object.defineProperty(spine.Bone.prototype, 'scaleY', {
  get: /** @this {spine.Bone} */ function() {
    spine.deprecated();
    return this.local_space.scale.y;
  }
});
Object.defineProperty(spine.Bone.prototype, 'parent', {
  get: /** @this {spine.Bone} */ function() {
    spine.deprecated();
    return this.parent_key;
  }
});
Object.defineProperty(spine.Bone.prototype, 'inheritRotation', {
  get: /** @this {spine.Bone} */ function() {
    spine.deprecated();
    return this.inherit_rotation;
  }
});
Object.defineProperty(spine.Bone.prototype, 'inheritScale', {
  get: /** @this {spine.Bone} */ function() {
    spine.deprecated();
    return this.inherit_scale;
  }
});

Object.defineProperty(spine, 'skel_slot', {
  get: function() {
    spine.deprecated();
    return spine.Slot;
  }
});
Object.defineProperty(spine.Slot.prototype, 'bone', {
  get: /** @this {spine.Slot} */ function() {
    spine.deprecated();
    return this.bone_key;
  }
});
Object.defineProperty(spine.Slot.prototype, 'attachment', {
  get: /** @this {spine.Slot} */ function() {
    spine.deprecated();
    return this.attachment_key;
  }
});
Object.defineProperty(spine.Slot.prototype, 'additive', {
  get: /** @this {spine.Slot} */ function() {
    spine.deprecated();
    return this.blend === 'additive';
  }
});

Object.defineProperty(spine, 'attachment', {
  get: function() {
    spine.deprecated();
    return spine.RegionAttachment;
  }
});
Object.defineProperty(spine.RegionAttachment.prototype, 'x', {
  get: /** @this {spine.RegionAttachment} */ function() {
    spine.deprecated();
    return this.local_space.position.x;
  }
});
Object.defineProperty(spine.RegionAttachment.prototype, 'y', {
  get: /** @this {spine.RegionAttachment} */ function() {
    spine.deprecated();
    return this.local_space.position.y;
  }
});
Object.defineProperty(spine.RegionAttachment.prototype, 'rotation', {
  get: /** @this {spine.RegionAttachment} */ function() {
    spine.deprecated();
    return this.local_space.rotation.deg;
  }
});
Object.defineProperty(spine.RegionAttachment.prototype, 'scaleX', {
  get: /** @this {spine.RegionAttachment} */ function() {
    spine.deprecated();
    return this.local_space.scale.x;
  }
});
Object.defineProperty(spine.RegionAttachment.prototype, 'scaleY', {
  get: /** @this {spine.RegionAttachment} */ function() {
    spine.deprecated();
    return this.local_space.scale.y;
  }
});

Object.defineProperty(spine, 'skin_slot', {
  get: function() {
    spine.deprecated();
    return spine.SkinSlot;
  }
});
Object.defineProperty(spine.SkinSlot.prototype, 'skin_attachments', {
  get: /** @this {spine.SkinSlot} */ function() {
    spine.deprecated();
    return this.attachments;
  }
});

Object.defineProperty(spine, 'skin', {
  get: function() {
    spine.deprecated();
    return spine.Skin;
  }
});
Object.defineProperty(spine.Skin.prototype, 'skin_slots', {
  get: /** @this {spine.Skin} */ function() {
    spine.deprecated();
    return this.slots;
  }
});

Object.defineProperty(spine, 'event', {
  get: function() {
    spine.deprecated();
    return spine.Event;
  }
});

Object.defineProperty(spine, 'keyframe', {
  get: function() {
    spine.deprecated();
    return spine.Keyframe;
  }
});

Object.defineProperty(spine, 'bone_keyframe', {
  get: function() {
    spine.deprecated();
    return spine.BoneKeyframe;
  }
});
Object.defineProperty(spine, 'translate_keyframe', {
  get: function() {
    spine.deprecated();
    return spine.TranslateKeyframe;
  }
});
Object.defineProperty(spine, 'rotate_keyframe', {
  get: function() {
    spine.deprecated();
    return spine.RotateKeyframe;
  }
});
Object.defineProperty(spine, 'scale_keyframe', {
  get: function() {
    spine.deprecated();
    return spine.ScaleKeyframe;
  }
});

Object.defineProperty(spine, 'anim_bone', {
  get: function() {
    spine.deprecated();
    return spine.AnimBone;
  }
});

Object.defineProperty(spine, 'slot_keyframe', {
  get: function() {
    spine.deprecated();
    return spine.SlotKeyframe;
  }
});
Object.defineProperty(spine, 'color_keyframe', {
  get: function() {
    spine.deprecated();
    return spine.ColorKeyframe;
  }
});
Object.defineProperty(spine, 'attachment_keyframe', {
  get: function() {
    spine.deprecated();
    return spine.AttachmentKeyframe;
  }
});

Object.defineProperty(spine, 'anim_slot', {
  get: function() {
    spine.deprecated();
    return spine.AnimSlot;
  }
});

Object.defineProperty(spine, 'event_keyframe', {
  get: function() {
    spine.deprecated();
    return spine.EventKeyframe;
  }
});

Object.defineProperty(spine, 'slot_offset', {
  get: function() {
    spine.deprecated();
    return spine.SlotOffset;
  }
});
Object.defineProperty(spine, 'order_keyframe', {
  get: function() {
    spine.deprecated();
    return spine.OrderKeyframe;
  }
});

Object.defineProperty(spine, 'animation', {
  get: function() {
    spine.deprecated();
    return spine.Animation;
  }
});
Object.defineProperty(spine.Animation.prototype, 'anim_bones', {
  get: /** @this {spine.Animation} */ function() {
    spine.deprecated();
    return this.bones;
  }
});
Object.defineProperty(spine.Animation.prototype, 'anim_slots', {
  get: /** @this {spine.Animation} */ function() {
    spine.deprecated();
    return this.slots;
  }
});

Object.defineProperty(spine, 'skeleton', {
  get: function() {
    spine.deprecated();
    return spine.Skeleton;
  }
});

Object.defineProperty(spine, 'data', {
  get: function() {
    spine.deprecated();
    return spine.Data;
  }
});
Object.defineProperty(spine.Data.prototype, 'animations', {
  get: /** @this {spine.Data} */ function() {
    spine.deprecated();
    return this.anims;
  }
});

Object.defineProperty(spine, 'pose', {
  get: function() {
    spine.deprecated();
    return spine.Pose;
  }
});
Object.defineProperty(spine.Pose.prototype, 'tweened_skel_bones', {
  get: /** @this {spine.Pose} */ function() {
    spine.deprecated();
    return this.bones;
  }
});
Object.defineProperty(spine.Pose.prototype, 'tweened_skel_slots', {
  get: /** @this {spine.Pose} */ function() {
    spine.deprecated();
    return this.slots;
  }
});
Object.defineProperty(spine.Pose.prototype, 'tweened_skel_slot_keys', {
  get: /** @this {spine.Pose} */ function() {
    spine.deprecated();
    return this.slot_keys;
  }
});
Object.defineProperty(spine.Pose.prototype, 'tweened_events', {
  get: /** @this {spine.Pose} */ function() {
    spine.deprecated();
    return this.events;
  }
});
goog.provide('RenderCtx2D');

/**
 * @constructor
 * @param {CanvasRenderingContext2D} ctx
 */
RenderCtx2D = function(ctx) {
  var render = this;
  render.ctx = ctx;
  render.images = {};
  render.skin_info_map = {};
  render.region_vertex_position = new Float32Array([-1, -1, 1, -1, 1, 1, -1, 1]); // [ x, y ]
  render.region_vertex_texcoord = new Float32Array([0, 1, 1, 1, 1, 0, 0, 0]); // [ u, v ]
  render.region_vertex_triangle = new Uint16Array([0, 1, 2, 0, 2, 3]); // [ i0, i1, i2 ]
}

/**
 * @return {void}
 * @param {spine.Data} spine_data
 * @param {atlas.Data} atlas_data
 */
RenderCtx2D.prototype.dropData = function(spine_data, atlas_data) {
  var render = this;
  render.images = {};
  render.skin_info_map = {};
}

/**
 * @return {void}
 * @param {spine.Data} spine_data
 * @param {atlas.Data} atlas_data
 * @param {Object.<string,HTMLImageElement>} images
 */
RenderCtx2D.prototype.loadData = function(spine_data, atlas_data, images) {
  var render = this;

  spine_data.iterateSkins(function(skin_key, skin) {
    var skin_info = render.skin_info_map[skin_key] = {};
    var slot_info_map = skin_info.slot_info_map = {};

    skin.iterateAttachments(function(slot_key, skin_slot, attachment_key, attachment) {
      if (!attachment) {
        return;
      }

      switch (attachment.type) {
        case 'mesh':
          var slot_info = slot_info_map[slot_key] = slot_info_map[slot_key] || {};
          var attachment_info_map = slot_info.attachment_info_map = slot_info.attachment_info_map || {};
          var attachment_info = attachment_info_map[attachment_key] = {};
          attachment_info.type = attachment.type;
          var vertex_count = attachment_info.vertex_count = attachment.vertices.length / 2;
          var vertex_position = attachment_info.vertex_position = new Float32Array(attachment.vertices);
          var vertex_texcoord = attachment_info.vertex_texcoord = new Float32Array(attachment.uvs);
          var vertex_triangle = attachment_info.vertex_triangle = new Uint16Array(attachment.triangles);
          break;
        case 'weightedmesh':
          var slot_info = slot_info_map[slot_key] = slot_info_map[slot_key] || {};
          var attachment_info_map = slot_info.attachment_info_map = slot_info.attachment_info_map || {};
          var attachment_info = attachment_info_map[attachment_key] = {};
          attachment_info.type = attachment.type;
          var vertex_count = attachment_info.vertex_count = attachment.uvs.length / 2;
          var vertex_setup_position = attachment_info.vertex_setup_position = new Float32Array(2 * vertex_count);
          var vertex_blend_position = attachment_info.vertex_blend_position = new Float32Array(2 * vertex_count);
          var vertex_texcoord = attachment_info.vertex_texcoord = new Float32Array(attachment.uvs);
          var vertex_triangle = attachment_info.vertex_triangle = new Uint16Array(attachment.triangles);
          var position = new spine.Vector();
          for (var vertex_index = 0, index = 0; vertex_index < vertex_count; ++vertex_index) {
            var blender_count = attachment.vertices[index++];
            var setup_position_x = 0;
            var setup_position_y = 0;
            for (var blender_index = 0; blender_index < blender_count; ++blender_index) {
              var bone_index = attachment.vertices[index++];
              var x = position.x = attachment.vertices[index++];
              var y = position.y = attachment.vertices[index++];
              var weight = attachment.vertices[index++];
              var bone_key = spine_data.bone_keys[bone_index];
              var bone = spine_data.bones[bone_key];
              spine.Space.transform(bone.world_space, position, position);
              setup_position_x += position.x * weight;
              setup_position_y += position.y * weight;
            }
            var vertex_setup_position_offset = vertex_index * 2;
            vertex_setup_position[vertex_setup_position_offset++] = setup_position_x;
            vertex_setup_position[vertex_setup_position_offset++] = setup_position_y;
          }
          vertex_blend_position.set(vertex_setup_position);
          break;
      }
    });
  });

  render.images = images;
}

/**
 * @return {void}
 * @param {spine.Pose} spine_pose
 * @param {atlas.Data} atlas_data
 */
RenderCtx2D.prototype.updatePose = function(spine_pose, atlas_data) {
  var render = this;

  spine_pose.iterateAttachments(function(slot_key, slot, skin_slot, attachment_key, attachment) {
    if (!attachment) {
      return;
    }
    switch (attachment.type) {
      case 'mesh':
        var skin_info = render.skin_info_map[spine_pose.skin_key],
          default_skin_info = render.skin_info_map['default'];
        var slot_info = skin_info.slot_info_map[slot_key] || default_skin_info.slot_info_map[slot_key];
        var attachment_info = slot_info.attachment_info_map[attachment_key];
        var anim = spine_pose.data.anims[spine_pose.anim_key];
        var anim_ffd = anim && anim.ffds && anim.ffds[spine_pose.skin_key];
        var ffd_slot = anim_ffd && anim_ffd.ffd_slots[slot_key];
        var ffd_attachment = ffd_slot && ffd_slot.ffd_attachments[attachment_key];
        var ffd_keyframes = ffd_attachment && ffd_attachment.ffd_keyframes;
        var ffd_keyframe_index = spine.Keyframe.find(ffd_keyframes, spine_pose.time);
        if (ffd_keyframe_index !== -1) {
          // ffd

          var pct = 0;
          var ffd_keyframe0 = ffd_keyframes[ffd_keyframe_index];
          var ffd_keyframe1 = ffd_keyframes[ffd_keyframe_index + 1];
          if (ffd_keyframe1) {
            pct = ffd_keyframe0.curve.evaluate((spine_pose.time - ffd_keyframe0.time) / (ffd_keyframe1.time - ffd_keyframe0.time));
          } else {
            ffd_keyframe1 = ffd_keyframe0;
          }

          for (var index = 0; index < attachment_info.vertex_position.length; ++index) {
            var v0 = ffd_keyframe0.vertices[index - ffd_keyframe0.offset] || 0;
            var v1 = ffd_keyframe1.vertices[index - ffd_keyframe1.offset] || 0;
            attachment_info.vertex_position[index] = attachment.vertices[index] + spine.tween(v0, v1, pct);
          }
        }
        break;
      case 'weightedmesh':
        var skin_info = render.skin_info_map[spine_pose.skin_key],
          default_skin_info = render.skin_info_map['default'];
        var slot_info = skin_info.slot_info_map[slot_key] || default_skin_info.slot_info_map[slot_key];
        var attachment_info = slot_info.attachment_info_map[attachment_key];
        var anim = spine_pose.data.anims[spine_pose.anim_key];
        var anim_ffd = anim && anim.ffds && anim.ffds[spine_pose.skin_key];
        var ffd_slot = anim_ffd && anim_ffd.ffd_slots[slot_key];
        var ffd_attachment = ffd_slot && ffd_slot.ffd_attachments[attachment_key];
        var ffd_keyframes = ffd_attachment && ffd_attachment.ffd_keyframes;
        var ffd_keyframe_index = spine.Keyframe.find(ffd_keyframes, spine_pose.time);
        if (ffd_keyframe_index !== -1) {
          // ffd

          var pct = 0;
          var ffd_keyframe0 = ffd_keyframes[ffd_keyframe_index];
          var ffd_keyframe1 = ffd_keyframes[ffd_keyframe_index + 1];
          if (ffd_keyframe1) {
            var pct = ffd_keyframe0.curve.evaluate((spine_pose.time - ffd_keyframe0.time) / (ffd_keyframe1.time - ffd_keyframe0.time));
          } else {
            ffd_keyframe1 = ffd_keyframe0;
          }

          var vertex_blend_position = attachment_info.vertex_blend_position;
          var position = new spine.Vector();
          for (var vertex_index = 0, index = 0, ffd_index = 0; vertex_index < attachment_info.vertex_count; ++vertex_index) {
            var blender_count = attachment.vertices[index++];
            var blend_position_x = 0;
            var blend_position_y = 0;
            for (var blender_index = 0; blender_index < blender_count; ++blender_index) {
              var bone_index = attachment.vertices[index++];
              position.x = attachment.vertices[index++];
              position.y = attachment.vertices[index++];
              var weight = attachment.vertices[index++];
              var bone_key = spine_pose.bone_keys[bone_index];
              var bone = spine_pose.bones[bone_key];
              var v0 = ffd_keyframe0.vertices[ffd_index - ffd_keyframe0.offset] || 0;
              var v1 = ffd_keyframe1.vertices[ffd_index - ffd_keyframe1.offset] || 0;
              position.x += spine.tween(v0, v1, pct);
              ++ffd_index;
              var v0 = ffd_keyframe0.vertices[ffd_index - ffd_keyframe0.offset] || 0;
              var v1 = ffd_keyframe1.vertices[ffd_index - ffd_keyframe1.offset] || 0;
              position.y += spine.tween(v0, v1, pct);
              ++ffd_index;
              spine.Space.transform(bone.world_space, position, position);
              blend_position_x += position.x * weight;
              blend_position_y += position.y * weight;
            }
            var vertex_position_offset = vertex_index * 2;
            vertex_blend_position[vertex_position_offset++] = blend_position_x;
            vertex_blend_position[vertex_position_offset++] = blend_position_y;
          }
        } else {
          // no ffd

          var vertex_blend_position = attachment_info.vertex_blend_position;
          var position = new spine.Vector();
          for (var vertex_index = 0, index = 0; vertex_index < attachment_info.vertex_count; ++vertex_index) {
            var blender_count = attachment.vertices[index++];
            var blend_position_x = 0;
            var blend_position_y = 0;
            for (var blender_index = 0; blender_index < blender_count; ++blender_index) {
              var bone_index = attachment.vertices[index++];
              position.x = attachment.vertices[index++];
              position.y = attachment.vertices[index++];
              var weight = attachment.vertices[index++];
              var bone_key = spine_pose.bone_keys[bone_index];
              var bone = spine_pose.bones[bone_key];
              spine.Space.transform(bone.world_space, position, position);
              blend_position_x += position.x * weight;
              blend_position_y += position.y * weight;
            }
            var vertex_position_offset = vertex_index * 2;
            vertex_blend_position[vertex_position_offset++] = blend_position_x;
            vertex_blend_position[vertex_position_offset++] = blend_position_y;
          }
        }
        break;
    }
  });
}

/**
 * @return {void}
 * @param {spine.Pose} spine_pose
 * @param {atlas.Data} atlas_data
 */
RenderCtx2D.prototype.drawPose = function(spine_pose, atlas_data) {
  var render = this;
  var ctx = render.ctx;

  render.updatePose(spine_pose, atlas_data);

  spine_pose.iterateAttachments(function(slot_key, slot, skin_slot, attachment_key, attachment) {
    if (!attachment) {
      return;
    }
    if (attachment.type === 'boundingbox') {
      return;
    }

    var site = atlas_data && atlas_data.sites[attachment_key];
    var page = site && site.page;
    var image_key = (page && page.name) || attachment_key;
    var image = render.images[image_key];

    if (!image || !image.complete) {
      return;
    }

    ctx.save();

    // TODO: slot.color.rgb
    ctx.globalAlpha *= slot.color.a;

    switch (slot.blend) {
      default:
        case 'normal':
        ctx.globalCompositeOperation = 'source-over';
      break;
      case 'additive':
          ctx.globalCompositeOperation = 'lighter';
        break;
      case 'multiply':
          ctx.globalCompositeOperation = 'multiply';
        break;
      case 'screen':
          ctx.globalCompositeOperation = 'screen';
        break;
    }

    switch (attachment.type) {
      case 'region':
        var bone = spine_pose.bones[slot.bone_key];
        ctxApplySpace(ctx, bone.world_space);
        ctxApplySpace(ctx, attachment.local_space);
        ctxApplyAtlasSitePosition(ctx, site);
        ctx.scale(attachment.width / 2, attachment.height / 2);
        ctxDrawImageMesh(ctx, render.region_vertex_triangle, render.region_vertex_position, render.region_vertex_texcoord, image, site, page);
        break;
      case 'mesh':
        var skin_info = render.skin_info_map[spine_pose.skin_key],
          default_skin_info = render.skin_info_map['default'];
        var slot_info = skin_info.slot_info_map[slot_key] || default_skin_info.slot_info_map[slot_key];
        var attachment_info = slot_info.attachment_info_map[attachment_key];
        var bone = spine_pose.bones[slot.bone_key];
        ctxApplySpace(ctx, bone.world_space);
        ctxApplyAtlasSitePosition(ctx, site);
        ctxDrawImageMesh(ctx, attachment_info.vertex_triangle, attachment_info.vertex_position, attachment_info.vertex_texcoord, image, site, page);
        break;
      case 'weightedmesh':
        var skin_info = render.skin_info_map[spine_pose.skin_key],
          default_skin_info = render.skin_info_map['default'];
        var slot_info = skin_info.slot_info_map[slot_key] || default_skin_info.slot_info_map[slot_key];
        var attachment_info = slot_info.attachment_info_map[attachment_key];
        ctxApplyAtlasSitePosition(ctx, site);
        ctxDrawImageMesh(ctx, attachment_info.vertex_triangle, attachment_info.vertex_blend_position, attachment_info.vertex_texcoord, image, site, page);
        break;
    }

    ctx.restore();
  });
}

/**
 * @return {void}
 * @param {spine.Pose} spine_pose
 * @param {atlas.Data} atlas_data
 */
RenderCtx2D.prototype.drawDebugPose = function(spine_pose, atlas_data) {
  var render = this;
  var ctx = render.ctx;

  render.updatePose(spine_pose, atlas_data);

  spine_pose.iterateAttachments(function(slot_key, slot, skin_slot, attachment_key, attachment) {
    if (!attachment) {
      return;
    }

    var site = atlas_data && atlas_data.sites[attachment_key];

    ctx.save();

    switch (attachment.type) {
      case 'region':
        var bone = spine_pose.bones[slot.bone_key];
        ctxApplySpace(ctx, bone.world_space);
        ctxApplySpace(ctx, attachment.local_space);
        ctxApplyAtlasSitePosition(ctx, site);
        ctx.beginPath();
        ctx.rect(-attachment.width / 2, -attachment.height / 2, attachment.width, attachment.height);
        ctx.fillStyle = 'rgba(127,127,127,0.25)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(127,127,127,1.0)';
        ctx.stroke();
        break;
      case 'boundingbox':
        var bone = spine_pose.bones[slot.bone_key];
        ctxApplySpace(ctx, bone.world_space);
        ctx.beginPath();
        var x = 0;
        attachment.vertices.forEach(function(value, index) {
          if (index & 1) {
            ctx.lineTo(x, value);
          } else {
            x = value;
          }
        });
        ctx.closePath();
        ctx.strokeStyle = 'yellow';
        ctx.stroke();
        break;
      case 'mesh':
        var skin_info = render.skin_info_map[spine_pose.skin_key],
          default_skin_info = render.skin_info_map['default'];
        var slot_info = skin_info.slot_info_map[slot_key] || default_skin_info.slot_info_map[slot_key];
        var attachment_info = slot_info.attachment_info_map[attachment_key];
        var bone = spine_pose.bones[slot.bone_key];
        ctxApplySpace(ctx, bone.world_space);
        ctxApplyAtlasSitePosition(ctx, site);
        ctxDrawMesh(ctx, attachment_info.vertex_triangle, attachment_info.vertex_position, 'rgba(127,127,127,1.0)', 'rgba(127,127,127,0.25)');
        break;
      case 'weightedmesh':
        var skin_info = render.skin_info_map[spine_pose.skin_key],
          default_skin_info = render.skin_info_map['default'];
        var slot_info = skin_info.slot_info_map[slot_key] || default_skin_info.slot_info_map[slot_key];
        var attachment_info = slot_info.attachment_info_map[attachment_key];
        ctxApplyAtlasSitePosition(ctx, site);
        ctxDrawMesh(ctx, attachment_info.vertex_triangle, attachment_info.vertex_blend_position, 'rgba(127,127,127,1.0)', 'rgba(127,127,127,0.25)');
        break;
    }

    ctx.restore();
  });

  spine_pose.iterateBones(function(bone_key, bone) {
    ctx.save();
    ctxApplySpace(ctx, bone.world_space);
    ctxDrawPoint(ctx);
    ctx.restore();
  });

  ctxDrawIkConstraints(ctx, spine_pose.data, spine_pose.bones);
}

/**
 * @return {void}
 * @param {spine.Pose} spine_pose
 * @param {atlas.Data} atlas_data
 */
RenderCtx2D.prototype.drawDebugData = function(spine_pose, atlas_data) {
  var render = this;
  var ctx = render.ctx;

  spine_pose.data.iterateAttachments(spine_pose.skin_key, function(slot_key, slot, skin_slot, attachment_key, attachment) {
    if (!attachment) {
      return;
    }

    var site = atlas_data && atlas_data.sites[attachment_key];

    ctx.save();

    switch (attachment.type) {
      case 'region':
        var bone = spine_pose.data.bones[slot.bone_key];
        ctxApplySpace(ctx, bone.world_space);
        ctxApplySpace(ctx, attachment.local_space);
        ctxApplyAtlasSitePosition(ctx, site);
        ctx.beginPath();
        ctx.rect(-attachment.width / 2, -attachment.height / 2, attachment.width, attachment.height);
        ctx.fillStyle = 'rgba(127,127,127,0.25)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(127,127,127,1.0)';
        ctx.stroke();
        break;
      case 'boundingbox':
        var bone = spine_pose.data.bones[slot.bone_key];
        ctxApplySpace(ctx, bone.world_space);
        ctx.beginPath();
        var x = 0;
        attachment.vertices.forEach(function(value, index) {
          if (index & 1) {
            ctx.lineTo(x, value);
          } else {
            x = value;
          }
        });
        ctx.closePath();
        ctx.strokeStyle = 'yellow';
        ctx.stroke();
        break;
      case 'mesh':
        var skin_info = render.skin_info_map[spine_pose.skin_key],
          default_skin_info = render.skin_info_map['default'];
        var slot_info = skin_info.slot_info_map[slot_key] || default_skin_info.slot_info_map[slot_key];
        var attachment_info = slot_info.attachment_info_map[attachment_key];
        var bone = spine_pose.data.bones[slot.bone_key];
        ctxApplySpace(ctx, bone.world_space);
        ctxApplyAtlasSitePosition(ctx, site);
        ctxDrawMesh(ctx, attachment_info.vertex_triangle, attachment_info.vertex_position, 'rgba(127,127,127,1.0)', 'rgba(127,127,127,0.25)');
        break;
      case 'weightedmesh':
        var skin_info = render.skin_info_map[spine_pose.skin_key],
          default_skin_info = render.skin_info_map['default'];
        var slot_info = skin_info.slot_info_map[slot_key] || default_skin_info.slot_info_map[slot_key];
        var attachment_info = slot_info.attachment_info_map[attachment_key];
        ctxApplyAtlasSitePosition(ctx, site);
        ctxDrawMesh(ctx, attachment_info.vertex_triangle, attachment_info.vertex_setup_position, 'rgba(127,127,127,1.0)', 'rgba(127,127,127,0.25)');
        break;
    }

    ctx.restore();
  });

  spine_pose.data.iterateBones(function(bone_key, bone) {
    ctx.save();
    ctxApplySpace(ctx, bone.world_space);
    ctxDrawPoint(ctx);
    ctx.restore();
  });

  ctxDrawIkConstraints(ctx, spine_pose.data, spine_pose.data.bones);
}

function ctxApplySpace(ctx, space) {
  if (space) {
    ctx.translate(space.position.x, space.position.y);
    ctx.rotate(space.rotation.rad);
    ctx.scale(space.scale.x, space.scale.y);
  }
}

function ctxApplyAtlasSitePosition(ctx, site) {
  if (site) {
    ctx.scale(1 / site.original_w, 1 / site.original_h);
    ctx.translate(2 * site.offset_x - (site.original_w - site.w), (site.original_h - site.h) - 2 * site.offset_y);
    ctx.scale(site.w, site.h);
  }
}

function ctxDrawCircle(ctx, color, scale) {
  scale = scale || 1;
  ctx.beginPath();
  ctx.arc(0, 0, 12 * scale, 0, 2 * Math.PI, false);
  ctx.strokeStyle = color || 'grey';
  ctx.stroke();
}

function ctxDrawPoint(ctx, color, scale) {
  scale = scale || 1;
  ctx.beginPath();
  ctx.arc(0, 0, 12 * scale, 0, 2 * Math.PI, false);
  ctx.strokeStyle = color || 'blue';
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(24 * scale, 0);
  ctx.strokeStyle = 'red';
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, 24 * scale);
  ctx.strokeStyle = 'green';
  ctx.stroke();
}

function ctxDrawMesh(ctx, triangles, positions, stroke_style, fill_style) {
  ctx.beginPath();
  for (var index = 0; index < triangles.length;) {
    var triangle = triangles[index++] * 2;
    var x0 = positions[triangle],
      y0 = positions[triangle + 1];
    var triangle = triangles[index++] * 2;
    var x1 = positions[triangle],
      y1 = positions[triangle + 1];
    var triangle = triangles[index++] * 2;
    var x2 = positions[triangle],
      y2 = positions[triangle + 1];
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x0, y0);
  }
  if (fill_style) {
    ctx.fillStyle = fill_style;
    ctx.fill();
  }
  ctx.strokeStyle = stroke_style || 'grey';
  ctx.stroke();
}

function ctxDrawImageMesh(ctx, triangles, positions, texcoords, image, site, page) {
  var site_texmatrix = new Float32Array(9);
  var site_texcoord = new Float32Array(2);
  mat3x3Identity(site_texmatrix);
  mat3x3Scale(site_texmatrix, image.width, image.height);
  mat3x3ApplyAtlasPageTexcoord(site_texmatrix, page);
  mat3x3ApplyAtlasSiteTexcoord(site_texmatrix, site);

  /// http://www.irrlicht3d.org/pivot/entry.php?id=1329
  for (var index = 0; index < triangles.length;) {
    var triangle = triangles[index++] * 2;
    var position = positions.subarray(triangle, triangle + 2);
    var x0 = position[0],
      y0 = position[1];
    var texcoord = mat3x3Transform(site_texmatrix, texcoords.subarray(triangle, triangle + 2), site_texcoord);
    var u0 = texcoord[0],
      v0 = texcoord[1];

    var triangle = triangles[index++] * 2;
    var position = positions.subarray(triangle, triangle + 2);
    var x1 = position[0],
      y1 = position[1];
    var texcoord = mat3x3Transform(site_texmatrix, texcoords.subarray(triangle, triangle + 2), site_texcoord);
    var u1 = texcoord[0],
      v1 = texcoord[1];

    var triangle = triangles[index++] * 2;
    var position = positions.subarray(triangle, triangle + 2);
    var x2 = position[0],
      y2 = position[1];
    var texcoord = mat3x3Transform(site_texmatrix, texcoords.subarray(triangle, triangle + 2), site_texcoord);
    var u2 = texcoord[0],
      v2 = texcoord[1];

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.closePath();
    ctx.clip();
    x1 -= x0;
    y1 -= y0;
    x2 -= x0;
    y2 -= y0;
    u1 -= u0;
    v1 -= v0;
    u2 -= u0;
    v2 -= v0;
    var id = 1 / (u1 * v2 - u2 * v1);
    var a = id * (v2 * x1 - v1 * x2);
    var b = id * (v2 * y1 - v1 * y2);
    var c = id * (u1 * x2 - u2 * x1);
    var d = id * (u1 * y2 - u2 * y1);
    var e = x0 - (a * u0 + c * v0);
    var f = y0 - (b * u0 + d * v0);
    ctx.transform(a, b, c, d, e, f);
    ctx.drawImage(image, 0, 0);
    ctx.restore();
  }
}

function ctxDrawIkConstraints(ctx, data, bones) {
  data.ikc_keys.forEach(function(ikc_key) {
    var ikc = data.ikcs[ikc_key];
    var target = bones[ikc.target_key];
    switch (ikc.bone_keys.length) {
      case 1:
        var bone = bones[ikc.bone_keys[0]];

        ctx.beginPath();
        ctx.moveTo(target.world_space.position.x, target.world_space.position.y);
        ctx.lineTo(bone.world_space.position.x, bone.world_space.position.y);
        ctx.strokeStyle = 'yellow';
        ctx.stroke();

        ctx.save();
        ctxApplySpace(ctx, target.world_space);
        ctxDrawCircle(ctx, 'yellow', 1.5);
        ctx.restore();

        ctx.save();
        ctxApplySpace(ctx, bone.world_space);
        ctxDrawCircle(ctx, 'yellow', 0.5);
        ctx.restore();
        break;
      case 2:
        var parent = bones[ikc.bone_keys[0]];
        var child = bones[ikc.bone_keys[1]];

        ctx.beginPath();
        ctx.moveTo(target.world_space.position.x, target.world_space.position.y);
        ctx.lineTo(child.world_space.position.x, child.world_space.position.y);
        ctx.lineTo(parent.world_space.position.x, parent.world_space.position.y);
        ctx.strokeStyle = 'yellow';
        ctx.stroke();

        ctx.save();
        ctxApplySpace(ctx, target.world_space);
        ctxDrawCircle(ctx, 'yellow', 1.5);
        ctx.restore();

        ctx.save();
        ctxApplySpace(ctx, child.world_space);
        ctxDrawCircle(ctx, 'yellow', 0.75);
        ctx.restore();

        ctx.save();
        ctxApplySpace(ctx, parent.world_space);
        ctxDrawCircle(ctx, 'yellow', 0.5);
        ctx.restore();
        break;
    }
  });
}
goog.provide('RenderWebGL');

/**
 * @constructor
 * @param {WebGLRenderingContext} gl
 */
RenderWebGL = function(gl) {
  var render = this;
  render.gl = gl;
  if (!gl) {
    return;
  }
  render.bone_info_map = {};
  render.skin_info_map = {};
  render.gl_textures = {};
  render.gl_projection = mat4x4Identity(new Float32Array(16));
  render.gl_modelview = mat3x3Identity(new Float32Array(9));
  render.gl_tex_matrix = mat3x3Identity(new Float32Array(9));
  render.gl_color = vec4Identity(new Float32Array(4));
  var gl_mesh_shader_vs_src = [
    "precision mediump int;",
    "precision mediump float;",
    "uniform mat4 uProjection;",
    "uniform mat3 uModelview;",
    "uniform mat3 uTexMatrix;",
    "attribute vec2 aVertexPosition;", // [ x, y ]
    "attribute vec2 aVertexTexCoord;", // [ u, v ]
    "varying vec3 vTexCoord;",
    "void main(void) {",
    " vTexCoord = uTexMatrix * vec3(aVertexTexCoord, 1.0);",
    " gl_Position = uProjection * vec4(uModelview * vec3(aVertexPosition, 1.0), 1.0);",
    "}"
  ];
  var gl_ffd_mesh_shader_vs_src = [
    "precision mediump int;",
    "precision mediump float;",
    "uniform mat4 uProjection;",
    "uniform mat3 uModelview;",
    "uniform mat3 uTexMatrix;",
    "uniform float uMorphWeight;",
    "attribute vec2 aVertexPosition;", // [ x, y ]
    "attribute vec2 aVertexTexCoord;", // [ u, v ]
    "attribute vec2 aVertexMorph0Position;", // [ dx, dy ]
    "attribute vec2 aVertexMorph1Position;", // [ dx, dy ]
    "varying vec3 vTexCoord;",
    "void main(void) {",
    " vTexCoord = uTexMatrix * vec3(aVertexTexCoord, 1.0);",
    " gl_Position = uProjection * vec4(uModelview * vec3(aVertexPosition + mix(aVertexMorph0Position, aVertexMorph1Position, uMorphWeight), 1.0), 1.0);",
    "}"
  ];
  var gl_mesh_shader_fs_src = [
    "precision mediump int;",
    "precision mediump float;",
    "uniform sampler2D uSampler;",
    "uniform vec4 uColor;",
    "varying vec3 vTexCoord;",
    "void main(void) {",
    " gl_FragColor = uColor * texture2D(uSampler, vTexCoord.st);",
    "}"
  ];
  render.gl_mesh_shader = glMakeShader(gl, gl_mesh_shader_vs_src, gl_mesh_shader_fs_src);
  render.gl_ffd_mesh_shader = glMakeShader(gl, gl_ffd_mesh_shader_vs_src, gl_mesh_shader_fs_src);
  render.gl_region_vertex = {};
  render.gl_region_vertex.position = glMakeVertex(gl, new Float32Array([-1, -1, 1, -1, 1, 1, -1, 1]), 2, gl.ARRAY_BUFFER, gl.STATIC_DRAW); // [ x, y ]
  render.gl_region_vertex.texcoord = glMakeVertex(gl, new Float32Array([0, 1, 1, 1, 1, 0, 0, 0]), 2, gl.ARRAY_BUFFER, gl.STATIC_DRAW); // [ u, v ]
  render.gl_skin_shader_modelview_count = 16; // * mat3
  render.gl_skin_shader_modelview_array = new Float32Array(9 * render.gl_skin_shader_modelview_count);
  render.gl_skin_shader_blenders_count = 8; // * vec2
  function repeat(format, count) {
    var array = [];
    for (var index = 0; index < count; ++index) {
      array.push(format.replace(/{index}/g, index));
    }
    return array;
  }
  var gl_skin_shader_vs_src = [
    "precision mediump int;",
    "precision mediump float;",
    "uniform mat4 uProjection;",
    "uniform mat3 uModelviewArray[" + render.gl_skin_shader_modelview_count + "];",
    "uniform mat3 uTexMatrix;",
    "attribute vec2 aVertexPosition;", // [ x, y ]
    repeat("attribute vec2 aVertexBlenders{index};", render.gl_skin_shader_blenders_count), // [ i, w ]
    "attribute vec2 aVertexTexCoord;", // [ u, v ]
    "varying vec3 vTexCoord;",
    "void main(void) {",
    " vTexCoord = uTexMatrix * vec3(aVertexTexCoord, 1.0);",
    " vec3 position = vec3(aVertexPosition, 1.0);",
    " vec3 blendPosition = vec3(0.0);",
    repeat(" blendPosition += (uModelviewArray[int(aVertexBlenders{index}.x)] * position) * aVertexBlenders{index}.y;", render.gl_skin_shader_blenders_count),
    " gl_Position = uProjection * vec4(blendPosition, 1.0);",
    "}"
  ];
  var gl_ffd_skin_shader_vs_src = [
    "precision mediump int;",
    "precision mediump float;",
    "uniform mat4 uProjection;",
    "uniform mat3 uModelviewArray[" + render.gl_skin_shader_modelview_count + "];",
    "uniform mat3 uTexMatrix;",
    "uniform float uMorphWeight;",
    "attribute vec2 aVertexPosition;", // [ x, y ]
    repeat("attribute vec2 aVertexBlenders{index};", render.gl_skin_shader_blenders_count), // [ i, w ]
    "attribute vec2 aVertexTexCoord;", // [ u, v ]
    "attribute vec2 aVertexMorph0Position;", // [ dx, dy ]
    "attribute vec2 aVertexMorph1Position;", // [ dx, dy ]
    "varying vec3 vTexCoord;",
    "void main(void) {",
    " vTexCoord = uTexMatrix * vec3(aVertexTexCoord, 1.0);",
    " vec3 position = vec3(aVertexPosition + mix(aVertexMorph0Position, aVertexMorph1Position, uMorphWeight), 1.0);",
    " vec3 blendPosition = vec3(0.0);",
    repeat(" blendPosition += (uModelviewArray[int(aVertexBlenders{index}.x)] * position) * aVertexBlenders{index}.y;", render.gl_skin_shader_blenders_count),
    " gl_Position = uProjection * vec4(blendPosition, 1.0);",
    "}"
  ];
  var gl_skin_shader_fs_src = [
    "precision mediump int;",
    "precision mediump float;",
    "uniform sampler2D uSampler;",
    "uniform vec4 uColor;",
    "varying vec3 vTexCoord;",
    "void main(void) {",
    " gl_FragColor = uColor * texture2D(uSampler, vTexCoord.st);",
    "}"
  ];
  render.gl_skin_shader = glMakeShader(gl, gl_skin_shader_vs_src, gl_skin_shader_fs_src);
  render.gl_ffd_skin_shader = glMakeShader(gl, gl_ffd_skin_shader_vs_src, gl_skin_shader_fs_src);
}

/**
 * @return {void}
 * @param {spine.Data} spine_data
 * @param {atlas.Data} atlas_data
 */
RenderWebGL.prototype.dropData = function(spine_data, atlas_data) {
  var render = this;
  var gl = render.gl;
  if (!gl) {
    return;
  }

  Object.keys(render.gl_textures).forEach(function(image_key) {
    var gl_texture = render.gl_textures[image_key];
    gl.deleteTexture(gl_texture);
    gl_texture = null;
    delete render.gl_textures[image_key];
  });

  render.gl_textures = {};

  Object.keys(render.bone_info_map).forEach(function(bone_key) {
    var bone_info = render.bone_info_map[bone_key];
  });

  render.bone_info_map = {};

  Object.keys(render.skin_info_map).forEach(function(skin_key) {
    var skin_info = render.skin_info_map[skin_key];
    var slot_info_map = skin_info.slot_info_map;
    Object.keys(slot_info_map).forEach(function(slot_key) {
      var slot_info = slot_info_map[slot_key];
      var attachment_info_map = slot_info.attachment_info_map;
      Object.keys(attachment_info_map).forEach(function(attachment_key) {
        var attachment_info = attachment_info_map[attachment_key];

        switch (attachment_info.type) {
          case 'mesh':
            var gl_vertex = attachment_info.gl_vertex;
            gl.deleteBuffer(gl_vertex.position.buffer);
            gl.deleteBuffer(gl_vertex.texcoord.buffer);
            gl.deleteBuffer(gl_vertex.triangle.buffer);
            Object.keys(attachment_info.anim_ffd_attachments).forEach(function(anim_key) {
              var anim_ffd_attachment = attachment_info.anim_ffd_attachments[anim_key];
              anim_ffd_attachment.ffd_keyframes.forEach(function(ffd_keyframe) {
                gl.deleteBuffer(ffd_keyframe.gl_vertex.buffer);
              });
            });
            break;
          case 'weightedmesh':
            var gl_vertex = attachment_info.gl_vertex;
            gl.deleteBuffer(gl_vertex.position.buffer);
            gl.deleteBuffer(gl_vertex.blenders.buffer);
            gl.deleteBuffer(gl_vertex.texcoord.buffer);
            gl.deleteBuffer(gl_vertex.triangle.buffer);
            Object.keys(attachment_info.anim_ffd_attachments).forEach(function(anim_key) {
              var anim_ffd_attachment = attachment_info.anim_ffd_attachments[anim_key];
              anim_ffd_attachment.ffd_keyframes.forEach(function(ffd_keyframe) {
                gl.deleteBuffer(ffd_keyframe.gl_vertex.buffer);
              });
            });
            break;
          default:
            console.log("TODO", skin_key, slot_key, attachment_key, attachment_info.type);
            break;
        }
      });
    });
  });

  render.skin_info_map = {};
}

/**
 * @return {void}
 * @param {spine.Data} spine_data
 * @param {atlas.Data} atlas_data
 * @param {Object.<string,HTMLImageElement>} images
 */
RenderWebGL.prototype.loadData = function(spine_data, atlas_data, images) {
  var render = this;
  var gl = render.gl;
  if (!gl) {
    return;
  }

  spine_data.iterateBones(function(bone_key, bone) {
    var bone_info = render.bone_info_map[bone_key] = {};
    bone_info.setup_space = spine.Space.invert(bone.world_space, new spine.Space());
  });

  spine_data.iterateSkins(function(skin_key, skin) {
    var skin_info = render.skin_info_map[skin_key] = {};
    var slot_info_map = skin_info.slot_info_map = {};

    skin.iterateAttachments(function(slot_key, skin_slot, attachment_key, attachment) {
      if (!attachment) {
        return;
      }

      switch (attachment.type) {
        case 'mesh':
          var slot_info = slot_info_map[slot_key] = slot_info_map[slot_key] || {};
          var attachment_info_map = slot_info.attachment_info_map = slot_info.attachment_info_map || {};
          var attachment_info = attachment_info_map[attachment_key] = {};
          attachment_info.type = attachment.type;
          var vertex_count = attachment.vertices.length / 2;
          var vertex_position = new Float32Array(attachment.vertices);
          var vertex_texcoord = new Float32Array(attachment.uvs);
          var vertex_triangle = new Uint16Array(attachment.triangles);
          var gl_vertex = attachment_info.gl_vertex = {};
          gl_vertex.position = glMakeVertex(gl, vertex_position, 2, gl.ARRAY_BUFFER, gl.STATIC_DRAW);
          gl_vertex.texcoord = glMakeVertex(gl, vertex_texcoord, 2, gl.ARRAY_BUFFER, gl.STATIC_DRAW);
          gl_vertex.triangle = glMakeVertex(gl, vertex_triangle, 1, gl.ELEMENT_ARRAY_BUFFER, gl.STATIC_DRAW);
          var anim_ffd_attachments = attachment_info.anim_ffd_attachments = {};
          spine_data.iterateAnims(function(anim_key, anim) {
            var anim_ffd = anim.ffds && anim.ffds[skin_key];
            var ffd_slot = anim_ffd && anim_ffd.ffd_slots[slot_key];
            var ffd_attachment = ffd_slot && ffd_slot.ffd_attachments[attachment_key];
            if (ffd_attachment) {
              var anim_ffd_attachment = anim_ffd_attachments[anim_key] = {};
              var anim_ffd_keyframes = anim_ffd_attachment.ffd_keyframes = [];
              ffd_attachment.ffd_keyframes.forEach(function(ffd_keyframe, ffd_keyframe_index) {
                var anim_ffd_keyframe = anim_ffd_keyframes[ffd_keyframe_index] = {};
                var vertex = new Float32Array(2 * vertex_count);
                vertex.subarray(ffd_keyframe.offset, ffd_keyframe.offset + ffd_keyframe.vertices.length).set(new Float32Array(ffd_keyframe.vertices));
                anim_ffd_keyframe.gl_vertex = glMakeVertex(gl, vertex, 2, gl.ARRAY_BUFFER, gl.STATIC_DRAW);
              });
            }
          });
          break;
        case 'weightedmesh':
          var slot_info = slot_info_map[slot_key] = slot_info_map[slot_key] || {};
          var attachment_info_map = slot_info.attachment_info_map = slot_info.attachment_info_map || {};
          var attachment_info = attachment_info_map[attachment_key] = {};
          attachment_info.type = attachment.type;
          var vertex_count = attachment.uvs.length / 2;
          var vertex_position = new Float32Array(2 * vertex_count); // [ x, y ]
          var vertex_blenders = new Float32Array(2 * render.gl_skin_shader_blenders_count * vertex_count); // [ i, w ]
          var vertex_texcoord = new Float32Array(attachment.uvs);
          var vertex_triangle = new Uint16Array(attachment.triangles);
          var blend_bone_index_array = attachment_info.blend_bone_index_array = [];
          for (var vertex_index = 0, index = 0; vertex_index < vertex_count; ++vertex_index) {
            var blender_count = attachment.vertices[index++];
            var blender_array = [];
            for (var blender_index = 0; blender_index < blender_count; ++blender_index) {
              var bone_index = attachment.vertices[index++];
              var x = attachment.vertices[index++];
              var y = attachment.vertices[index++];
              var weight = attachment.vertices[index++];
              blender_array.push({
                position: new spine.Vector(x, y),
                bone_index: bone_index,
                weight: weight
              });
            }

            // sort the blender array descending by weight
            blender_array = blender_array.sort(function(a, b) {
              return b.weight - a.weight;
            });

            // clamp blender array and adjust weights
            if (blender_array.length > render.gl_skin_shader_blenders_count) {
              console.log("blend array length for", attachment_key, "is", blender_array.length, "so clamp to", render.gl_skin_shader_blenders_count);
              blender_array.length = render.gl_skin_shader_blenders_count;
              var weight_sum = 0;
              blender_array.forEach(function(blend) {
                weight_sum += blend.weight;
              });
              blender_array.forEach(function(blend) {
                blend.weight /= weight_sum;
              });
            }

            var position_x = 0;
            var position_y = 0;
            var blend_position = new spine.Vector();
            var vertex_blenders_offset = vertex_index * 2 * render.gl_skin_shader_blenders_count;
            blender_array.forEach(function(blend, index) {
              // keep track of which bones are used for blending
              if (blend_bone_index_array.indexOf(blend.bone_index) === -1) {
                blend_bone_index_array.push(blend.bone_index);
              }
              var bone_key = spine_data.bone_keys[blend.bone_index];
              var bone = spine_data.bones[bone_key];
              spine.Space.transform(bone.world_space, blend.position, blend_position);
              position_x += blend_position.x * blend.weight;
              position_y += blend_position.y * blend.weight;
              // index into gl_skin_shader_modelview_array, not spine_pose.data.bone_keys
              vertex_blenders[vertex_blenders_offset++] = blend_bone_index_array.indexOf(blend.bone_index);
              vertex_blenders[vertex_blenders_offset++] = blend.weight;
            });
            var vertex_position_offset = vertex_index * 2;
            vertex_position[vertex_position_offset++] = position_x;
            vertex_position[vertex_position_offset++] = position_y;

            if (blend_bone_index_array.length > render.gl_skin_shader_modelview_count) {
              console.log("blend bone index array length for", attachmentPkey, "is", blend_bone_index_array.length, "greater than", render.gl_skin_shader_modelview_count);
            }
          }
          var gl_vertex = attachment_info.gl_vertex = {};
          gl_vertex.position = glMakeVertex(gl, vertex_position, 2, gl.ARRAY_BUFFER, gl.STATIC_DRAW);
          gl_vertex.blenders = glMakeVertex(gl, vertex_blenders, 2, gl.ARRAY_BUFFER, gl.STATIC_DRAW);
          gl_vertex.texcoord = glMakeVertex(gl, vertex_texcoord, 2, gl.ARRAY_BUFFER, gl.STATIC_DRAW);
          gl_vertex.triangle = glMakeVertex(gl, vertex_triangle, 1, gl.ELEMENT_ARRAY_BUFFER, gl.STATIC_DRAW);
          var anim_ffd_attachments = attachment_info.anim_ffd_attachments = {};
          spine_data.iterateAnims(function(anim_key, anim) {
            var anim_ffd = anim.ffds && anim.ffds[skin_key];
            var ffd_slot = anim_ffd && anim_ffd.ffd_slots[slot_key];
            var ffd_attachment = ffd_slot && ffd_slot.ffd_attachments[attachment_key];
            if (ffd_attachment) {
              var anim_ffd_attachment = anim_ffd_attachments[anim_key] = {};
              var anim_ffd_keyframes = anim_ffd_attachment.ffd_keyframes = [];
              ffd_attachment.ffd_keyframes.forEach(function(ffd_keyframe, ffd_keyframe_index) {
                var anim_ffd_keyframe = anim_ffd_keyframes[ffd_keyframe_index] = {};
                var vertex = new Float32Array(2 * vertex_count);
                for (var vertex_index = 0, index = 0, ffd_index = 0; vertex_index < vertex_count; ++vertex_index) {
                  var blender_count = attachment.vertices[index++];
                  var vertex_x = 0;
                  var vertex_y = 0;
                  for (var blender_index = 0; blender_index < blender_count; ++blender_index) {
                    var bone_index = attachment.vertices[index++];
                    var x = attachment.vertices[index++];
                    var y = attachment.vertices[index++];
                    var weight = attachment.vertices[index++];
                    var morph_position_x = ffd_keyframe.vertices[ffd_index - ffd_keyframe.offset] || 0;
                    ++ffd_index;
                    var morph_position_y = ffd_keyframe.vertices[ffd_index - ffd_keyframe.offset] || 0;
                    ++ffd_index;
                    vertex_x += morph_position_x * weight;
                    vertex_y += morph_position_y * weight;
                  }
                  var vertex_offset = vertex_index * 2;
                  vertex[vertex_offset++] = vertex_x;
                  vertex[vertex_offset++] = vertex_y;
                }
                anim_ffd_keyframe.gl_vertex = glMakeVertex(gl, vertex, 2, gl.ARRAY_BUFFER, gl.STATIC_DRAW);
              });
            }
          });
          break;
      }
    });
  });

  if (atlas_data) {
    // load atlas page images
    atlas_data.pages.forEach(function(page) {
      if (page.format !== 'RGBA8888') {
        throw new Error(page.format);
      }

      var gl_min_filter = gl.NONE;
      switch (page.min_filter) {
        case 'Nearest':
          gl_min_filter = gl.NEAREST;
          break;
        default:
        case 'Linear':
          gl_min_filter = gl.LINEAR;
          break;
        case 'MipMapNearestNearest':
          gl_min_filter = gl.NEAREST_MIPMAP_NEAREST;
          break;
        case 'MipMapLinearNearest':
          gl_min_filter = gl.LINEAR_MIPMAP_NEAREST;
          break;
        case 'MipMapNearestLinear':
          gl_min_filter = gl.NEAREST_MIPMAP_LINEAR;
          break;
        case 'MipMapLinearLinear':
          gl_min_filter = gl.LINEAR_MIPMAP_LINEAR;
          break;
      }

      var gl_mag_filter = gl.NONE;
      switch (page.mag_filter) {
        case 'Nearest':
          gl_mag_filter = gl.NEAREST;
          break;
        default:
        case 'Linear':
          gl_mag_filter = gl.LINEAR;
          break;
      }

      var gl_wrap_s = gl.NONE;
      switch (page.wrap_s) {
        case 'Repeat':
          gl_wrap_s = gl.REPEAT;
          break;
        default:
        case 'ClampToEdge':
          gl_wrap_s = gl.CLAMP_TO_EDGE;
          break;
        case 'MirroredRepeat':
          gl_wrap_s = gl.MIRRORED_REPEAT;
          break;
      }

      var gl_wrap_t = gl.NONE;
      switch (page.wrap_t) {
        case 'Repeat':
          gl_wrap_t = gl.REPEAT;
          break;
        default:
        case 'ClampToEdge':
          gl_wrap_t = gl.CLAMP_TO_EDGE;
          break;
        case 'MirroredRepeat':
          gl_wrap_t = gl.MIRRORED_REPEAT;
          break;
      }

      var image_key = page.name;
      var image = images[image_key];
      var gl_texture = render.gl_textures[image_key] = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, gl_texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl_min_filter);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl_mag_filter);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl_wrap_s);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl_wrap_t);
    });
  } else {
    // load attachment images
    spine_data.iterateSkins(function(skin_key, skin) {
      skin.iterateAttachments(function(slot_key, skin_slot, attachment_key, attachment) {
        if (!attachment) {
          return;
        }

        switch (attachment.type) {
          case 'region':
          case 'mesh':
          case 'weightedmesh':
            var image_key = attachment_key;
            var image = images[image_key];
            var gl_texture = render.gl_textures[image_key] = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, gl_texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            break;
        }
      });
    });
  }
}

/**
 * @return {void}
 * @param {spine.Pose} spine_pose
 * @param {atlas.Data} atlas_data
 */
RenderWebGL.prototype.drawPose = function(spine_pose, atlas_data) {
  var render = this;
  var gl = render.gl;
  if (!gl) {
    return;
  }

  var gl_projection = render.gl_projection;
  var gl_modelview = render.gl_modelview;
  var gl_tex_matrix = render.gl_tex_matrix;
  var gl_color = render.gl_color;

  var alpha = gl_color[3];

  spine_pose.iterateAttachments(function(slot_key, slot, skin_slot, attachment_key, attachment) {
    if (!attachment) {
      return;
    }
    if (attachment.type === 'boundingbox') {
      return;
    }

    var site = atlas_data && atlas_data.sites[attachment_key];
    var page = site && site.page;
    var image_key = (page && page.name) || attachment_key;
    var gl_texture = render.gl_textures[image_key];

    if (!gl_texture) {
      return;
    }

    mat3x3Identity(gl_modelview);
    mat3x3Identity(gl_tex_matrix);
    mat3x3ApplyAtlasPageTexcoord(gl_tex_matrix, page);
    mat3x3ApplyAtlasSiteTexcoord(gl_tex_matrix, site);

    vec4CopyColor(gl_color, slot.color);
    gl_color[3] *= alpha;

    gl.enable(gl.BLEND);
    switch (slot.blend) {
      default:
        case 'normal':
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      break;
      case 'additive':
          gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
        break;
      case 'multiply':
          gl.blendFunc(gl.DST_COLOR, gl.ONE_MINUS_SRC_ALPHA);
        break;
      case 'screen':
          gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_COLOR);
        break;
    }

    switch (attachment.type) {
      case 'region':
        var bone = spine_pose.bones[slot.bone_key];
        mat3x3ApplySpace(gl_modelview, bone.world_space);
        mat3x3ApplySpace(gl_modelview, attachment.local_space);
        mat3x3Scale(gl_modelview, attachment.width / 2, attachment.height / 2);
        mat3x3ApplyAtlasSitePosition(gl_modelview, site);

        var gl_shader = render.gl_mesh_shader;
        var gl_vertex = render.gl_region_vertex;

        gl.useProgram(gl_shader.program);

        gl.uniformMatrix4fv(gl_shader.uniforms['uProjection'], false, gl_projection);
        gl.uniformMatrix3fv(gl_shader.uniforms['uModelview'], false, gl_modelview);
        gl.uniformMatrix3fv(gl_shader.uniforms['uTexMatrix'], false, gl_tex_matrix);
        gl.uniform4fv(gl_shader.uniforms['uColor'], gl_color);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, gl_texture);
        gl.uniform1i(gl_shader.uniforms['uSampler'], 0);

        glSetupAttribute(gl, gl_shader, 'aVertexPosition', gl_vertex.position);
        glSetupAttribute(gl, gl_shader, 'aVertexTexCoord', gl_vertex.texcoord);

        gl.drawArrays(gl.TRIANGLE_FAN, 0, gl_vertex.position.count);

        glResetAttribute(gl, gl_shader, 'aVertexPosition', gl_vertex.position);
        glResetAttribute(gl, gl_shader, 'aVertexTexCoord', gl_vertex.texcoord);

        gl.bindTexture(gl.TEXTURE_2D, null);

        gl.useProgram(null);
        break;
      case 'mesh':
        var skin_info = render.skin_info_map[spine_pose.skin_key],
          default_skin_info = render.skin_info_map['default'];
        var slot_info = skin_info.slot_info_map[slot_key] || default_skin_info.slot_info_map[slot_key];
        var attachment_info = slot_info.attachment_info_map[attachment_key];
        var bone = spine_pose.bones[slot.bone_key];
        mat3x3ApplySpace(gl_modelview, bone.world_space);
        mat3x3ApplyAtlasSitePosition(gl_modelview, site);

        var anim = spine_pose.data.anims[spine_pose.anim_key];
        var anim_ffd = anim && anim.ffds && anim.ffds[spine_pose.skin_key];
        var ffd_slot = anim_ffd && anim_ffd.ffd_slots[slot_key];
        var ffd_attachment = ffd_slot && ffd_slot.ffd_attachments[attachment_key];
        var ffd_keyframes = ffd_attachment && ffd_attachment.ffd_keyframes;
        var ffd_keyframe0_index = spine.Keyframe.find(ffd_keyframes, spine_pose.time);
        if (ffd_keyframe0_index !== -1) {
          // ffd

          var pct = 0;
          var ffd_keyframe0 = ffd_keyframes[ffd_keyframe0_index];
          var ffd_keyframe1_index = ffd_keyframe0_index + 1;
          var ffd_keyframe1 = ffd_keyframes[ffd_keyframe1_index];
          if (ffd_keyframe1) {
            pct = ffd_keyframe0.curve.evaluate((spine_pose.time - ffd_keyframe0.time) / (ffd_keyframe1.time - ffd_keyframe0.time));
          } else {
            ffd_keyframe1_index = ffd_keyframe0_index;
            ffd_keyframe1 = ffd_keyframes[ffd_keyframe1_index];
          }

          var anim_ffd_attachment = attachment_info.anim_ffd_attachments[spine_pose.anim_key];
          var anim_ffd_keyframe0 = anim_ffd_attachment.ffd_keyframes[ffd_keyframe0_index];
          var anim_ffd_keyframe1 = anim_ffd_attachment.ffd_keyframes[ffd_keyframe1_index];

          var gl_shader = render.gl_ffd_mesh_shader;
          var gl_vertex = attachment_info.gl_vertex;

          gl.useProgram(gl_shader.program);

          gl.uniformMatrix4fv(gl_shader.uniforms['uProjection'], false, gl_projection);
          gl.uniformMatrix3fv(gl_shader.uniforms['uModelview'], false, gl_modelview);
          gl.uniformMatrix3fv(gl_shader.uniforms['uTexMatrix'], false, gl_tex_matrix);
          gl.uniform4fv(gl_shader.uniforms['uColor'], gl_color);
          gl.uniform1f(gl_shader.uniforms['uMorphWeight'], pct);

          gl.activeTexture(gl.TEXTURE0);
          gl.bindTexture(gl.TEXTURE_2D, gl_texture);
          gl.uniform1i(gl_shader.uniforms['uSampler'], 0);

          glSetupAttribute(gl, gl_shader, 'aVertexPosition', gl_vertex.position);
          glSetupAttribute(gl, gl_shader, 'aVertexMorph0Position', anim_ffd_keyframe0.gl_vertex);
          glSetupAttribute(gl, gl_shader, 'aVertexMorph1Position', anim_ffd_keyframe1.gl_vertex);
          glSetupAttribute(gl, gl_shader, 'aVertexTexCoord', gl_vertex.texcoord);

          gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl_vertex.triangle.buffer);
          gl.drawElements(gl.TRIANGLES, gl_vertex.triangle.count, gl_vertex.triangle.type, 0);
          gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

          glResetAttribute(gl, gl_shader, 'aVertexPosition', gl_vertex.position);
          glResetAttribute(gl, gl_shader, 'aVertexMorph0Position', anim_ffd_keyframe0.gl_vertex);
          glResetAttribute(gl, gl_shader, 'aVertexMorph1Position', anim_ffd_keyframe1.gl_vertex);
          glResetAttribute(gl, gl_shader, 'aVertexTexCoord', gl_vertex.texcoord);

          gl.bindTexture(gl.TEXTURE_2D, null);

          gl.useProgram(null);
        } else {
          // no ffd

          var gl_shader = render.gl_mesh_shader;
          var gl_vertex = attachment_info.gl_vertex;

          gl.useProgram(gl_shader.program);

          gl.uniformMatrix4fv(gl_shader.uniforms['uProjection'], false, gl_projection);
          gl.uniformMatrix3fv(gl_shader.uniforms['uModelview'], false, gl_modelview);
          gl.uniformMatrix3fv(gl_shader.uniforms['uTexMatrix'], false, gl_tex_matrix);
          gl.uniform4fv(gl_shader.uniforms['uColor'], gl_color);

          gl.activeTexture(gl.TEXTURE0);
          gl.bindTexture(gl.TEXTURE_2D, gl_texture);
          gl.uniform1i(gl_shader.uniforms['uSampler'], 0);

          glSetupAttribute(gl, gl_shader, 'aVertexPosition', gl_vertex.position);
          glSetupAttribute(gl, gl_shader, 'aVertexTexCoord', gl_vertex.texcoord);

          gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl_vertex.triangle.buffer);
          gl.drawElements(gl.TRIANGLES, gl_vertex.triangle.count, gl_vertex.triangle.type, 0);
          gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

          glResetAttribute(gl, gl_shader, 'aVertexPosition', gl_vertex.position);
          glResetAttribute(gl, gl_shader, 'aVertexTexCoord', gl_vertex.texcoord);

          gl.bindTexture(gl.TEXTURE_2D, null);

          gl.useProgram(null);
        }
        break;
      case 'weightedmesh':
        var skin_info = render.skin_info_map[spine_pose.skin_key],
          default_skin_info = render.skin_info_map['default'];
        var slot_info = skin_info.slot_info_map[slot_key] || default_skin_info.slot_info_map[slot_key];
        var attachment_info = slot_info.attachment_info_map[attachment_key];
        // update skin shader modelview array
        var blend_bone_index_array = attachment_info.blend_bone_index_array;
        for (var index = 0; index < blend_bone_index_array.length; ++index) {
          var bone_index = blend_bone_index_array[index];
          var bone_key = spine_pose.bone_keys[bone_index];
          var bone = spine_pose.bones[bone_key];
          var bone_info = render.bone_info_map[bone_key];
          if (index < render.gl_skin_shader_modelview_count) {
            var modelview = render.gl_skin_shader_modelview_array.subarray(index * 9, (index + 1) * 9);
            mat3x3Copy(modelview, gl_modelview);
            mat3x3ApplySpace(modelview, bone.world_space);
            mat3x3ApplySpace(modelview, bone_info.setup_space);
            mat3x3ApplyAtlasSitePosition(modelview, site);
          }
        }

        var anim = spine_pose.data.anims[spine_pose.anim_key];
        var anim_ffd = anim && anim.ffds && anim.ffds[spine_pose.skin_key];
        var ffd_slot = anim_ffd && anim_ffd.ffd_slots[slot_key];
        var ffd_attachment = ffd_slot && ffd_slot.ffd_attachments[attachment_key];
        var ffd_keyframes = ffd_attachment && ffd_attachment.ffd_keyframes;
        var ffd_keyframe0_index = spine.Keyframe.find(ffd_keyframes, spine_pose.time);
        if (ffd_keyframe0_index !== -1) {
          // ffd

          var pct = 0;
          var ffd_keyframe0 = ffd_keyframes[ffd_keyframe0_index];
          var ffd_keyframe1_index = ffd_keyframe0_index + 1;
          var ffd_keyframe1 = ffd_keyframes[ffd_keyframe1_index];
          if (ffd_keyframe1) {
            pct = ffd_keyframe0.curve.evaluate((spine_pose.time - ffd_keyframe0.time) / (ffd_keyframe1.time - ffd_keyframe0.time));
          } else {
            ffd_keyframe1_index = ffd_keyframe0_index;
            ffd_keyframe1 = ffd_keyframes[ffd_keyframe1_index];
          }

          var anim_ffd_attachment = attachment_info.anim_ffd_attachments[spine_pose.anim_key];
          var anim_ffd_keyframe0 = anim_ffd_attachment.ffd_keyframes[ffd_keyframe0_index];
          var anim_ffd_keyframe1 = anim_ffd_attachment.ffd_keyframes[ffd_keyframe1_index];

          var gl_shader = render.gl_ffd_skin_shader;
          var gl_vertex = attachment_info.gl_vertex;

          gl.useProgram(gl_shader.program);

          gl.uniformMatrix4fv(gl_shader.uniforms['uProjection'], false, gl_projection);
          gl.uniformMatrix3fv(gl_shader.uniforms['uModelviewArray[0]'], false, render.gl_skin_shader_modelview_array);
          gl.uniformMatrix3fv(gl_shader.uniforms['uTexMatrix'], false, gl_tex_matrix);
          gl.uniform4fv(gl_shader.uniforms['uColor'], gl_color);
          gl.uniform1f(gl_shader.uniforms['uMorphWeight'], pct);

          gl.activeTexture(gl.TEXTURE0);
          gl.bindTexture(gl.TEXTURE_2D, gl_texture);
          gl.uniform1i(gl_shader.uniforms['uSampler'], 0);

          glSetupAttribute(gl, gl_shader, 'aVertexPosition', gl_vertex.position);
          glSetupAttribute(gl, gl_shader, 'aVertexBlenders{index}', gl_vertex.blenders, render.gl_skin_shader_blenders_count);
          glSetupAttribute(gl, gl_shader, 'aVertexMorph0Position', anim_ffd_keyframe0.gl_vertex);
          glSetupAttribute(gl, gl_shader, 'aVertexMorph1Position', anim_ffd_keyframe1.gl_vertex);
          glSetupAttribute(gl, gl_shader, 'aVertexTexCoord', gl_vertex.texcoord);

          gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl_vertex.triangle.buffer);
          gl.drawElements(gl.TRIANGLES, gl_vertex.triangle.count, gl_vertex.triangle.type, 0);
          gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

          glResetAttribute(gl, gl_shader, 'aVertexPosition', gl_vertex.position);
          glResetAttribute(gl, gl_shader, 'aVertexBlenders{index}', gl_vertex.blenders, render.gl_skin_shader_blenders_count);
          glResetAttribute(gl, gl_shader, 'aVertexMorph0Position', anim_ffd_keyframe0.gl_vertex);
          glResetAttribute(gl, gl_shader, 'aVertexMorph1Position', anim_ffd_keyframe1.gl_vertex);
          glResetAttribute(gl, gl_shader, 'aVertexTexCoord', gl_vertex.texcoord);

          gl.bindTexture(gl.TEXTURE_2D, null);

          gl.useProgram(null);
        } else {
          // no ffd

          var gl_shader = render.gl_skin_shader;
          var gl_vertex = attachment_info.gl_vertex;

          gl.useProgram(gl_shader.program);

          gl.uniformMatrix4fv(gl_shader.uniforms['uProjection'], false, gl_projection);
          gl.uniformMatrix3fv(gl_shader.uniforms['uModelviewArray[0]'], false, render.gl_skin_shader_modelview_array);
          gl.uniformMatrix3fv(gl_shader.uniforms['uTexMatrix'], false, gl_tex_matrix);
          gl.uniform4fv(gl_shader.uniforms['uColor'], gl_color);

          gl.activeTexture(gl.TEXTURE0);
          gl.bindTexture(gl.TEXTURE_2D, gl_texture);
          gl.uniform1i(gl_shader.uniforms['uSampler'], 0);

          glSetupAttribute(gl, gl_shader, 'aVertexPosition', gl_vertex.position);
          glSetupAttribute(gl, gl_shader, 'aVertexBlenders{index}', gl_vertex.blenders, render.gl_skin_shader_blenders_count);
          glSetupAttribute(gl, gl_shader, 'aVertexTexCoord', gl_vertex.texcoord);

          gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl_vertex.triangle.buffer);
          gl.drawElements(gl.TRIANGLES, gl_vertex.triangle.count, gl_vertex.triangle.type, 0);
          gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

          glResetAttribute(gl, gl_shader, 'aVertexPosition', gl_vertex.position);
          glResetAttribute(gl, gl_shader, 'aVertexBlenders{index}', gl_vertex.blenders, render.gl_skin_shader_blenders_count);
          glResetAttribute(gl, gl_shader, 'aVertexTexCoord', gl_vertex.texcoord);

          gl.bindTexture(gl.TEXTURE_2D, null);

          gl.useProgram(null);
        }
        break;
    }
  });

  gl_color[3] = alpha;
}

function vec4Identity(v) {
  v[0] = v[1] = v[2] = v[3] = 1.0;
  return v;
}

function vec4CopyColor(v, color) {
  v[0] = color.r;
  v[1] = color.g;
  v[2] = color.b;
  v[3] = color.a;
  return v;
}

function vec4ApplyColor(v, color) {
  v[0] *= color.r;
  v[1] *= color.g;
  v[2] *= color.b;
  v[3] *= color.a;
  return v;
}

function mat3x3Identity(m) {
  m[1] = m[2] = m[3] =
  m[5] = m[6] = m[7] = 0.0;
  m[0] = m[4] = m[8] = 1.0;
  return m;
}

function mat3x3Copy(m, other) {
  m.set(other);
  return m;
}

function mat3x3Ortho(m, l, r, b, t) {
  var lr = 1 / (l - r);
  var bt = 1 / (b - t);
  m[0] *= -2 * lr;
  m[4] *= -2 * bt;
  m[6] += (l + r) * lr;
  m[7] += (t + b) * bt;
  return m;
}

function mat3x3Translate(m, x, y) {
  m[6] += m[0] * x + m[3] * y;
  m[7] += m[1] * x + m[4] * y;
  return m;
}

function mat3x3RotateCosSin(m, c, s) {
  var m0 = m[0],
    m1 = m[1];
  var m3 = m[3],
    m4 = m[4];
  m[0] = m0 * c + m3 * s;
  m[1] = m1 * c + m4 * s;
  m[3] = m3 * c - m0 * s;
  m[4] = m4 * c - m1 * s;
  return m;
}

function mat3x3Rotate(m, angle) {
  return mat3x3RotateCosSin(m, Math.cos(angle), Math.sin(angle));
}

function mat3x3Scale(m, x, y) {
  m[0] *= x;
  m[1] *= x;
  m[2] *= x;
  m[3] *= y;
  m[4] *= y;
  m[5] *= y;
  return m;
}

function mat3x3Transform(m, v, out) {
  var x = m[0] * v[0] + m[3] * v[1] + m[6];
  var y = m[1] * v[0] + m[4] * v[1] + m[7];
  var w = m[2] * v[0] + m[5] * v[1] + m[8];
  var iw = (w) ? (1 / w) : (1);
  out[0] = x * iw;
  out[1] = y * iw;
  return out;
}

function mat3x3ApplySpace(m, space) {
  if (space) {
    mat3x3Translate(m, space.position.x, space.position.y);
    mat3x3Rotate(m, space.rotation.rad);
    mat3x3Scale(m, space.scale.x, space.scale.y);
  }
  return m;
}

function mat3x3ApplyAtlasPageTexcoord(m, page) {
  if (page) {
    mat3x3Scale(m, 1 / page.w, 1 / page.h);
  }
  return m;
}

function mat3x3ApplyAtlasSiteTexcoord(m, site) {
  if (site) {
    mat3x3Translate(m, site.x, site.y);
    if (site.rotate === -1) {
      mat3x3Translate(m, 0, site.w); // bottom-left corner
      mat3x3RotateCosSin(m, 0, -1); // -90 degrees
    } else if (site.rotate === 1) {
      mat3x3Translate(m, site.h, 0); // top-right corner
      mat3x3RotateCosSin(m, 0, 1); // 90 degrees
    }
    mat3x3Scale(m, site.w, site.h);
  }
  return m;
}

function mat3x3ApplyAtlasSitePosition(m, site) {
  if (site) {
    mat3x3Scale(m, 1 / site.original_w, 1 / site.original_h);
    mat3x3Translate(m, 2 * site.offset_x - (site.original_w - site.w), (site.original_h - site.h) - 2 * site.offset_y);
    mat3x3Scale(m, site.w, site.h);
  }
  return m;
}

function mat4x4Identity(m) {
  m[1] = m[2] = m[3] = m[4] =
  m[6] = m[7] = m[8] = m[9] =
  m[11] = m[12] = m[13] = m[14] = 0.0;
  m[0] = m[5] = m[10] = m[15] = 1.0;
  return m;
}

function mat4x4Copy(m, other) {
  m.set(other);
  return m;
}

function mat4x4Ortho(m, l, r, b, t, n, f) {
  var lr = 1 / (l - r);
  var bt = 1 / (b - t);
  var nf = 1 / (n - f);
  m[0] = -2 * lr;
  m[5] = -2 * bt;
  m[10] = 2 * nf;
  m[12] = (l + r) * lr;
  m[13] = (t + b) * bt;
  m[14] = (f + n) * nf;
  return m;
}

function mat4x4Translate(m, x, y, z) {
  z = z || 0;
  m[12] += m[0] * x + m[4] * y + m[8] * z;
  m[13] += m[1] * x + m[5] * y + m[9] * z;
  m[14] += m[2] * x + m[6] * y + m[10] * z;
  m[15] += m[3] * x + m[7] * y + m[11] * z;
  return m;
}

function mat4x4RotateCosSinZ(m, c, s) {
  var a_x = m[0],
    a_y = m[1],
    a_z = m[2],
    a_w = m[3];
  var b_x = m[4],
    b_y = m[5],
    b_z = m[6],
    b_w = m[7];
  m[0] = a_x * c + b_x * s;
  m[1] = a_y * c + b_y * s;
  m[2] = a_z * c + b_z * s;
  m[3] = a_w * c + b_w * s;
  m[4] = b_x * c - a_x * s;
  m[5] = b_y * c - a_y * s;
  m[6] = b_z * c - a_z * s;
  m[7] = b_w * c - a_w * s;
  return m;
}

function mat4x4RotateZ(m, angle) {
  return mat4x4RotateCosSinZ(m, Math.cos(angle), Math.sin(angle));
}

function mat4x4Scale(m, x, y, z) {
  z = z || 1;
  m[0] *= x;
  m[1] *= x;
  m[2] *= x;
  m[3] *= x;
  m[4] *= y;
  m[5] *= y;
  m[6] *= y;
  m[7] *= y;
  m[8] *= z;
  m[9] *= z;
  m[10] *= z;
  m[11] *= z;
  return m;
}

function glCompileShader(gl, src, type) {
  function flatten(array, out) {
    out = out || [];
    array.forEach(function(value) {
      if (Array.isArray(value)) {
        flatten(value, out);
      } else {
        out.push(value);
      }
    });
    return out;
  }
  src = flatten(src);
  var shader = gl.createShader(type);
  gl.shaderSource(shader, src.join('\n'));
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    src.forEach(function(line, index) {
      console.log(index + 1, line);
    });
    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    shader = null;
  }
  return shader;
}

function glLinkProgram(gl, vs, fs) {
  var program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.log("could not link shader program");
    gl.detachShader(program, vs);
    gl.detachShader(program, fs);
    gl.deleteProgram(program);
    program = null;
  }
  return program;
}

function glGetUniforms(gl, program, uniforms) {
  var count = /** @type {number} */ (gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS));
  for (var index = 0; index < count; ++index) {
    var uniform = gl.getActiveUniform(program, index);
    uniforms[uniform.name] = gl.getUniformLocation(program, uniform.name);
  }
  return uniforms;
}

function glGetAttribs(gl, program, attribs) {
  var count = /** @type {number} */ (gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES));
  for (var index = 0; index < count; ++index) {
    var attrib = gl.getActiveAttrib(program, index);
    attribs[attrib.name] = gl.getAttribLocation(program, attrib.name);
  }
  return attribs;
}

function glMakeShader(gl, vs_src, fs_src) {
  var shader = {};
  shader.vs_src = vs_src;
  shader.fs_src = fs_src;
  shader.vs = glCompileShader(gl, shader.vs_src, gl.VERTEX_SHADER);
  shader.fs = glCompileShader(gl, shader.fs_src, gl.FRAGMENT_SHADER);
  shader.program = glLinkProgram(gl, shader.vs, shader.fs);
  shader.uniforms = glGetUniforms(gl, shader.program, {});
  shader.attribs = glGetAttribs(gl, shader.program, {});
  return shader;
}

function glMakeVertex(gl, type_array, size, buffer_type, buffer_draw) {
  var vertex = {};
  if (type_array instanceof Float32Array) {
    vertex.type = gl.FLOAT;
  } else if (type_array instanceof Int8Array) {
    vertex.type = gl.BYTE;
  } else if (type_array instanceof Uint8Array) {
    vertex.type = gl.UNSIGNED_BYTE;
  } else if (type_array instanceof Int16Array) {
    vertex.type = gl.SHORT;
  } else if (type_array instanceof Uint16Array) {
    vertex.type = gl.UNSIGNED_SHORT;
  } else if (type_array instanceof Int32Array) {
    vertex.type = gl.INT;
  } else if (type_array instanceof Uint32Array) {
    vertex.type = gl.UNSIGNED_INT;
  } else {
    vertex.type = gl.NONE;
    throw new Error();
  }
  vertex.size = size;
  vertex.count = type_array.length / vertex.size;
  vertex.type_array = type_array;
  vertex.buffer = gl.createBuffer();
  vertex.buffer_type = buffer_type;
  vertex.buffer_draw = buffer_draw;
  gl.bindBuffer(vertex.buffer_type, vertex.buffer);
  gl.bufferData(vertex.buffer_type, vertex.type_array, vertex.buffer_draw);
  return vertex;
}

function glSetupAttribute(gl, shader, format, vertex, count) {
  count = count || 0;
  gl.bindBuffer(vertex.buffer_type, vertex.buffer);
  if (count > 0) {
    var sizeof_vertex = vertex.type_array.BYTES_PER_ELEMENT * vertex.size; // in bytes
    var stride = sizeof_vertex * count;
    for (var index = 0; index < count; ++index) {
      var offset = sizeof_vertex * index;
      var attrib = shader.attribs[format.replace(/{index}/g, index)];
      gl.vertexAttribPointer(attrib, vertex.size, vertex.type, false, stride, offset);
      gl.enableVertexAttribArray(attrib);
    }
  } else {
    var attrib = shader.attribs[format];
    gl.vertexAttribPointer(attrib, vertex.size, vertex.type, false, 0, 0);
    gl.enableVertexAttribArray(attrib);
  }
}

function glResetAttribute(gl, shader, format, vertex, count) {
  count = count || 0;
  if (count > 0) {
    for (var index = 0; index < count; ++index) {
      var attrib = shader.attribs[format.replace(/{index}/g, index)];
      gl.disableVertexAttribArray(attrib);
    }
  } else {
    var attrib = shader.attribs[format];
    gl.disableVertexAttribArray(attrib);
  }
}
