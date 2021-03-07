//THIS SHOULD BE REMOVED THEN...

var div_loading = $("loading");
var progressBar = $("progressBar");
var span_loading = $("spanLoading");

var sandwich = $("sandwich");
var sandwichText = $("sandwichText");
var loader = $("loader");

var authBox = $("authBox");

var buttonLogin = $("buttonLogin");
var loginUsername = $("loguname");
var loginPassword = $("logpassw");
var checkbox_loginAutologin = $("logAutologin");

var registerUsername = $("reguname");
var registerPassword = $("regpassw");
var registerEmail = $("regemail")
var buttonRegister = $("buttonRegister");
var checkbox_registerAutologin = $("regAutologin");

var mainMenu = $("MainMenu");

var div_newGame = $("newGame");
var input_newGameName = $("newGameName");
var input_newGamePlayer = $("newGamePlayer");
var cycler_playableArea = $("playableAreaCycler");
var cycler_winCondition = $("winConditionCycler");
var checkbox_spectable = $("spectable");
var button_createGame = $("buttonCreateGame");

var div_joinGame = $("joinGame");
var input_joinGameName = $("joinGameName");
var button_joinGame = $("buttonJoinGame");

var indicator_newGameName = $("indicatorNewGameName");
var indicator_newGamePlayer = $("indicatorNewGamePlayer");
var indicator_joinGameName = $("indicatorJoinGameName");

var gamediv = $("gamediv");
var overlay = $("overlay");

var indicators = [
	$("indicatorNewGameName"),
	$("indicatorNewGamePlayer"),
	$("indicatorJoinGameName")
];


var gameInfoDiv = $("gameInfoDiv");

var info_p0_turnIndicator = $("p0_turnIndicator");
var info_p0_photo = $("p0_photo");
var info_p0_name = $("p0_name");
var info_p0_points = $("p0_points");

var info_p1_turnIndicator = $("p1_turnIndicator");
var info_p1_photo = $("p1_photo");
var info_p1_name = $("p1_name");
var info_p1_points = $("p1_points");

var spectatorAlert = $("spectatorAlert");

var profileViewer = $("profileViewer");
var profileTop = $("profileTop");
var profilePhoto = $("profilePhoto");
var profileRight = $("profileRight");
var profileUsername = $("profileUsername");
var profilePoints = $("profilePoints");
var profileLastSeen = $("profileLastSeen");
var profileRegistered = $("profileRegistered");

var profileEditor = $("profileEditor");
var profileEditorTop = $("profileEditorTop");
var profileEditorPhoto = $("profileEditorPhoto");
var profileEditorRight = $("profileEditorRight");
var profileEditorUsername = $("profileEditorUsername");
var profileEditorPoints = $("profileEditorPoints");
var profileEditorRegistered = $("profileEditorRegistered");
var colorManualHex = $("colorManualHex");

var coordinates = $("coordinates");

var dummy1 = $("dummy1");
var dummy2 = $("dummy2");


//-------------------------------------
//------GENERAL STUFF SETUP------------
//-------------------------------------

function $(id){
	return document.getElementById(id);
}

var colorPicker = ColorPicker($("colorPicker"), (hex, hsv, rgb) => {
	profileEditor.style.borderColor = hex;
	profileEditor.style.boxShadow = "0 0 12px 8px " + hex + "60";

	colorManualHex.value = hex;
});

function openPopup(popup){
	overlay.animate([{opacity: 0}, {opacity: 0.6}], {duration: 200});
	overlay.style.opacity = 0.6;
	overlay.style.display = "block";
	popup.animate([{transform: "scale(0) translate(-50%, -50%)", opacity: 0}, {transform: "scale(1) translate(-50%, -50%)", opacity: 1}], {duration: 200});
	popup.style.display = "flex";
}
function closePopup(popup){
	setTimeout(() => {overlay.style.display = "none"; popup.style.display = "none";}, 200);
	overlay.animate([{opacity: 0.6}, {opacity: 0}], {duration: 220});
	overlay.style.opacity = 0;
	popup.animate([{transform: "scale(1) translate(-50%, -50%)", opacity: 1}, {transform: "scale(0) translate(-50%, -50%)", opacity: 0}], {duration: 220});
}

function cycler(element){
	element.cycleIndex++;
	if (element.cycleIndex > element.choicesDisplay.length - 1){
		element.cycleIndex = 0;
	}
	element.firstChild.textContent = element.choicesDisplay[element.cycleIndex];
}
function checkbox(element){
	if (element.checked){
		element.checked = false;
		element.firstElementChild.style.opacity = 0;
	} else {
		element.checked = true;
		element.firstElementChild.style.opacity = 1;
	}
}

function sandwichSetText(text){
	sandwichText.textContent = text;
}
function sandwichIn(){
	sandwich.style.display = "flex";
	const targetBottom = sandwich.clientHeight * 0.8 + "px";
	sandwich.style.bottom = targetBottom;
	sandwich.animate([
			{opacity: 0, bottom: - sandwich.clientHeight + "px"},
			{opacity: 1, bottom: targetBottom}
		],
		{duration: 200}
	);
}
function sandwichOut(timeout){
	setTimeout(() => {
		setTimeout(() => {
			sandwich.style.display = "none";
			sandwich.style.color = "#fcac34";
			loader.style.borderTopWidth = "6px";
			loader.style.borderTopColor = "#fcac34";
			loader.style.backgroundColor = "transparent";
		}, 250)

		sandwich.animate([
				{opacity: 1},
				{opacity: 0}
			],
			{duration: 250}
		);
	}, timeout);
}
function sandwichEndLoading(success){
	let targetColor;
	if (success){
		targetColor = "#afd245";
	} else {
		targetColor = "#cc5500";
	}

	setTimeout(() => {
		sandwich.style.color = targetColor;
		loader.style.borderTopWidth = "0px";
		loader.style.borderTopColor = targetColor;
		loader.style.backgroundColor = targetColor;
	}, 300)

	sandwich.animate([
		{color: "#fcac34"},
		{color: targetColor}
	],
	{duration: 300});
	loader.animate([
		{borderTopWidth: "6px", borderTopColor: "#fcac34", backgroundColor: "#C28730"},
		{borderTopWidth: "0px", borderTopColor: targetColor, backgroundColor: targetColor}
	],
	{duration: 300});
}

window.onload = function(){
	input_joinGameName.addEventListener("keydown", (event) => {
		if (event.keyCode === 13){
			event.preventDefault();
			button_joinGame.click();
		}
	});
	
	input_newGameName.addEventListener("keydown", (event) => {
		if (event.keyCode === 13){
			event.preventDefault();
			input_newGamePlayer.focus();
		}
	});
	input_newGamePlayer.addEventListener("keydown", (event) => {
		if (event.keyCode === 13){
			event.preventDefault();
			input_newGamePlayer.blur();
			button_createGame.click();
		}
	});
	
	input_newGamePlayer.addEventListener("keydown", (event) => {
		if (event.keyCode === 13){
			event.preventDefault();
			input_newGamePlayer.blur();
			button_createGame.click();
		}
	});
	
	loginUsername.addEventListener("keydown", (event) => {
		if (event.keyCode === 13){
			event.preventDefault();
			loginPassword.focus();
		}
	});
	loginPassword.addEventListener("keydown", (event) => {
		if (event.keyCode === 13){
			event.preventDefault();
			loginPassword.blur();
			buttonLogin.click();
		}
	});
	
	registerUsername.addEventListener("keydown", (event) => {
		if (event.keyCode === 13){
			event.preventDefault();
			registerEmail.focus();
		}
	});
	registerEmail.addEventListener("keydown", (event) => {
		if (event.keyCode === 13){
			event.preventDefault();
			registerPassword.focus();
		}
	});
	registerPassword.addEventListener("keydown", (event) => {
		if (event.keyCode === 13){
			event.preventDefault();
			registerPassword.blur();
			buttonRegister.click();
		}
	});
	
	$("changePassCurrent").addEventListener("keydown", (event) => {
		if (event.keyCode === 13){
			event.preventDefault();
			$("changePassNew").focus();
		}
	});
	$("changePassNew").addEventListener("keydown", (event) => {
		if (event.keyCode === 13){
			event.preventDefault();
			$("changePassNew").blur();
			$("confirmPassChange").click();
		}
	});

	checkbox(checkbox_spectable);

	for (const eye of document.getElementsByClassName("eye")){
		eye.addEventListener("click", () => {
			const input = eye.parentElement.firstElementChild;
			if (input.type === "password"){
				input.setAttribute("type", "text");
				eye.src = urlToSrcString(images.eye_closed);
			} else {
				input.setAttribute("type", "password");
				eye.src = urlToSrcString(images.eye_open);
			}
		});
	}

	
	input_newGameName.placeholder = "name of the game";
	input_newGamePlayer.placeholder = "other player's name";
	input_joinGameName.placeholder = "name of the game";
	
	indicator_newGameName.trueParent = input_newGameName;
	indicator_newGamePlayer.trueParent = input_newGamePlayer;
	indicator_joinGameName.trueParent = input_joinGameName;
	
	cycler_winCondition.choicesDisplay = ["never", "1 point", "3 points", "5 points", "10 points", "25 points"];
	cycler_winCondition.choicesData = [-1, 1, 3, 5, 10, 25];
	cycler_winCondition.cycleIndex = 0;
	cycler_winCondition.firstChild.textContent = cycler_winCondition.choicesDisplay[0];
	
	cycler_playableArea.choicesDisplay = ["infinite", "10x10", "25x25", "50x50", "100x100"];
	cycler_playableArea.choicesData = [-1, 10, 25, 50, 100];
	cycler_playableArea.cycleIndex = 0;
	cycler_playableArea.firstChild.textContent = cycler_playableArea.choicesDisplay[0];
	
	resize();
}

//------------RESIZE STUFF-------------

function updateProfilePhotoSize(){
	const side = (dummy2.clientHeight * 2 + 3 * 16) + "px";
	profilePhoto.style.height = side;
	profilePhoto.style.width = side;

	profileEditorPhoto.style.height = side;
	profileEditorPhoto.style.width = side;
}
function updateCheckboxSize(){
	const side = dummy1.clientHeight + "px";
	const checkboxes = document.getElementsByClassName("checkboxUnchecked");
	for (i = 0; i < checkboxes.length; i++){
		checkboxes[i].style.width = side;
		checkboxes[i].style.height = side;
	}
}
function updateIndicator(indicator, state){
	if (state){
		indicator.style.backgroundImage = images.circle_yes;
	} else {
		indicator.style.backgroundImage = images.circle_no;
	}
	updateIndicatorPosition(indicator);
}
function updateIndicatorPosition(indicator){
	const bbox = indicator.trueParent.getBoundingClientRect();
	const side = Math.round(bbox.height * 0.8);
	indicator.style.width = side + "px";
	indicator.style.height = side + "px";
	indicator.style.left = (bbox.right - side - 10) + "px";
	indicator.style.top = (bbox.top + bbox.height * 0.1) + "px";
	indicator.style.display = "block";
}
function resize(){
	w = window.innerWidth - 16;
	h = window.innerHeight - gameInfoDiv.getBoundingClientRect().height - 16;
	canvas.width = w;
	canvas.height = h;
	
	const bbox = canvas.getBoundingClientRect();
	bboxLeft = bbox.left;
	bboxTop = bbox.top;

	redraw = true;
	for (const indicator of indicators){
		updateIndicatorPosition(indicator);
	}

	spectatorAlert.style.top = (bboxTop + 25) + "px";

	$("winAnnouncer").style.top = (bboxTop + h * 0.5) + "px";
	$("winAnnouncer").style.left = (bboxLeft + w * 0.5) + "px";

	updateProfilePhotoSize();

	updateCheckboxSize();
}


//-------------------------------------
//---------------MAIN MENU-------------
//-------------------------------------

function newGameDisplay(){
	div_joinGame.style.display = "none";
	div_newGame.style.display = "flex";
	indicator_joinGameName.style.display = "none";
	input_newGameName.value = "";
	input_newGamePlayer.value = "";
	cycler_winCondition.cycleIndex = 0;
	cycler_winCondition.firstChild.textContent = cycler_winCondition.choicesDisplay[0];
	cycler_playableArea.cycleIndex = 0;
	cycler_playableArea.firstChild.textContent = cycler_playableArea.choicesDisplay[0];
	
	openPopup(div_newGame);
}
function joinGameDisplay(){
	div_newGame.style.display = "none";
	div_joinGame.style.display = "flex";
	indicator_newGameName.style.display = "none";
	indicator_newGamePlayer.style.display = "none";
	input_joinGameName.value = "";

	openPopup(div_joinGame);
}
function openProfileEditor(){
	openPopup(profileEditor);

	socket.send(JSON.stringify({
		action: "selfInfo",
		loopback: "editor"
	}));
}

//------------SETTINGS-----------------

function changePassword(oldPass, newPass){
	sandwichSetText("changing password");
	sandwichIn();

	authRequestJSON("POST", "/api/auth/changepassword", {oldPassword: oldPass, newPassword: newPass}, (res) => {
		if (res.status === 200){
			user.refreshToken = res.body.refreshToken;
			
			if (localStorage.getItem("reftok") !== null){
				localStorage.setItem("reftok", res.body.refreshToken);
			}

			sandwichSetText("password changed");
			sandwichEndLoading(true);
		} else {
			sandwichEndLoading(false);
			if (res.status === 403){
				sandwichSetText("wrong password");
			} else if (res.status === 400 && res.body.message === "password is too short, min. 6 characters"){
				sandwichSetText("password too short, min. 6 characters");
			} else {
				sandwichSetText("unknown error, try again later");
			}
		}
		
		sandwichOut(1500);
	});
}
function logOut(){
	localStorage.removeItem("id");
	localStorage.removeItem("reftok");
	location.reload();
}
function logOutEverywhere(){
	authRequestJSON("POST", "/api/auth/resetrefreshtoken", {}, (res) => {
		if (res.status === 200){
			logOut();
		}
	});
}

//-------------PROFILE EDITOR----------

function fillProfileEditor(payload){
	profileEditorPhoto.src = payload.photoUrl;

	profileEditorUsername.textContent = payload.username;
	profileEditorPoints.textContent = "total points: " + payload.totalPoints;

	profileEditorRegistered.textContent = "registered " + new Date(payload.createdAt).toLocaleDateString();

	profileEditor.style.borderColor = payload.color;
	profileEditor.style.boxShadow = "0 0 12px 8px " + payload.color + "60";

	const chosenPhoto = $(payload.photoHint);
	if (chosenPhoto !== null){
		chosenPhoto.setAttribute("selected", "true");
	}

	colorPicker.setHex(payload.color);
	colorManualHex.value = payload.color;
}
function choosePhoto(name){
	authRequestJSON("POST", "/api/auth/choosephoto", {image: name}, (res) => {
		if (res.status === 200){
			profileEditorPhoto.src = "/api/photo?user=" + user.id + "&cb=" + Date.now();
			for (const photo of document.getElementsByClassName("photoChoice")){
				if (photo.id === name){
					photo.setAttribute("selected", "true");
				} else {
					photo.setAttribute("selected", "false");
				}
			}
		}
	});
}
function uploadPhoto(){
	let photo = $("fileUpload").files[0];  // file from input
	let formData = new FormData();
	formData.append("photo", photo);

	authRequest("POST", "/api/auth/uploadphoto", formData, (res) => {
		if (res.status === 200){
			profileEditorPhoto.src = "/api/photo?user=" + user.id + "&cb=" + Date.now();
			for (const photo of document.getElementsByClassName("photoChoice")){
				photo.setAttribute("selected", "false");
			}
		}
	});
}
function setColor(){
	authRequestJSON("POST", "/api/auth/setColor", {color: $("colorManualHex").value}, (res) => {
		//some feedback would be useful?
	});
}

//--------CREATE AND JOIN GAME---------

function createGame(){
	socket.send(JSON.stringify({
		action: "newGame",
		name: input_newGameName.value,
		player1: input_newGamePlayer.value,
		playableArea: cycler_playableArea.choicesData[cycler_playableArea.cycleIndex],
		winCondition: cycler_winCondition.choicesData[cycler_winCondition.cycleIndex],
		spectable: checkbox_spectable.checked,
		sendInvite: $("sendInvite").checked
	}));
	sandwichSetText("creating");
	sandwichIn();
}
function join(name){
	socket.send(JSON.stringify({
		action: "joinGame",
		name: name
	}));
	sandwichSetText("joining");
	sandwichIn();
}
function joinGame(payload){
	mainMenu.animate([{opacity: 1}, {opacity: 0}], {duration: 500});
	indicator_joinGameName.style.display = "none";
	indicator_newGameName.style.display = "none";
	indicator_newGamePlayer.style.display = "none";
	setTimeout(() => {
		mainMenu.style.display = "none";
		gamediv.animate([{opacity: 0}, {opacity: 1}], {duration: 500});
		gamediv.style.display = "flex";
		resize(); //to recalculate bbox
	}, 480);
	loadGame(payload);
}

function gameExists(name, source){
	socket.send(JSON.stringify({
		action: "gameExists",
		name: name,
		loopback: source
	}));
}
function playerInfo(name, source){
	socket.send(JSON.stringify({
		action: "playerInfo",
		name: name,
		loopback: source
	}));
}

//--------PROFILE VIEWER---------------

function displayProfileByID(ID){
	socket.send(JSON.stringify({
		action: "playerInfoByID",
		ID: ID,
		loopback: "profile"
	}));

	openPopup(profileViewer);

	updateProfilePhotoSize();

	updateCheckboxSize();
	
	profileViewer.style.display = "flex";
}
function createLastSeenString(lastSeen){
	let lastSeenString;
	if (lastSeen === 0){
		lastSeenString = "online now";
	} else {
		lastSeenString = "last seen ";
		const difference = Date.now() - lastSeen;
		if (difference < 60 * 1000){
			lastSeenString += "less than a minute ago";
		} else if (difference < 60 * 60 * 1000){
			const minutes = Math.floor(difference / (60 * 1000));
			if (minutes === 1){
				lastSeenString += "1 minute ago";
			} else {
				lastSeenString += minutes + " minutes ago";
			}
		} else if (difference < 24 * 60 * 60 * 1000){
			const hours = Math.floor(difference / (60 * 60 * 1000));
			if (hours === 1){
				lastSeenString += "1 hour ago";
			} else {
				lastSeenString += hours + " hours ago";
			}
		} else {
			const days = Math.floor(difference / (24 * 60 * 60 * 1000));
			if (days === 1){
				lastSeenString += "1 day ago";
			} else {
				lastSeenString += days + " days ago";
			}
		}
	}
	
	return lastSeenString;
}
function fillProfile(payload){
	profilePhoto.src = payload.photoUrl;

	profileUsername.textContent = payload.username;
	profilePoints.textContent = "total points: " + payload.totalPoints;
	
	profileLastSeen.textContent = createLastSeenString(payload.lastSeen);

	profileRegistered.textContent = "registered " + new Date(payload.createdAt).toLocaleDateString();

	profileViewer.style.borderColor = payload.color;
	profileViewer.style.boxShadow = "0 0 12px 8px " + payload.color + "60";
}

//------------INVITES------------------

let blockedInvites = Object.create(null);
let inviteObj;

function displayInvite(payload){
	if (typeof blockedInvites[payload.from] === "undefined"){
		openPopup($("invite"))

		inviteObj = {
			from: payload.from,
			game: payload.game
		};

		$("inviteText").textContent = payload.from + " has invited you to game " + payload.game + "!";
	}
}
function acceptInvite(){
	closePopup($("invite"));

	join(inviteObj.game);
}
function rejectInvite(){
	closePopup($("invite"));
}
function blockInvite(){
	closePopup($("invite"));

	blockedInvites[inviteObj.from] = true;
}

//--------ERROR HANDLING---------------

function handleError(payload){
	switch (payload.code){
		case "INVALID_JSON":
			displayError("game sent invalid JSON to The Server", "FATAL");
			break;
		case "WRONG_TYPES":
			displayError("game sent invalid request to The Server - wrong types", "FATAL");
			break;
		case "AUTH_FAIL":
			displayError("socket authentication failed after", "FATAL");
			break;
		case "OWN_READONLY":
			displayError("attempted to authenticate an already authenticated socket", "FATAL");
			break;
		case "NO_AUTH":
			displayError("attempted to execute a permissive action through an unauthenticated socket", "FATAL");
			break;
		case "NOT_ON_TURN":
			displayError("desynchronized - attempted to make a turn without being your turn", "DESYNC");
			break;
		case "GAME_ENDED":
			displayError("desynchronized - attempted to make a turn after the game ended", "DESYNC");
			break;
		case "AREA_RESTRICTED":
			displayError("desynchronized - attempted to make a turn outside the playable area", "DESYNC");
			break;
		case "TILE_FILLED":
			displayError("desynchronized - attempted to make a turn on a filled field", "DESYNC");
			break;
		case "GAME_NOT_FOUND":
			displayError("failed to make a move - The Server couldn't recognize the game", "DESYNC");
			break;
		case "JOIN_GAME_NOT_FOUND":
			sandwichEndLoading(false);
			sandwichSetText("game not found");
			sandwichOut(1200);
			break;
		case "GAME_ACCESS_DENIED":
			displayError("unable to join the game - spectating is not allowed and you are not one of the two players", "INFO");
			sandwichEndLoading(false);
			sandwichSetText("access to the game denied");
			sandwichOut(1200);
			break;
		case "ILLEGAL_GAME_NAME":
			if (payload.description === "illegal game name, contains /"){
				displayError("unable to create a game - name may not contain a slash '/'", "INFO");
			} else if (payload.description === "illegal game name, __proto__ is banned"){
				displayError("unable to create a game - name '__proto__' is banned", "INFO");
			} else {
				displayError("unable to create a game - name is illegal", "INFO");
			}
			sandwichEndLoading(false);
			sandwichSetText("illegal name");
			sandwichOut(1200);
			break;
		case "GAME_ALREADY_EXISTS":
			sandwichEndLoading(false);
			sandwichSetText("game already exists");
			sandwichOut(1200);
			break;
		case "OPPONENT_NOT_FOUND":
			sandwichEndLoading(false);
			sandwichSetText("other player not found");
			sandwichOut(1200);
			break;
		default:
			displayError("the error is unknown - The Server may have crashed or just went crazy. Error code is " + payload.code, "FATAL");
	}
}
function displayError(description, type){
	$("errorDesc").textContent = description;

	switch (type){
		case "FATAL":
			$("errorClose").style.display = "none";
			$("errorButton").textContent = "restart game";
			$("errorButton").onclick = location.reload;
			break;
		case "DESYNC":
			$("errorClose").style.display = "none";
			$("errorButton").textContent = "main menu";
			$("errorButton").onclick = () => {
				exitGame();
				closePopup($("error"));
			};
			break;
		case "INFO":
			$("errorClose").style.display = "block";
			$("errorButton").textContent = "ok";
			$("errorButton").onclick = () => {
				closePopup($("error"));
			};
	}

	openPopup($("error"));
}

//-------------------------------------
//------NETWORK + ACCOUNTS-------------
//-------------------------------------

var socket;
var user;

function autoLogin(){
	const id = Number(localStorage.getItem("id"));
	const refreshToken = localStorage.getItem("reftok");
	if (id !== null && refreshToken !== null){
		sandwichIn();
		sandwichSetText("logging in");
		request("POST", "/api/refreshtoken", JSON.stringify({
			id: id,
			refreshToken: refreshToken
		}),
		(res) => {
			if (res.status === 200){
				user = {
					id: res.body.id,
					username: res.body.username,
					token: res.body.token,
					exp: res.body.exp,
					refreshToken: res.body.refreshToken
				};

				createSocket(res.body.token);

				sandwichSetText("logged in");
				sandwichEndLoading(true);
			} else {
				if (res.status === 403){
					sandwichSetText("autologin failed");
				} else if (res.status === 404){
					sandwichSetText("autologin: user not found");
				} else {
					sandwichSetText("autologin: unknown error");
				}
				sandwichEndLoading(false);

				localStorage.removeItem("id");
				localStorage.removeItem("reftok");
				
				authBox.style.display = "flex";
				authBox.animate([{opacity: 0}, {opacity: 1}], {duration: 600});
			}

			sandwichOut(1200);
		});
	} else {
		authBox.style.display = "flex";
		authBox.animate([{opacity: 0}, {opacity: 1}], {duration: 500});
	}
}
function LoginUser(username, password, autologin){
	sandwichSetText("logging in")
	sandwichIn();
	request("POST", "/api/login", JSON.stringify({
		username: username,
		password: password
	}),
	(res) => {
		if (res.status === 200){
			user = {
				id: res.body.id,
				username: res.body.username,
				token: res.body.token,
				exp: res.body.exp,
				refreshToken: res.body.refreshToken
			};

			setTimeout(() => {authBox.style.display = "none"}, 500);
			authBox.animate([{opacity: 1}, {opacity: 0}], {duration: 500});

			createSocket(res.body.token);

			if (autologin){
				localStorage.setItem("id", res.body.id);
				localStorage.setItem("reftok", res.body.refreshToken);
			}
		} else if (res.status === 404){
			sandwichSetText("user not found");
			sandwichEndLoading(false);
			sandwichOut(1200);
		} else if (res.status === 403){
			sandwichSetText("wrong password");
			sandwichEndLoading(false);
			sandwichOut(1200);
		}
	});
}
function RegisterNewUser(username, password, email, autologin){
	sandwichSetText("registering");
	sandwichIn();

	request("POST", "/api/register", JSON.stringify({
		username: username,
		password: password,
		email: email
	}),
	(res) => {
		if (res.status === 200){
			LoginUser(username, password, autologin);
		} else {
			if (res.status === 403){
				switch (res.body.message){
					case "username taken":
						sandwichSetText("username taken");
						break;
					case "email taken":
						sandwichSetText("email taken");
						break;
				}
			} else if (res.status === 400){
				switch (res.body.message){
					case "username is too long, max. 20 characters":
						sandwichSetText("username too long, max. 20 characters");
						break;
					case "username is too short, min. 3 characters":
						sandwichSetText("username too short, min. 3 characters");
						break;
					case "password is too short, min. 6 characters":
						sandwichSetText("password too short, min. 6 characters");
						break;
					case "email is too long, max. 80 characters":
						sandwichSetText("email too long, max. 80 characters");
						break;
					default:
						sandwichSetText("unknown error, try again later");
				}
			} else {
				sandwichSetText("unknown error, try again later");
			}
			sandwichEndLoading(false);
			sandwichOut(2000);
		} 
	});
}
function createSocket(token){
	if (typeof socket !== "undefined"){
		socket.close();
	}
	socket = new WebSocket("wss://" + location.host + "/socket");
	socket.addEventListener("open", (event) => {
		socket.send(JSON.stringify({
			action: "own",
			token: token
		}));
	});

	socket.addEventListener("close", (event) => {
		openPopup($("connectionLost"));
	});

	socket.addEventListener("message", (event) => {
		console.log("Message from The Server ", event.data);
		const payload = JSON.parse(event.data);
		switch (payload.action){
			case "logged":
				sandwichSetText("logged in");
				sandwichEndLoading(true);
				sandwichOut(1200);

				setTimeout(() => {
					mainMenu.style.display = "flex";
					mainMenu.animate([{opacity: 0}, {opacity: 1}], {duration: 500});
				}, 500);
				break;
			case "gameExists":
				if (payload.loopback === "new"){
					updateIndicator(indicator_newGameName, !payload.exists);
				} else if (payload.loopback === "join"){
					updateIndicator(indicator_joinGameName, payload.exists);
				}
				break;
			case "playerInfo":
				if (payload.loopback === "new"){
					updateIndicator(indicator_newGamePlayer, payload.exists);
				} else if (payload.loopback === "profile"){
					fillProfile(payload);
				}
				break;
			case "playerInfoByID":
				if (payload.loopback === "p0"){
					updatep0Info(payload.username, payload.photoUrl, payload.color);
				} else if (payload.loopback === "p1"){
					updatep1Info(payload.username, payload.photoUrl, payload.color);
				} else if (payload.loopback === "profile"){
					fillProfile(payload);
				}
				break;
			case "selfInfo":
				if (payload.loopback === "editor"){
					fillProfileEditor(payload);
				}
				break;
			case "gameCreated":
				closePopup(div_newGame);
				
				sandwichSetText("game created");
				sandwichEndLoading(true);
				sandwichOut(1200);
				joinGame(payload);
				break;
			case "joinGame":
				closePopup(div_joinGame);

				sandwichSetText("joined game");
				sandwichEndLoading(true);
				sandwichOut(1200);
				joinGame(payload);
				break;
			case "announceMove":
				moveAnnounced(payload);
				break;
			case "announceLine":
				lineAnnounced(payload);
				break;
			case "invite":
				displayInvite(payload);
				break;
			case "error":
				handleError(payload);
		}
	});
}


function request(type, url, body, callback){
	let xhr = new XMLHttpRequest();
	xhr.open(type, url, true);

	xhr.setRequestHeader("Content-Type", "application/json");

	xhr.onreadystatechange = function(){
		if (this.readyState === XMLHttpRequest.DONE){
			callback({
				body: JSON.parse(this.response),
				status: this.status
			});
		}
	}
	xhr.send(body);
}

function refreshTokenSilent(){
	return new Promise((resolve, reject) => {
		request("POST", "/api/refreshtoken", JSON.stringify({id: user.id, refreshToken: user.refreshToken}), (res) => {
			if (res.status === 403){
				logOut();
			} else if (res.status === 200){
				user = {
					id: res.body.id,
					username: res.body.username,
					token: res.body.token,
					exp: res.body.exp,
					refreshToken: res.body.refreshToken
				};
			}
			resolve();
		});
	});
}
async function authRequestJSON(type, url, body, callback){
	if (user.exp < Date.now()){
		await refreshTokenSilent();
	}
	
	let xhr = new XMLHttpRequest();
	xhr.open(type, url, true);

	xhr.setRequestHeader("Content-Type", "application/json");
	
	xhr.setRequestHeader("token", user.token);

	xhr.onreadystatechange = function(){
		if (this.readyState === XMLHttpRequest.DONE){
			callback({
				body: JSON.parse(this.response),
				status: this.status
			});
		}
	}
	xhr.send(JSON.stringify(body));
}
async function authRequest(type, url, body, callback){
	if (user.exp < Date.now()){
		await refreshTokenSilent();
	}
	
	let xhr = new XMLHttpRequest();
	xhr.open(type, url, true);

	xhr.setRequestHeader("token", user.token);

	xhr.onreadystatechange = function(){
		if (this.readyState === XMLHttpRequest.DONE){
			callback({
				body: JSON.parse(this.response),
				status: this.status
			});
		}
	}
	xhr.send(body);
}

let loadLength = 0;
let loadProgress = 0;
let filesFinished = 0;

function getImage(url, propertyName){
	let xhr = new XMLHttpRequest();
	let previousProgress = 0;
	let lengthAdded = false;

	const urlCreator = window.URL || window.webkitURL;
	
	xhr.open("GET", url, true);
	xhr.responseType = "blob";

	xhr.addEventListener("progress", (event) => {
		if (event.lengthComputable) {
			if (!lengthAdded){
				loadLength += event.total;
				lengthAdded = true;
			}
			loadProgress += event.loaded - previousProgress;
			previousProgress = event.loaded;

			const progressPercent = (loadProgress / loadLength * 100);

			progressBar.style.width = progressPercent + "%";
			span_loading.textContent = "loading game... " + progressPercent.toFixed(2) + "%";
		} else {
			console.log("FIX YOUR SERVER! SEND CONTENT-LENGTH HEADER!!");
		}
	});

	xhr.onload = function(event){
		images[propertyName] = "url(" + urlCreator.createObjectURL(this.response) + ")";
		filesFinished++;
		if (fileCount === filesFinished){
			loadingFinished();
		}
	};

	xhr.send();
}
function urlToSrcString(url){
	return url.substring(4, images.checkmark.length - 1);
}
function loadingFinished(){
	autoLogin();

	document.body.style.backgroundImage = images.background;

	const closes = document.getElementsByClassName("close");
	for (i = 0; i < closes.length; i++){
		closes[i].style.backgroundImage = images.closeButtonX;
	}

	const buttons = document.getElementsByClassName("button");
	for (i = 0; i < buttons.length; i++){
		buttons[i].style.backgroundImage = images.dotRepeat;
	}
	$("winAnnouncer").style.backgroundImage = images.dotRepeat;

	const checkmarks = document.getElementsByClassName("checkmark");
	for (i = 0; i < checkmarks.length; i++){
		checkmarks[i].src = urlToSrcString(images.checkmark);
	}

	$("boy1").src = urlToSrcString(images.boy1);
	$("boy2").src = urlToSrcString(images.boy2);
	$("boy3").src = urlToSrcString(images.boy3);
	$("girl1").src = urlToSrcString(images.girl1);
	$("girl2").src = urlToSrcString(images.girl2);
	$("girl3").src = urlToSrcString(images.girl3);

	$("aboutUPJS").src = urlToSrcString(images.UPJS);
	
	for (const eye of document.getElementsByClassName("eye")){
		eye.src = urlToSrcString(images.eye_open);
		const height = $("dummyInput").clientHeight * 0.8;
		eye.style.height = height + "px";
		eye.style.marginLeft = -1.8 * height + "px";
		eye.style.marginRight = "10px";
	}

	setTimeout(() => {overlay.style.display = "none";}, 600);
	overlay.animate([{opacity: 0.6}, {opacity: 0}], {duration: 600});
	overlay.style.opacity = 0;

	setTimeout(() => {div_loading.style.display = "none";}, 600);
	div_loading.style.opacity = 0;
	div_loading.animate([{transform: "scale(1) translate(-50%, -50%)", opacity: 1}, {transform: "scale(4) translate(-50%, -50%)", opacity: 0}], {duration: 600});
}
var images = {};
const fileCount = 19;
getImage("img/background1.png", "background");
getImage("img/circleYES.png", "circle_yes");
getImage("img/circleNO.png", "circle_no");
getImage("img/dotRepeat.png", "dotRepeat");
getImage("img/closeButtonX.png", "closeButtonX");
getImage("img/checkmark.png", "checkmark");
getImage("img/boy1.png", "boy1");
getImage("img/boy2.png", "boy2");
getImage("img/boy3.png", "boy3");
getImage("img/girl1.png", "girl1");
getImage("img/girl2.png", "girl2");
getImage("img/girl3.png", "girl3");
getImage("img/eye_closed.png", "eye_closed");
getImage("img/eye_open.png", "eye_open");
getImage("img/crown0.png", "crown0");
getImage("img/crown1.png", "crown1");
getImage("img/crown2.png", "crown2");
getImage("img/crown3.png", "crown3");
getImage("img/upjs.png", "UPJS");

//-----------------------------------------------------------------
//-----------------------------------------------------------------
//-----------------------------GAME--------------------------------
//-----------------------------------------------------------------
//-----------------------------------------------------------------



var canvas = $("mainCanvas");
let ctx = canvas.getContext("2d");
let w, h, bboxLeft, bboxTop;
let xOffset = 0, yOffset = 0;
let prevX = 0, prevY = 0;
let mouseButton = false;
let isClick;
let tileSize = 30;
let redraw = true;
let breakMainLoop = false;

let gameName;
let players;
let p0_points = 0;
let p1_points = 0;
let p0_moves = [];
let p1_moves = [];
let lines = [];
let lastMove = null;
let turn;
let playableArea;
let winCondition;
let winnerCrown;
let winner = null;
let minPlayableX, maxPlayableX, minPlayableY, maxPlayableY;

let minX, maxX, minY, maxY;
let highlightedField = [-100, -100];


//loading stuff
function updatep0Info(name, photoUrl, color){
	info_p0_name.textContent = name;

	if (winner === 0 && players[winner] !== user.id){
		$("winner").textContent = name + " wins";
	}

	info_p0_photo.src = photoUrl + "&cb=" + Date.now();

	info_p0_turnIndicator.style.background = "radial-gradient(farthest-side at 0px 0px, " + color + "90, transparent)";
}
function updatep1Info(name, photoUrl, color){
	info_p1_name.textContent = name;

	if (winner === 1 && players[winner] !== user.id){
		$("winner").textContent = name + " wins";
	}

	info_p1_photo.src = photoUrl + "&cb=" + Date.now();

	info_p1_turnIndicator.style.background = "radial-gradient(farthest-side at 100% 0px, " + color + "90, transparent)";
}
function updateScore(){
	info_p0_points.textContent = p0_points + (p0_points === 1 ? " point" : " points");
	info_p1_points.textContent = p1_points + (p1_points === 1 ? " point" : " points");
}
function loadGame(payload){
	let game = payload.game;
	
	socket.send(JSON.stringify({
		action: "listen",
		game: game.name
	}));

	xOffset = 0;
	yOffset = 0;
	gameName = game.name;
	players = [game.player0, game.player1];
	p0_points = game.p0_points;
	p1_points = game.p1_points;
	p0_moves = game.p0_moves;
	p1_moves = game.p1_moves;
	lines = game.lines;
	lastMove = game.lastMove;
	turn = game.turn;
	winCondition = game.winCondition;
	winnerCrown = game.winnerCrown;

	winner = null;

	playableArea = game.playableArea;
	if (playableArea !== -1){
		minPlayableX = 0;
		maxPlayableX = game.playableArea - 1;
		minPlayableY = 0;
		maxPlayableY = game.playableArea - 1;
	}
	
	$("game_name").textContent = game.name;

	let winConditionString;
	if (game.winCondition === -1){
		winConditionString = "game never ends";
	} else if (game.winCondition === 1){
		winConditionString = "first to 1 pt wins";
	} else {
		winConditionString = "first to " + game.winCondition + " pts wins";
	}
	$("game_winCondition").textContent = winConditionString;
	
	

	redraw = true;
	breakMainLoop = false;

	if (turn === 0){
		info_p0_turnIndicator.style.opacity = 1;
		info_p1_turnIndicator.style.opacity = 0;
	} else {
		info_p0_turnIndicator.style.opacity = 0;
		info_p1_turnIndicator.style.opacity = 1;
	}

	if (players[0] === user.id || players[1] === user.id){
		spectatorAlert.style.display = "none";
	} else {
		spectatorAlert.style.display = "block";
	}
	
	socket.send(JSON.stringify({
		action: "playerInfoByID",
		ID: players[0],
		loopback: "p0"
	}));
	socket.send(JSON.stringify({
		action: "playerInfoByID",
		ID: players[1],
		loopback: "p1"
	}));
	updateScore();
	frame();
	checkWin();
}
//input processing
function zoom(event){
	const prevTileSize = tileSize;
	tileSize += Math.sign(event.wheelDeltaY);
	if (tileSize < 15){
		tileSize = 15;
	} else if (tileSize > 80){
		tileSize = 80;
	}

	const multiplier = tileSize / prevTileSize;

	xOffset = Math.round((xOffset - event.offsetX) * multiplier) + event.offsetX;
	yOffset = Math.round((yOffset - event.offsetY) * multiplier) + event.offsetY;

	redraw = true;
}
function mouseUp(event){
	mouseButton = false;
	if (isClick){
		handleClick(event.clientX, event.clientY);
	}
}
function touchUp(event){
	mouseButton = false;
	if (isClick){
		handleClick(event.changedTouches[0].clientX, event.changedTouches[0].clientY);
	}
}
function mouseDown(){
	mouseButton = true;
	isClick = true;
}

function touchDown(event){
	const touchX = event.touches[0].clientX;
	const touchY = event.touches[0].clientY;
	
	mouseButton = true;
	isClick = true;
	prevX = touchX;
	prevY = touchY;

	const newHighlightedField = screenToGrid(touchX, touchY);
	if (! (newHighlightedField[0] === highlightedField[0] && newHighlightedField[1] === highlightedField[1])){
		coordinates.textContent = "x: " + newHighlightedField[0] + ", y: " + newHighlightedField[1];
		highlightedField = newHighlightedField;
		redraw = true;
	}
}
function mouseMove(event){
	if (mouseButton){
		xOffset += event.clientX - prevX;
		yOffset += event.clientY - prevY;
		redraw = true;
		isClick = false;
	}
	
	const newHighlightedField = screenToGrid(event.clientX, event.clientY);
	if (! (newHighlightedField[0] === highlightedField[0] && newHighlightedField[1] === highlightedField[1])){
		coordinates.textContent = "x: " + newHighlightedField[0] + ", y: " + newHighlightedField[1];
		highlightedField = newHighlightedField;
		redraw = true;
	}

	prevX = event.clientX;
	prevY = event.clientY;
}
document.onmousemove = mouseMove;

function touchMove(event){
	const touchX = event.touches[0].clientX;
	const touchY = event.touches[0].clientY;
	if (mouseButton){
		xOffset += touchX - prevX;
		yOffset += touchY - prevY;
		redraw = true;
		isClick = false; 
	}

	const newHighlightedField = screenToGrid(touchX, touchY);
	if (! (newHighlightedField[0] === highlightedField[0] && newHighlightedField[1] === highlightedField[1])){
		highlightedField = newHighlightedField;
		redraw = true;
	}

	prevX = touchX;
	prevY = touchY;
}
document.ontouchmove = touchMove;

function screenToGrid(xScreen, yScreen){
	const x = Math.floor((xScreen - bboxLeft - xOffset) / tileSize);
	const y = Math.floor((yScreen - bboxTop - yOffset) / tileSize);
	return [x, y];
}
function handleClick(xScreen, yScreen){
	tryMove(...screenToGrid(xScreen, yScreen));
}
//rendering
function line(x1, y1, x2, y2){
	ctx.moveTo(x1, y1);
	ctx.lineTo(x2, y2);
}
function circle(x, y, radius){
	ctx.moveTo(x + radius, y);
	ctx.arc(x, y, radius, 0, 2 * Math.PI);
}
function graphics_grid(){
	ctx.beginPath();
	const limitX = w + xOffset % tileSize + tileSize;
	const limitY = h + yOffset % tileSize + tileSize;
	for (x = xOffset % tileSize; x < limitX; x += tileSize){
		line(x, 0, x, h);
	}
	for (y = yOffset % tileSize; y < limitY; y += tileSize){
		line(0, y, w, y);
	}
	ctx.stroke();
}
function graphics_circles(){
	ctx.beginPath();
	for (var i = 0; i < p0_moves.length; i++){
		const x = p0_moves[i][0];
		const y = p0_moves[i][1];
		if (x >= minX && x <= maxX && y >= minY && y <= maxY){
			circle(x * tileSize + xOffset + tileSize * 0.5, y * tileSize + yOffset + tileSize * 0.5, tileSize * 0.35);
		}
	}
	ctx.stroke();
}
function graphics_crosses(){
	ctx.beginPath();
	const left = xOffset + tileSize * 0.15;
	const right = xOffset + tileSize * 0.85;
	const up = yOffset + tileSize * 0.15;
	const down = yOffset + tileSize * 0.85;

	for (var i = 0; i < p1_moves.length; i++){
		const x = p1_moves[i][0];
		const y = p1_moves[i][1];
		if (x >= minX && x <= maxX && y >= minY && y <= maxY){
			const trueX = x * tileSize;
			const trueY = y * tileSize;
			line(trueX + left, trueY + up, trueX + right, trueY + down);
			line(trueX + right, trueY + up, trueX + left, trueY + down);
		}
	}
	ctx.stroke();
}
function graphics_lines(){
	ctx.beginPath();
	const minXline = minX - 4;
	const maxXline = maxX + 4;
	const minYline = minY - 4;
	const maxYline = maxY + 4;
	for (var i = 0; i < lines.length; i++){
		const x = lines[i][0];
		const y = lines[i][1];
		const direction = lines[i][2];
		if (x >= minXline && x <= maxXline && y >= minYline && y <= maxYline){
			switch (direction){
			case 0:
				line((x + 0.32) * tileSize + xOffset, (y + 0.68) * tileSize + yOffset, (x + 4.68) * tileSize + xOffset, (y - 3.68) * tileSize + yOffset);
				break;
			case 1:
				line((x + 0.32) * tileSize + xOffset, (y + 0.5) * tileSize + yOffset, (x + 4.68) * tileSize + xOffset, (y + 0.5) * tileSize + yOffset);
				break;
			case 2:
				line((x + 0.32) * tileSize + xOffset, (y + 0.32) * tileSize + yOffset, (x + 4.68) * tileSize + xOffset, (y + 4.68) * tileSize + yOffset);
				break;
			case 3:
				line((x + 0.5) * tileSize + xOffset, (y + 0.32) * tileSize + yOffset, (x + 0.5) * tileSize + xOffset, (y + 4.68) * tileSize + yOffset);
				break;
			}
		}
	}
	ctx.stroke();
}
function graphics_lastMove(){
	if (lastMove !== null){
		ctx.beginPath();
		const x = lastMove[0] * tileSize + xOffset;
		const y = lastMove[1] * tileSize + yOffset;
		ctx.rect(x, y, tileSize, tileSize);
		ctx.fill();
	}
}
function graphics_highlight(){
	ctx.beginPath();
	const x = highlightedField[0] * tileSize + xOffset;
	const y = highlightedField[1] * tileSize + yOffset;
	ctx.rect(x, y, tileSize, tileSize);
	ctx.fill();
}
function graphics_walls(){
	ctx.beginPath();
	if (playableArea !== -1){
		if (minPlayableX > minX){
			ctx.rect(0, 0, minPlayableX * tileSize + xOffset, h);
		}
		if (maxPlayableX < maxX){
			const x = (maxPlayableX + 1) * tileSize + xOffset;
			ctx.rect(x, 0, w - x, h);
		}
		if (minPlayableY > minY){
			ctx.rect(0, 0, w, minPlayableY * tileSize + yOffset);
		}
		if (maxPlayableY < maxY){
			const y = (maxPlayableY + 1) * tileSize + yOffset;
			ctx.rect(0, y, w, h - y);
		}
	}
	ctx.fill();
}
//gameworks
function tryMove(x, y){
	isClick = false;

	if (players[turn] !== user.id){
		return;
	}

	if (winCondition !== -1){
		if (p0_points >= winCondition || p1_points >= winCondition){
			return;
		}
	}

	if (playableArea !== -1){
		if (x < minPlayableX || x > maxPlayableX || y < minPlayableY || y > maxPlayableY){
			return
		}
	}
	
	for (let i = 0; i < p0_moves.length; i++){
		if (p0_moves[i][0] === x && p0_moves[i][1] === y){
			return;
		}
	}
	for (let i = 0; i < p1_moves.length; i++){
		if (p1_moves[i][0] === x && p1_moves[i][1] === y){
			return;
		}
	}
	
	let moves = turn === 0 ? p0_moves : p1_moves;
	moves.push([x, y]);
	redraw = true;
	
	if (turn === 0){
		turn = 1;
	} else {
		turn = 0;
	}

	socket.send(JSON.stringify({
		action: "move",
		game: gameName,
		move: [x, y]
	}));
}
function moveAnnounced(payload){
	if (payload.game === gameName){
		lastMove = payload.move;
		if (payload.player === 0){
			info_p0_turnIndicator.style.opacity = 0;
			info_p1_turnIndicator.style.opacity = 1;
		} else {
			info_p0_turnIndicator.style.opacity = 1;
			info_p1_turnIndicator.style.opacity = 0;
		}

		if (players[payload.player] !== user.id){
			if (payload.player === 0){
				p0_moves.push(payload.move);
				turn = 1;
			} else {
				p1_moves.push(payload.move);
				turn = 0;
			}
		}
		redraw = true;
	} else {
		console.log("Listeners broke, got announce from a different game");
	}
}
function lineAnnounced(payload){
	if (payload.game === gameName){
		lines.push(payload.line);
		redraw = true;
		if (payload.player === 0){
			p0_points++;
		} else {
			p1_points++;
		}
		updateScore();
		checkWin();
	} else {
		console.log("Listeners broke, got announce line from a different game");
	}
}
function checkWin(){
	if (winCondition !== -1){
		if (p0_points >= winCondition){
			winner = 0;

			const winAnnouncer = $("winAnnouncer");
			winAnnouncer.style.display = "flex";
			winAnnouncer.animate([{transform: "scale(0) translate(-50%, -50%)", opacity: 0}, {transform: "scale(1) translate(-50%, -50%)", opacity: 1}], {duration: 200});
			
			$("crown").src = urlToSrcString(images["crown" + winnerCrown]);

			let winnerString;
			if (players[0] === user.id){
				winnerString = "you win";
			} else {
				winnerString = info_p0_name.textContent + " wins";
			}
			$("winner").textContent = winnerString;
		} else if (p1_points >= winCondition){
			winner = 1;
			
			const winAnnouncer = $("winAnnouncer");
			winAnnouncer.style.display = "flex";
			winAnnouncer.animate([{transform: "scale(0) translate(-50%, -50%)", opacity: 0}, {transform: "scale(1) translate(-50%, -50%)", opacity: 1}], {duration: 200});
			
			$("crown").src = urlToSrcString(images["crown" + winnerCrown]);

			let winnerString;
			if (players[1] === user.id){
				winnerString = "you win";
			} else {
				winnerString = info_p1_name.textContent + " wins";
			}
			$("winner").textContent = winnerString;
		}
	}
}
function jumpToLastMove(){
	if (lastMove !== null){
		xOffset	= -(lastMove[0] * tileSize) - 0.5 * tileSize + w * 0.5;
		yOffset	= -(lastMove[1] * tileSize) - 0.5 * tileSize + h * 0.5;
		redraw = true;
	}
}
function exitGame(){
	socket.send(JSON.stringify({action: "unlisten"}));

	xOffset = 0; yOffset = 0;
	prevX = 0; prevY = 0;
	mouseButton = false;
	isClick = undefined;
	tileSize = 30;
	redraw = true;
	breakMainLoop = true;

	gameName = undefined;
	players = undefined;
	p0_points = 0;
	p1_points = 0;
	p0_moves = [];
	p1_moves = [];
	lines = [];
	lastMove = null;
	turn = undefined;
	playableArea = undefined;
	winCondition = undefined;
	winnerCrown = undefined;
	winner = null;
	minPlayableX = undefined; maxPlayableX = undefined; minPlayableY = undefined; maxPlayableY = undefined;

	minX = undefined; maxX = undefined; minY = undefined; maxY = undefined;
	highlightedField = [-100, -100];

	gamediv.animate([{opacity: 1, transform: "scale(1)"}, {opacity: 0, transform: "scale(0)"}], {duration: 300});
	$("winAnnouncer").animate([{opacity: 1, transform: "scale(1) translate(-50%, -50%)"}, {opacity: 0, transform: "scale(0) translate(-50%, -50%)"}], {duration: 300});
	setTimeout(() => {
		gamediv.style.display = "none";

		$("winAnnouncer").style.display = "none";

		mainMenu.animate([{opacity: 0}, {opacity: 1}], {duration: 300});
		mainMenu.style.display = "flex";
	}, 280);

	spectatorAlert.style.display = "none";
}
//main loop
function frame(){
	if (redraw){
		ctx.clearRect(0, 0, w, h);
		ctx.lineWidth = 1;

		ctx.fillStyle = "#fcac3480";
		graphics_lastMove();
		ctx.fillStyle = "#c0c0c060";
		graphics_highlight();

		ctx.fillStyle = "#afd24580";
		graphics_walls();

		ctx.strokeStyle = "#c0c0c0ff";
		graphics_grid();
		ctx.lineWidth = tileSize * 0.07;

		minX = Math.floor(-xOffset / tileSize);
		maxX = Math.floor((-xOffset + w) / tileSize);
		minY = Math.floor(-yOffset / tileSize);
		maxY = Math.floor((-yOffset + h) / tileSize);

		
		graphics_circles();
		graphics_crosses();
		ctx.strokeStyle = "#ff0000ff";
		graphics_lines();
		
		redraw = false;
	}
	if (breakMainLoop){
		breakMainLoop = false;
	} else {
		window.requestAnimationFrame(frame);
	}
}