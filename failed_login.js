const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');
const path = require('path');

// Crear la carpeta 'screenshots' si no existe
const baseDir = './screenshots';
if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir);
}

// Crear la subcarpeta para el inicio de sesión fallido
const failedLoginDir = path.join(baseDir, 'failed_login');
if (!fs.existsSync(failedLoginDir)) {
    fs.mkdirSync(failedLoginDir);
}

// Limpiar la carpeta 'failed_login' eliminando todos los archivos antiguos
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
clearDirectory(failedLoginDir);

// Configuración de las opciones del navegador
const options = new chrome.Options();

async function failed_login() {
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

        // 3. Encontrar el campo de contraseña e ingresar la contraseña incorrecta
        await driver.findElement(By.name('contrasena')).sendKeys('12345ai');
        await captureScreenshot(driver, '03_password_entered.png');

        // 4. Hacer clic en el botón de inicio de sesión
        await driver.findElement(By.name('btnIngresar')).click();
        await captureScreenshot(driver, '04_login_clicked.png');

        // 5. Verificar si el inicio de sesión falló comprobando la ausencia del elemento "Nueva Factura"
        try {
            let welcomeMessage = await driver.findElement(By.name('Nueva Factura')).getText();
            if (welcomeMessage.includes('Nueva Factura')) {
                console.log('Inicio de sesión exitoso');
            }
        } catch (error) {
            console.log('Inicio de sesión fallido');
            await captureScreenshot(driver, '05_login_failed.png');
        }

    } finally {
        // Cerrar el navegador
        await driver.quit();
    }
}

// Función para capturar capturas de pantalla y guardarlas en la subcarpeta 'failed_login'
async function captureScreenshot(driver, fileName) {
    let image = await driver.takeScreenshot();
    let filePath = path.join(failedLoginDir, fileName);
    fs.writeFileSync(filePath, image, 'base64');
    console.log(`Captura guardada como: ${filePath}`);
}

// Ejecutar la prueba
failed_login();
