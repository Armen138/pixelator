/*jshint esversion:6 */
import Salad from "./salad/salad.js";
import Text from "./salad/behaviors/text.js";
import Editor from "./editor/editor.js";
import Palette from "./editor/palette.js";
import FullScreenCanvas from "./plugins/fullscreencanvas.js";

let salad = new Salad();
salad.use(FullScreenCanvas)
    .use(Palette)
    .behave("Text", Text)
    .behave("Editor", Editor)
    .loadSceneFromJson("scenes/sample.json")
    .then(scene => salad.run())
    .catch(console.error);
console.log("do stuff");