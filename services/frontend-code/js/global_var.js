

//Constants
const LOD_LOW = 0;
const LOD_MED = 1;
const LOD_HIG = 2;
const LOD_ULT = 3; //Should talk with kotlos bout dat


//Document
var CanvasElement = null;
var ChatboxElement = null;

//Rendering
var ctx = null;
var GameSettings = null;

//Assets
var TileSet = null;

//Timing
var TimePrev = null;
var TimeNow = null;
var TimeElapsed = null;

//Networking
var Socket = null;

//Misc
var ResAlertShown = false;
var FirstMessage = true;
var GameRunning = false;