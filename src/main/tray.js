import { Tray, Menu } from "electron";
import path from "path";

let tray = null;

export function createTray(mainWindow) {

    const iconPath = path.join(
        process.cwd(),
        "public",
        "codehud.png"
    );
    console.log(iconPath);
    tray = new Tray(iconPath);

    tray.on("click", () => {
        mainWindow.show();
        mainWindow.focus();
    });
    // tray.on("right-click",()=>{
    //     console.log("RIGHT CLICK")
    // })
    // tray.on("click", () => {
    // console.log("LEFT CLICK");
    // mainWindow.show();
    // mainWindow.focus();
    // });     
    const contextMenu = Menu.buildFromTemplate([
        {
            label: "Open Dashboard",
            click: () => {
                mainWindow.show();
                mainWindow.focus();
            }
        },
        {
            type: "separator"
        },
        {
            label: "Quit",
            click: () => {
                mainWindow.destroy();
            }
        }
    ]);

    tray.setToolTip("CodeHUD");
    // console.log("Tray created");
    tray.setContextMenu(contextMenu);
}