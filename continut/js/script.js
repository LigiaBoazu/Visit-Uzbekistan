document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('nav ul li a[data-page]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const pageName = this.getAttribute('data-page');
            loadContent(pageName);
        });
    });
});

function loadContent(pageName) {
    const path = pageName === "persoane" ? `../${pageName}.html` : `${pageName}.html`;
    fetch(path)
        .then(response => response.text())
        .then(html => {
            document.querySelector('.article-background').innerHTML = html;
            afterContentLoad(pageName);
        })
        .catch(error => {
            console.error('Error loading the page:', error);
        });
}

function afterContentLoad(pageName) {
    switch (pageName) {
        case "invat":
            initializeInvatPage();
            break;
        case "persoane":
            incarcaPersoane();  
            break;
    }
}

function initializeInvatPage() {
    setupDateTime();
    setupBrowserInfo();
    setupCanvas();
}

function setupDateTime() {
    const currentDateElement = document.getElementById("currentDateTime");
    if (currentDateElement) {
        const updateDateTime = () => {
            const currentDate = new Date();
            currentDateElement.innerHTML = "Data și ora curentă: " + currentDate.toLocaleString();
        };
        updateDateTime();
        setInterval(updateDateTime, 1000);
    }
}

function setupBrowserInfo() {
    const browserInfo = getBrowserInfo();
    const osInfo = getOSInfo();
    if (document.getElementById("browserInfo") && document.getElementById("osInfo")) {
        document.getElementById("browserInfo").innerHTML = "Browser: " + browserInfo.name + " " + browserInfo.version;
        document.getElementById("osInfo").innerHTML = "Sistem de operare: " + osInfo;
    }
}

function setupCanvas() {
    const canvas = document.getElementById('myCanvas');
    if (canvas) {
        const context = canvas.getContext('2d');
        const contourColorInput = document.getElementById('contourColor');
        const fillColorInput = document.getElementById('fillColor');
        let isDrawing = false;
        let startX, startY;

        canvas.addEventListener('mousedown', event => {
            isDrawing = true;
            startX = event.offsetX;
            startY = event.offsetY;
        });

        canvas.addEventListener('mouseup', event => {
            if (isDrawing) {
                drawRectangle(context, startX, startY, event.offsetX, event.offsetY, contourColorInput.value, fillColorInput.value);
                isDrawing = false;
            }
        });

        canvas.addEventListener('mousemove', event => {
            if (isDrawing) {
                drawPreviewRectangle(context, canvas, startX, startY, event.offsetX, event.offsetY, contourColorInput.value, fillColorInput.value);
            }
        });
    }
}

function drawRectangle(context, startX, startY, endX, endY, contourColor, fillColor) {
    const width = endX - startX;
    const height = endY - startY;
    context.fillStyle = fillColor;
    context.strokeStyle = contourColor;
    context.beginPath();
    context.rect(startX, startY, width, height);
    context.fill();
    context.stroke();
    context.closePath();
}

function drawPreviewRectangle(context, canvas, startX, startY, endX, endY, contourColor, fillColor) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawRectangle(context, startX, startY, endX, endY, contourColor, fillColor);
}

function getBrowserInfo() {
    const ua = navigator.userAgent;
    let name = "", version = "";
    console.log(navigator.userAgent);
    if (ua.indexOf("Edg/") !== -1) {
        name = "Edge";
        version = ua.substring(ua.indexOf("Edg/") + 4).split(" ")[0];
    }
    else if (ua.indexOf("Chrome") !== -1) {
      name = "Chrome";
      version = ua.substring(ua.indexOf("Chrome") + 7).split(" ")[0];
    } else if (ua.indexOf("Firefox") !== -1) {
      name = "Firefox";
      version = ua.substring(ua.indexOf("Firefox") + 8).split(" ")[0];
    } else if (ua.indexOf("Safari") !== -1 && ua.indexOf("Version") !== -1) {
      name = "Safari";
      version = ua.substring(ua.indexOf("Version") + 8).split(" ")[0];
    }
  
    return { name, version };
  }

function getOSInfo() {
    const platform = navigator.platform;
    if (platform.includes("Win")) return "Windows";
    if (platform.includes("Mac")) return "MacOS";
    if (platform.includes("Linux")) return "Linux";
    if (platform.includes("iPhone")) return "iOS";
    if (platform.includes("Android")) return "Android";
    return "Unknown";
}
