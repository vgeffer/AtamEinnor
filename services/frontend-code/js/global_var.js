

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


var tst_img = [];
var CursorImg = null;


var scaler = 2;

var World = null;

//Timing
var TimePrev = null;
var TimeNow = null;
var TimeElapsed = null;

//Networking
var socket = null;

//Controls
var MousePos = {};

var HighlightedTile = {};
var SelectedTile = null;
var CursorDrawn = false;

//Misc
var ResAlertShown = false;
var FirstMessage = true;
var GameRunning = false;

//Camera
var XOffset = 0;
var YOffset = 0;
var MouseSpeedMultiplier = 1;

//Game 
var Workers = [];
var World = [];
var View = [];

//Economy
var CurrentPrices = null;
var Money = 0;