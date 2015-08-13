function GetPluginSettings()
{
	return {
		"name":			"Spine",				// as appears in 'insert object' dialog, can be changed as long as "id" stays the same
		"id":			"SpinePlugin",			// this is used to identify this plugin and is saved to the project; never change it
		"version":		"1.0",					// (float in x.y format) Plugin version - C2 shows compatibility warnings based on this
		"description":	"Create a Spine animation object.",
		"author":		"Flyover Games, LLC",
		"help url":		"https://www.scirra.com/manual/106/plugin-reference",
		"category":		"General",				// Prefer to re-use existing categories, but you can set anything here
		"type":			"world",				// either "world" (appears in layout and is drawn), else "object"
		"rotatable":	true,					// only used when "type" is "world".  Enables an angle property on the object.
		"flags":		0						// uncomment lines to enable flags...
					//	| pf_singleglobal		// exists project-wide, e.g. mouse, keyboard.  "type" must be "object".
					//	| pf_texture			// object has a single texture (e.g. tiled background)
					//	| pf_position_aces		// compare/set/get x, y...
					//	| pf_size_aces			// compare/set/get width, height...
					//	| pf_angle_aces			// compare/set/get angle (recommended that "rotatable" be set to true)
					//	| pf_appearance_aces	// compare/set/get visible, opacity...
					//	| pf_tiling				// adjusts image editor features to better suit tiled images (e.g. tiled background)
					//	| pf_animations			// enables the animations system.  See 'Sprite' for usage
					//	| pf_zorder_aces		// move to top, bottom, layer...
					//  | pf_nosize				// prevent resizing in the editor
					//	| pf_effects			// allow WebGL shader effects to be added
					//  | pf_predraw			// set for any plugin which draws and is not a sprite (i.e. does not simply draw
												// a single non-tiling image the size of the object) - required for effects to work properly
	};
};

////////////////////////////////////////
// Parameter types:
// AddNumberParam(label, description [, initial_string = "0"])			// a number
// AddStringParam(label, description [, initial_string = "\"\""])		// a string
// AddAnyTypeParam(label, description [, initial_string = "0"])			// accepts either a number or string
// AddCmpParam(label, description)										// combo with equal, not equal, less, etc.
// AddComboParamOption(text)											// (repeat before "AddComboParam" to add combo items)
// AddComboParam(label, description [, initial_selection = 0])			// a dropdown list parameter
// AddObjectParam(label, description)									// a button to click and pick an object type
// AddLayerParam(label, description)									// accepts either a layer number or name (string)
// AddLayoutParam(label, description)									// a dropdown list with all project layouts
// AddKeybParam(label, description)										// a button to click and press a key (returns a VK)
// AddAnimationParam(label, description)								// a string intended to specify an animation name
// AddAudioFileParam(label, description)								// a dropdown list with all imported project audio files

////////////////////////////////////////
// Conditions

// AddCondition(id,					// any positive integer to uniquely identify this condition
//				flags,				// (see docs) cf_none, cf_trigger, cf_fake_trigger, cf_static, cf_not_invertible,
//									// cf_deprecated, cf_incompatible_with_triggers, cf_looping
//				list_name,			// appears in event wizard list
//				category,			// category in event wizard list
//				display_str,		// as appears in event sheet - use {0}, {1} for parameters and also <b></b>, <i></i>
//				description,		// appears in event wizard dialog when selected
//				script_name);		// corresponding runtime function name

// example
AddNumberParam("Number", "Enter a number to test if positive.");
AddCondition(0, cf_none, "Is number positive", "My category", "{0} is positive", "Description for my condition!", "MyCondition");

var cnd_id = 1;

AddCondition(cnd_id++, cf_none, "Has looped", "Spine Conditions", "Animation has looped", "Animation has looped.", "HasLooped");

AddNumberParam("Number", "Enter number of animation playback loops.");
AddCondition(cnd_id++, cf_none, "Has looped N times", "Spine Conditions", "Animation has looped {0} times", "Animation has looped a number of times.", "HasLoopedCount");

////////////////////////////////////////
// Actions

// AddAction(id,				// any positive integer to uniquely identify this action
//			 flags,				// (see docs) af_none, af_deprecated
//			 list_name,			// appears in event wizard list
//			 category,			// category in event wizard list
//			 display_str,		// as appears in event sheet - use {0}, {1} for parameters and also <b></b>, <i></i>
//			 description,		// appears in event wizard dialog when selected
//			 script_name);		// corresponding runtime function name

// example
AddStringParam("Message", "Enter a string to alert.");
AddAction(0, af_none, "Alert", "My category", "Alert {0}", "Description for my action!", "MyAction");

var act_id = 1;

AddStringParam("Skin Key", "Enter the Spine skin key.");
AddAction(act_id++, af_none, "Set Skin", "Spine Actions", "Set Skin {0}", "Change the skin.", "SetSkin");

AddAction(act_id++, af_none, "Set Prev Skin", "Spine Actions", "Set Prev Skin", "Change to the previous skin.", "SetPrevSkin");

AddAction(act_id++, af_none, "Set Next Skin", "Spine Actions", "Set Next Skin", "Change to the next skin.", "SetNextSkin");

AddStringParam("Anim Key", "Enter the Spine animation key.");
AddAction(act_id++, af_none, "Set Anim", "Spine Actions", "Set Anim {0}", "Change the animation.", "SetAnim");

AddAction(act_id++, af_none, "Set Prev Anim", "Spine Actions", "Set Prev Anim", "Change to the previous animation.", "SetPrevAnim");

AddAction(act_id++, af_none, "Set Next Anim", "Spine Actions", "Set Next Anim", "Change to the next animation.", "SetNextAnim");

AddNumberParam("Time", "Enter the time in milliseconds.");
AddAction(act_id++, af_none, "Set Time", "Spine Actions", "Set Time {0}", "Set the animation playback time.", "SetTime");

AddNumberParam("Rate", "Enter the rate.");
AddAction(act_id++, af_none, "Set Rate", "Spine Actions", "Set Rate {0}", "Set the animation playback rate.", "SetRate");

AddAction(act_id++, af_none, "Reset Loop Count", "Spine Actions", "Reset Loop Count", "Reset the animation loop count.", "ResetLoopCount");

////////////////////////////////////////
// Expressions

// AddExpression(id,			// any positive integer to uniquely identify this expression
//				 flags,			// (see docs) ef_none, ef_deprecated, ef_return_number, ef_return_string,
//								// ef_return_any, ef_variadic_parameters (one return flag must be specified)
//				 list_name,		// currently ignored, but set as if appeared in event wizard
//				 category,		// category in expressions panel
//				 exp_name,		// the expression name after the dot, e.g. "foo" for "myobject.foo" - also the runtime function name
//				 description);	// description in expressions panel

// example
AddExpression(0, ef_return_number, "Leet expression", "My category", "MyExpression", "Return the number 1337.");

var exp_id = 1;

AddExpression(exp_id++, ef_return_number, "Get Time", "Spine Expressions", "GetTime", "Get the animation playback time.");

AddExpression(exp_id++, ef_return_number, "Get Length", "Spine Expressions", "GetLength", "Get the animation playback length.");

AddExpression(exp_id++, ef_return_number, "Get Rate", "Spine Expressions", "GetRate", "Get the animation playback rate.");

AddExpression(exp_id++, ef_return_number, "Get Loop Count", "Spine Expressions", "GetLoopCount", "Get the animation loop count.");

////////////////////////////////////////
ACESDone();

////////////////////////////////////////
// Array of property grid properties for this plugin
// new cr.Property(ept_integer,		name,	initial_value,	description)		// an integer value
// new cr.Property(ept_float,		name,	initial_value,	description)		// a float value
// new cr.Property(ept_text,		name,	initial_value,	description)		// a string
// new cr.Property(ept_color,		name,	initial_value,	description)		// a color dropdown
// new cr.Property(ept_font,		name,	"Arial,-16", 	description)		// a font with the given face name and size
// new cr.Property(ept_combo,		name,	"Item 1",		description, "Item 1|Item 2|Item 3")	// a dropdown list (initial_value is string of initially selected item)
// new cr.Property(ept_link,		name,	link_text,		description, "firstonly")		// has no associated value; simply calls "OnPropertyChanged" on click

var property_list = [
	new cr.Property(ept_text,		"Spine Data URL",	"",		"Spine data file from export."),
	new cr.Property(ept_text,		"Atlas Data URL",	"",		"Atlas data file from export."),
	new cr.Property(ept_text,		"Skin Key",			"",		"Skin Key"),
	new cr.Property(ept_text,		"Anim Key",			"",		"Anim Key")
	];

// Called by IDE when a new object type is to be created
function CreateIDEObjectType()
{
	return new IDEObjectType();
}

// Class representing an object type in the IDE
function IDEObjectType()
{
	assert2(this instanceof arguments.callee, "Constructor called as a function");
}

// Called by IDE when a new object instance of this type is to be created
IDEObjectType.prototype.CreateInstance = function(instance)
{
	return new IDEInstance(instance);
}

// Class representing an individual instance of an object in the IDE
function IDEInstance(instance, type)
{
	assert2(this instanceof arguments.callee, "Constructor called as a function");

	// Save the constructor parameters
	this.instance = instance;
	this.type = type;

	// Set the default property values from the property table
	this.properties = {};

	for (var i = 0; i < property_list.length; i++)
		this.properties[property_list[i].name] = property_list[i].initial_value;

	// Plugin-specific variables
	// this.myValue = 0...
}

// Called when inserted via Insert Object Dialog for the first time
IDEInstance.prototype.OnInserted = function()
{
}

// Called when double clicked in layout
IDEInstance.prototype.OnDoubleClicked = function()
{
}

// Called after a property has been changed in the properties bar
IDEInstance.prototype.OnPropertyChanged = function(property_name)
{
}

// For rendered objects to load fonts or textures
IDEInstance.prototype.OnRendererInit = function(renderer)
{
}

// Called to draw self in the editor if a layout object
IDEInstance.prototype.Draw = function(renderer)
{
	var q = this.instance.GetBoundingQuad();
	var tl = new cr.vector2(q.tlx, q.tly);
	var tr = new cr.vector2(q.trx, q.try_);
	var br = new cr.vector2(q.brx, q.bry);
	var bl = new cr.vector2(q.blx, q.bly);
	var c = cr.RGB(0, 0, 255);
	renderer.Line(tl, tr, c);
	renderer.Line(tr, br, c);
	renderer.Line(br, bl, c);
	renderer.Line(bl, tl, c);
	var c = cr.RGB(255, 0, 0);
	renderer.Line(tl, br, c);
	renderer.Line(bl, tr, c);
}

// For rendered objects to release fonts or textures
IDEInstance.prototype.OnRendererReleased = function(renderer)
{
}
