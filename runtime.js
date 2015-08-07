﻿// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
//          vvvvvvvv
cr.plugins_.SpinePlugin = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	/////////////////////////////////////
	// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
	//                            vvvvvvvv
	var pluginProto = cr.plugins_.SpinePlugin.prototype;

	/////////////////////////////////////
	// Object type class
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};

	var typeProto = pluginProto.Type.prototype;

	// called on startup for each object type
	typeProto.onCreate = function()
	{
	};

	/////////////////////////////////////
	// Instance class
	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;

		// any other properties you need, e.g...
		// this.myValue = 0;
	};

	var instanceProto = pluginProto.Instance.prototype;

	// called whenever an instance is created
	instanceProto.onCreate = function()
	{
		// note the object is sealed after this call; ensure any properties you'll ever need are set on the object
		// e.g...
		// this.myValue = 0;

		var instance = this;

		var gl = this.runtime.gl;
		if (gl)
		{
			console.log("WebGL Enabled");
			console.log(gl.getParameter(gl.VERSION));
			instance.extra.render_webgl = new renderWebGL(gl);
		}

		var ctx = this.runtime.ctx;
		if (ctx)
		{
			console.log("2D Context Enabled");
			instance.render_ctx2d = new renderCtx2D(ctx);
		}

		var spine_url = instance.properties[0];
		var atlas_url = instance.properties[1] || "";
		var skin_key = instance.properties[2] || "";
		var anim_key = instance.properties[3] || "";
		console.log("Spine Data URL", spine_url);
		console.log("Atlas Data URL", atlas_url);
		console.log("Skin Key", skin_key);
		console.log("Anim Key", anim_key);

		instance.extra.loading = true;
		instance.extra.spine_pose = null;
		instance.extra.atlas_data = null;

		loadText(spine_url, function (err, text)
		{
			if (err)
			{
				console.log(err, text);
				return;
			}

			instance.extra.spine_pose = new spine.Pose(new spine.Data().load(JSON.parse(text)));

			console.log("Spine Data Version", instance.extra.spine_pose.data.skeleton.spine);

			//instance.width = instance.extra.spine_pose.data.skeleton.width || instance.width;
			//instance.height = instance.extra.spine_pose.data.skeleton.height || instance.height;
			//instance.set_bbox_changed();

			console.log("Skin Keys", instance.extra.spine_pose.data.skin_keys);
			instance.extra.spine_pose.setSkin(skin_key);

			console.log("Anim Keys", instance.extra.spine_pose.data.anim_keys);
			instance.extra.spine_pose.setAnim(anim_key);

			loadText(atlas_url, function (err, text)
			{
				var images = {};

				var counter = 0;
				var counter_inc = function () { counter++; }
				var counter_dec = function ()
				{
					if (--counter === 0)
					{
						if (instance.extra.render_webgl)
						{
							instance.extra.render_webgl.loadPose(instance.extra.spine_pose, instance.extra.atlas_data, images);
						}
						if (instance.extra.render_ctx2d)
						{
							instance.extra.render_ctx2d.loadPose(instance.extra.spine_pose, instance.extra.atlas_data, images);
						}

						instance.runtime.redraw = true;
						instance.extra.loading = false;
					}
				}

				counter_inc();

				if (!err && text)
				{
					instance.extra.atlas_data = new atlas.Data().import(text);

					// load atlas page images
					instance.extra.atlas_data.pages.forEach(function (page)
					{
						var image_key = page.name;
						var image_url = image_key;
						console.log("Atlas Image URL", image_url);

						counter_inc();
						images[image_key] = loadImage(image_url, (function (image_key) { return function (err, image)
						{
							if (err)
							{
								console.log(err, text);
								return;
							}

							console.log("Atlas Image", image.width, "x", image.height, image.src);
							counter_dec();
						}})(image_key));
					});
				}
				else
				{
					// TODO: load attachment images
				}

				counter_dec();
			});
		});

		this.runtime.tickMe(this);
	};

	// called whenever an instance is destroyed
	// note the runtime may keep the object after this call for recycling; be sure
	// to release/recycle/reset any references to other objects in this function.
	instanceProto.onDestroy = function ()
	{
		var instance = this;

		var gl = this.runtime.gl;
		if (gl)
		{
			console.log("WebGL Enabled");
			console.log(gl.getParameter(gl.VERSION));
		}

		var ctx = this.runtime.ctx;
		if (ctx)
		{
			console.log("2D Context Enabled");
		}

		if (instance.extra.render_webgl)
		{
			if (instance.extra.spine_pose)
			{
				instance.extra.render_webgl.dropPose(instance.extra.spine_pose, instance.extra.atlas_data);
			}

			instance.extra.render_webgl = null;
		}

		if (instance.extra.render_ctx2d)
		{
			if (instance.extra.spine_pose)
			{
				instance.extra.render_ctx2d.dropPose(instance.extra.spine_pose, instance.extra.atlas_data);
			}

			instance.extra.render_ctx2d = null;
		}

		if (instance.extra.spine_pose)
		{
			instance.extra.spine_pose = null;
		}

		if (instance.extra.atlas_data)
		{
			instance.extra.atlas_data = null;
		}
	};

	// called when saving the full state of the game
	instanceProto.saveToJSON = function ()
	{
		// return a Javascript object containing information about your object's state
		// note you MUST use double-quote syntax (e.g. "property": value) to prevent
		// Closure Compiler renaming and breaking the save format
		return {
			// e.g.
			//"myValue": this.myValue
		};
	};

	// called when loading the full state of the game
	instanceProto.loadFromJSON = function (o)
	{
		// load from the state previously saved by saveToJSON
		// 'o' provides the same object that you saved, e.g.
		// this.myValue = o["myValue"];
		// note you MUST use double-quote syntax (e.g. o["property"]) to prevent
		// Closure Compiler renaming and breaking the save format
	};

	instanceProto.tick = function()
	{
		var instance = this;

		if (!instance.extra.loading && instance.extra.spine_pose)
		{
			var dt = this.runtime.getDt(this);
			instance.extra.spine_pose.update(dt * 1000);
			instance.extra.spine_pose.strike();
			instance.runtime.redraw = true;
		}
	}

	// only called if a layout object - draw to a canvas 2D context
	instanceProto.draw = function(ctx)
	{
		var instance = this;

		if (ctx !== this.runtime.ctx)
		{
			console.log("error: ctx", ctx, this.runtime.ctx);
		}

		if (!instance.extra.loading && instance.extra.render_ctx2d && instance.extra.spine_pose)
		{
			ctx.save();

			// origin at center, x right, y up
			ctx.translate(ctx.canvas.width/2, ctx.canvas.height/2); ctx.scale(1, -1);

			var tx = instance.x - (ctx.canvas.width/2);
			var ty = (ctx.canvas.height/2) - instance.y;
			var rz = -instance.angle;
			var sx = 0.5 * instance.width / instance.extra.spine_pose.data.skeleton.width;
			var sy = 0.5 * instance.height / instance.extra.spine_pose.data.skeleton.height;

			ctx.translate(tx, ty);
			ctx.rotate(rz);
			ctx.scale(sx, sy);
			ctx.lineWidth = 1 / Math.max(sx, sy);

			instance.extra.render_ctx2d.drawPose(instance.extra.spine_pose, instance.extra.atlas_data);

			ctx.restore();
		}
	};

	// only called if a layout object in WebGL mode - draw to the WebGL context
	// 'glw' is not a WebGL context, it's a wrapper - you can find its methods in GLWrap.js in the install
	// directory or just copy what other plugins do.
	instanceProto.drawGL = function (glw)
	{
		var instance = this;

		if (glw.gl !== this.runtime.gl)
		{
			console.log("error: gl", glw.gl, this.runtime.gl);
		}

		if (!instance.extra.loading && instance.extra.render_webgl && instance.extra.spine_pose)
		{
			/// suspend glwrap

			glw.endBatch();

			var gl = instance.runtime.gl;

			var gl_projection = instance.extra.render_webgl.gl_projection;

			mat3x3Identity(gl_projection);
			mat3x3Ortho(gl_projection, -gl.canvas.width/2, gl.canvas.width/2, -gl.canvas.height/2, gl.canvas.height/2);

			var tx = instance.x - (gl.canvas.width/2);
			var ty = (gl.canvas.height/2) - instance.y;
			var rz = -instance.angle;
			var sx = 0.5 * instance.width / instance.extra.spine_pose.data.skeleton.width;
			var sy = 0.5 * instance.height / instance.extra.spine_pose.data.skeleton.height;

			mat3x3Translate(gl_projection, tx, ty);
			mat3x3Rotate(gl_projection, rz);
			mat3x3Scale(gl_projection, sx, sy);

			instance.extra.render_webgl.drawPose(instance.extra.spine_pose, instance.extra.atlas_data);

			/// resume glwrap

			// the Spine renderer might change this
			glw.lastSrcBlend = gl.ONE;
			glw.lastDestBlend = gl.ONE_MINUS_SRC_ALPHA;
			gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

			// GLBatchJob::doQuad does not bind the element array buffer
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, glw.indexBuffer);

			// the Spine renderer changes this
			glw.lastTexture0 = null;
			gl.activeTexture(gl.TEXTURE0);
			gl.bindTexture(gl.TEXTURE_2D, null);

			// reload the GLWrap program
			glw.lastProgram = -1;
			glw.switchProgram(0);
		}
	};

	// The comments around these functions ensure they are removed when exporting, since the
	// debugger code is no longer relevant after publishing.
	/**BEGIN-PREVIEWONLY**/
	instanceProto.getDebuggerValues = function (propsections)
	{
		// Append to propsections any debugger sections you want to appear.
		// Each section is an object with two members: "title" and "properties".
		// "properties" is an array of individual debugger properties to display
		// with their name and value, and some other optional settings.
		propsections.push({
			"title": "My debugger section",
			"properties": [
				// Each property entry can use the following values:
				// "name" (required): name of the property (must be unique within this section)
				// "value" (required): a boolean, number or string for the value
				// "html" (optional, default false): set to true to interpret the name and value
				//									 as HTML strings rather than simple plain text
				// "readonly" (optional, default false): set to true to disable editing the property

				// Example:
				// {"name": "My property", "value": this.myValue}
			]
		});
	};

	instanceProto.onDebugValueEdited = function (header, name, value)
	{
		// Called when a non-readonly property has been edited in the debugger. Usually you only
		// will need 'name' (the property name) and 'value', but you can also use 'header' (the
		// header title for the section) to distinguish properties with the same name.
		if (name === "My property")
			this.myProperty = value;
	};
	/**END-PREVIEWONLY**/

	//////////////////////////////////////
	// Conditions
	function Cnds() {};

	// the example condition
	Cnds.prototype.MyCondition = function (myparam)
	{
		// return true if number is positive
		return myparam >= 0;
	};

	// ... other conditions here ...

	pluginProto.cnds = new Cnds();

	//////////////////////////////////////
	// Actions
	function Acts() {};

	// the example action
	Acts.prototype.MyAction = function (myparam)
	{
		// alert the message
		alert(myparam);
	};

	// ... other actions here ...

	pluginProto.acts = new Acts();

	//////////////////////////////////////
	// Expressions
	function Exps() {};

	// the example expression
	Exps.prototype.MyExpression = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_int(1337);				// return our value
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string
	};

	// ... other expressions here ...

	pluginProto.exps = new Exps();

	function loadText (url, callback)
	{
		var req = new XMLHttpRequest();
		if (url)
		{
			req.open("GET", url, true);
			req.responseType = 'text';
			req.addEventListener('error', function (event) { callback("error", null); }, false);
			req.addEventListener('abort', function (event) { callback("abort", null); }, false);
			req.addEventListener('load', function (event)
			{
				if (req.status === 200)
				{
					callback(null, req.response);
				}
				else
				{
					callback(req.response, null);
				}
			},
			false);
			req.send();
		}
		else
		{
			callback("error", null);
		}
		return req;
	}

	function loadImage (url, callback)
	{
		var image = new Image();
		image.crossOrigin = "Anonymous";
		image.addEventListener('error', function (event) { callback("error", null); }, false);
		image.addEventListener('abort', function (event) { callback("abort", null); }, false);
		image.addEventListener('load', function (event) { callback(null, image); }, false);
		image.src = url;
		return image;
	}

}());