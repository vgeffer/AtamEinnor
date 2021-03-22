function OpenPopup(popupid) {
    document.getElementById(popupid).classList.remove('hidden');
}

function ClosePopup(popupid) {
    document.getElementById(popupid).classList.add('hidden');
}

function SaveSettings() {
    
    if((GameSettings.Desynchronize != $("Desynchronize").value || GameSettings.LowQualTextures != $("LowQualTextures").value) && GameRunning) {
        window.localStorage.setItem('OVERRIDE_REJOIN', "rejoin");
    }
    else if((GameSettings.Desynchronize != $("Desynchronize").value || GameSettings.LowQualTextures != $("LowQualTextures").value) && !GameRunning) {
        window.localStorage.setItem('OVERRIDE_REJOIN', "stay");
    }

    GameSettings.Desynchronize        = $("Desynchronize").checked;
    GameSettings.LowQualTextures      = $("LowQualTextures").checked;
    GameSettings.AutoReconect         = $("AutoReconect").checked;

    window.localStorage.setItem('GAMESETT', JSON.stringify(GameSettings));

    window.location = window.location;
}

function ResetStyle(element) {
    $(element).style = "";
}