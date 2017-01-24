///import * as Spine from "./spine.ts/spine";
///import * as Atlas from "./spine.ts/demo/atlas";
///import * as RenderCtx2D from "./spine.ts/demo/render-ctx2d";
///import * as RenderWebGL from "./spine.ts/demo/render-webgl";

///export { Spine as Spine }
///export { Atlas as Atlas }
///export { RenderCtx2D as RenderCtx2D }
///export { RenderWebGL as RenderWebGL }

require("expose-loader?Spine!./spine.ts/spine");
require("expose-loader?Atlas!./spine.ts/demo/atlas");
require("expose-loader?RenderCtx2D!./spine.ts/demo/render-ctx2d");
require("expose-loader?RenderWebGL!./spine.ts/demo/render-webgl");
