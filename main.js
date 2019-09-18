const electron = require("electron");
let app =  electron.app


let win;
function createWindow() {
    win = new electron.BrowserWindow({
        width: 1100,
        height: 700,
        webPreferences: {
            nodeIntegration: true
        },
    });
    //swin.webContents.openDevTools()
    //win.maximize()
    win.loadFile('index.html');
    win.on('closed', function () {
        win = null;
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin')
        app.quit();
});
app.on('activate', function () {
    if (win === null)
        createWindow();
});

