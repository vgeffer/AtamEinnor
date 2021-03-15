function StartGame() {

    CreateWebSocket();
    

    GameRunning = true;
    requestAnimationFrame(NextFrame);
}