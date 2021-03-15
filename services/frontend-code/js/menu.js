function OpenPopup(popupid) {
    document.getElementById(popupid).classList.remove('hidden');
}

function ClosePopup(popupid) {
    document.getElementById(popupid).classList.add('hidden');
}

function SaveSettings() {
    
    if((GameSettings.Desynchronize != document.getElementById("Desynchronize").value || GameSettings.LowQualTextures != document.getElementById("LowQualTextures").value) && GameRunning) {
        window.localStorage.setItem('OVERRIDE_REJOIN', true);
    }

    GameSettings.Desynchronize        = document.getElementById("Desynchronize").checked;
    GameSettings.LowQualTextures      = document.getElementById("LowQualTextures").checked;
    GameSettings.AutoReconect         = document.getElementById("AutoReconect").checked;

    window.localStorage.setItem('GAMESETT', JSON.stringify(GameSettings));

    window.location = window.location;
}

function ResetStyle(element) {
    document.getElementById(element).style = "";
}