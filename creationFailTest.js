const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');
const path = require('path');

// Crear la carpeta 'screenshots' si no existe
const baseDir = './screenshots';
if (!fs.existsSync(baseDir)){
    fs.mkdirSync(baseDir);
}

// Crear la subcarpeta 'creationFailTest' si no existe
const creationDir = path.join(baseDir, 'creationFailTest');
if (!fs.existsSync(creationDir)) {
    fs.mkdirSync(creationDir);
}

// Limpiar la carpeta 'creationFailTest' eliminando todos los archivos antiguos
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
clearDirectory(creationDir);

// Configuración de las opciones del navegador
const options = new chrome.Options();

async function creationFailTest() {
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

        // 5. Hacer clic en el botón de Nueva Factura
        await driver.findElement(By.xpath("//a[@href='facturar.php' and contains(text(),'Nueva Factura')]")).click();
        await captureScreenshot(driver, '05_print_clicked.png');

        // 6. Encontrar el campo de código del cliente e ingresar el código
        await driver.findElement(By.id('codigoCliente')).sendKeys('78945');
        await captureScreenshot(driver, '06_codigoCliente_entered.png');

        // 7. Encontrar el campo de nombre del cliente e ingresar el nombre
        await driver.findElement(By.id('nombreCliente')).sendKeys('Candy');
        await captureScreenshot(driver, '07_nombreCliente_entered.png');

        // 8.Hacer clic en el botón de agregarfila
        await driver.findElement(By.xpath("//button[@onclick='agregarfila()']")).click();
        await captureScreenshot(driver, '08_agregarfila_entered.png');

        // 9. Hacer clic en el botón "Facturar"
        await driver.findElement(By.css('button.btn-primary[type="submit"]')).click();
        await captureScreenshot(driver, '9_facturar_clicked.png');
        

    } finally {
        // Cerrar el navegador
        await driver.quit();
    }
}

// Función para capturar capturas de pantalla y guardarlas en la carpeta 'creationFailTest'
async function captureScreenshot(driver, fileName) {
    let image = await driver.takeScreenshot();
    let filePath = path.join(creationDir, fileName);
    fs.writeFileSync(filePath, image, 'base64');
    console.log(`Captura guardada como: ${filePath}`);
}

// Ejecutar la prueba
creationFailTest();

