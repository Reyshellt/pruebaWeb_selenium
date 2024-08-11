const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');
const path = require('path');

// Crear la carpeta 'screenshots' si no existe
const baseDir = './screenshots';
if (!fs.existsSync(baseDir)){
    fs.mkdirSync(baseDir);
}

// Crear la subcarpeta 'loginTest' si no existe
const loginDir = path.join(baseDir, 'loginTest');
if (!fs.existsSync(loginDir)) {
    fs.mkdirSync(loginDir);
}

// Limpiar la carpeta 'loginTest' eliminando todos los archivos antiguos
function clearDirectory(dir) {
    fs.readdir(dir, (err, files) => {
        if (err) throw err;
        for (const file of files) {
            fs.unlink(path.join(dir, file), err => {
                if (err) throw err;
            });
        }
    });
}

// Ejecutar la limpieza de la carpeta
clearDirectory(loginDir);

// Configuración de las opciones del navegador
const options = new chrome.Options();

async function loginTest() {
    let driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();
    
    try {
        // 1. Abrir la página de inicio de sesión
        await driver.get('http://facturaweb.free.nf/index.php');
        await captureScreenshot(driver, '01_page_loaded.png');

        // 2. Encontrar el campo de usuario e ingresar el nombre de usuario
        await driver.findElement(By.name('nombre_usuario')).sendKeys('Usuario');
        await captureScreenshot(driver, '02_username_entered.png');

        // 3. Encontrar el campo de contraseña e ingresar la contraseña
        await driver.findElement(By.name('contrasena')).sendKeys('prueba01');
        await captureScreenshot(driver, '03_password_entered.png');

        // 4. Hacer clic en el botón de inicio de sesión
        await driver.findElement(By.name('btnIngresar')).click();
        await captureScreenshot(driver, '04_login_clicked.png');

        // 5. Verificar el éxito del inicio de sesión comprobando un elemento específico
        let welcomeMessage = await driver.findElement(By.name('Nueva Factura')).getText();
        if (welcomeMessage.includes('Nueva Factura')) {
            console.log('Inicio de sesión exitoso');
        } else {
            console.log('Inicio de sesión fallido');
        }
    } finally {
        // Cerrar el navegador
        await driver.quit();
    }
}

// Función para capturar capturas de pantalla y guardarlas en la carpeta 'loginTest'
async function captureScreenshot(driver, fileName) {
    let image = await driver.takeScreenshot();
    let filePath = path.join(loginDir, fileName);
    fs.writeFileSync(filePath, image, 'base64');
    console.log(`Captura guardada como: ${filePath}`);
}

// Ejecutar la prueba
loginTest();
