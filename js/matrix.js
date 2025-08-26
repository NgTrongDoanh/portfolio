// // ============================================
// // COLOR CONVERSION UTILITIES
// // ============================================

// /**
//  * Chuyển đổi RGB array sang giá trị Hue (độ màu)
//  * @param {Array} rgbArray - Mảng RGB với giá trị [0,1]
//  * @returns {number} Giá trị Hue từ 0-360 độ
//  */
// function rgbToHue(rgbArray) {
//     // Chuyển từ [0,1] sang [0,255] và lấy Hue từ HSL
//     return 360 * rgbToHsl(...rgbArray.map(function(value) {
//         return Math.ceil(255 * value);
//     }))[0];
// }

// /**
//  * Chuyển đổi mã hex color sang RGB object
//  * @param {string} hexColor - Mã hex color (có thể có # ở đầu)
//  * @returns {Object|null} {r, g, b} hoặc null nếu invalid
//  */
// function hexToRgb(hexColor) {
//     // Regex để parse hex color format: #RRGGBBAA hoặc RRGGBBAA
//     let regexResult = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexColor);
    
//     return regexResult ? {
//         r: parseInt(regexResult[2], 16),  // Red component
//         g: parseInt(regexResult[3], 16),  // Green component  
//         b: parseInt(regexResult[4], 16)   // Blue component
//         // Note: Regex có 4 groups nhưng chỉ dùng 3 groups cuối (bỏ qua alpha?)
//     } : null;
// }

// /**
//  * Chuyển đổi RGB sang HSL (Hue, Saturation, Lightness)
//  * @param {number} red - Red component (0-255)
//  * @param {number} green - Green component (0-255) 
//  * @param {number} blue - Blue component (0-255)
//  * @returns {Array} [hue, saturation, lightness] với giá trị [0,1]
//  */
// function rgbToHsl(red, green, blue) {
//     // Normalize RGB values từ [0,255] về [0,1]
//     red /= 255;
//     green /= 255; 
//     blue /= 255;
    
//     var hue, saturation;
//     var max = Math.max(red, green, blue);
//     var min = Math.min(red, green, blue);
//     var lightness = (max + min) / 2;
    
//     if (max === min) {
//         // Achromatic (grayscale)
//         hue = saturation = 0;
//     } else {
//         var delta = max - min;
        
//         // Calculate saturation
//         saturation = lightness > 0.5 ? 
//             delta / (2 - max - min) : 
//             delta / (max + min);
        
//         // Calculate hue based on which component is maximum
//         switch (max) {
//             case red: 
//                 hue = (green - blue) / delta + (green < blue ? 6 : 0); 
//                 break;
//             case green: 
//                 hue = (blue - red) / delta + 2; 
//                 break;
//             case blue: 
//                 hue = (red - green) / delta + 4; 
//                 break;
//         }
//         hue /= 6;
//     }
    
//     return [hue, saturation, lightness];
// }

// ============================================
// MATHEMATICAL UTILITIES
// ============================================

/**
 * Map một giá trị từ range này sang range khác (linear interpolation)
 * @param {number} value - Giá trị cần map
 * @param {number} fromMin - Min của range gốc
 * @param {number} fromMax - Max của range gốc
 * @param {number} toMin - Min của range đích
 * @param {number} toMax - Max của range đích
 * @returns {number} Giá trị đã được map
 */
function map(value, fromMin, fromMax, toMin, toMax) {
    return (value - fromMin) * (toMax - toMin) / (fromMax - fromMin) + toMin;
}

/**
 * Clamp giá trị trong khoảng min-max
 * @param {number} min - Giá trị tối thiểu
 * @param {number} max - Giá trị tối đa
 * @param {number} value - Giá trị cần clamp
 * @returns {number} Giá trị đã được clamp
 */
function clamp(min, max, value) {
    return value < min ? min : (value > max ? max : value);
}

// MATRIX RAIN ANIMATION - Main Application
window.onload = function() {
    
    // ============================================
    // 1. RESIZE HANDLER - Adjust canvas size
    // ============================================
    function resizeCanvas() {
        // Resize canvases to fill window
        maskCanvas.height = window.innerHeight;
        maskCanvas.width = window.innerWidth;
        colorOverlayCanvas.height = window.innerHeight; 
        colorOverlayCanvas.width = window.innerWidth;
        mainCanvas.height = window.innerHeight;
        mainCanvas.width = window.innerWidth;
    }

    // ============================================
    // 2. TIME/DATE HANDLER - Update time and date
    // ============================================
    // function updateDateTime() {
    //     var currentTime = new Date();
        
    //     // Apply daylight saving time if needed
    //     currentTime.setHours(currentTime.getHours() + settings.ui_clock_dayLightSaving);
        
    //     // Handle different calendar systems
    //     switch(settings.ui_date_date) {
    //         case "1": // Gregorian
    //             year = currentTime.getFullYear();
    //             month = currentTime.getMonth() + 1;
    //             day = currentTime.getDate();
    //             break;
    //         case "2": // Persian/Farsi
    //             var persianDate = currentTime.toLocaleDateString("fa-IR-u-nu-latn").split("/");
    //             year = parseInt(persianDate[0]);
    //             month = parseInt(persianDate[1]); 
    //             day = parseInt(persianDate[2]);
    //             break;
    //         case "3": // Arabic/Hijri
    //             var arabicDate = currentTime.toLocaleDateString("ar-SA-u-nu-latn").split("/");
    //             year = parseInt(arabicDate[2]);
    //             month = parseInt(arabicDate[1]);
    //             day = parseInt(arabicDate[0]);
    //     }
        
    //     // Get time components
    //     dayOfWeek = currentTime.getDay();
    //     hours = currentTime.getHours();
    //     minutes = currentTime.getMinutes();
        
    //     // Convert to 12-hour format if needed
    //     if (!settings.ui_clock_24HourFormat && hours > 12) {
    //         hours %= 12;
    //         if (hours == 0) hours = 12;
    //     }
        
    //     // Add leading zeros if needed
    //     if (hours < 10) hours = "0" + hours;
    //     if (minutes < 10) minutes = "0" + minutes;
        
    //     hours = hours.toString();
    //     minutes = minutes.toString();
    // }

    // ============================================
    // 3. MAIN RENDER FUNCTION - Draw everything
    // ============================================
    function render() {
        clearGrid();
        
        // Setup composite operations for trail effect
        maskContext.globalCompositeOperation = "source-over";
        maskContext.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
        
        // Apply trail effect
        maskContext.fillStyle = "rgba(0, 0, 0, " + settings.trailLength + ")";
        maskContext.fillRect(0, 0, maskCanvas.width, maskCanvas.height);
        maskContext.globalCompositeOperation = "destination-out";
        
        // Draw logo if available
        if (logoImage) {
            let logoWidth = maskCanvas.height/2 * (logoImage.width/logoImage.height) * settings.ui_logo_scale;
            let logoHeight = maskCanvas.height/2 * settings.ui_logo_scale;
            
            maskContext.drawImage(logoImage, 
                maskCanvas.width/2 - logoWidth/2 + settings.ui_logo_positionX,
                maskCanvas.height/2 - logoHeight/2 + settings.ui_logo_positionY,
                logoWidth, logoHeight);
                
            colorOverlayContext.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
            colorOverlayContext.drawImage(logoImage,
                maskCanvas.width/2 - logoWidth/2 + settings.ui_logo_positionX, 
                maskCanvas.height/2 - logoHeight/2 + settings.ui_logo_positionY,
                logoWidth, logoHeight);
        }
        
        // // Draw clock if enabled
        // switch(settings.ui_clock_clock) {
        //     case "1": { // Horizontal format: HH:MM
        //         let timeText = hours + ":" + minutes;
        //         if (settings.ui_clock_scale > 0) {
        //             let pos = [
        //                 Math.floor((gridWidth - 17 * settings.ui_clock_scale) / 2),
        //                 Math.floor((gridHeight - 5 * settings.ui_clock_scale) / 2)
        //             ];
        //             drawLargeText(timeText, pos[0] + settings.ui_clock_positionX, 
        //                         pos[1] + settings.ui_clock_positionY, settings.ui_clock_scale);
        //         } else {
        //             let pos = [Math.floor((gridWidth - 5) / 2), Math.floor((gridHeight - 1) / 2)];
        //             drawSmallText(timeText, pos[0] + settings.ui_clock_positionX, 
        //                         pos[1] + settings.ui_clock_positionY);
        //         }
        //         break;
        //     }
        //     case "2": { // Vertical format: HH\nMM
        //         let timeText = hours + "\\n" + minutes;
        //         if (settings.ui_clock_scale > 0) {
        //             let pos = [
        //                 Math.floor((gridWidth - 7 * settings.ui_clock_scale) / 2),
        //                 Math.floor((gridHeight - 11 * settings.ui_clock_scale) / 2)
        //             ];
        //             drawLargeText(timeText, pos[0] + settings.ui_clock_positionX,
        //                         pos[1] + settings.ui_clock_positionY, settings.ui_clock_scale);
        //         } else {
        //             let pos = [Math.floor((gridWidth - 2) / 2), Math.floor((gridHeight - 2) / 2)];
        //             drawSmallText(timeText, pos[0] + settings.ui_clock_positionX,
        //                         pos[1] + settings.ui_clock_positionY);
        //         }
        //         break;
        //     }
        //     case "3": { // Single character per line: H\nH\n:\nM\nM
        //         let timeText = hours.split("").join("\\n") + "\\n" + minutes.split("").join("\\n");
        //         if (settings.ui_clock_scale > 0) {
        //             let pos = [
        //                 Math.floor((gridWidth - 3 * settings.ui_clock_scale) / 2),
        //                 Math.floor((gridHeight - 23 * settings.ui_clock_scale) / 2)
        //             ];
        //             drawLargeText(timeText, pos[0] + settings.ui_clock_positionX,
        //                         pos[1] + settings.ui_clock_positionY, settings.ui_clock_scale);
        //         } else {
        //             let pos = [Math.floor((gridWidth - 1) / 2), Math.floor((gridHeight - 4) / 2)];
        //             drawSmallText(timeText, pos[0] + settings.ui_clock_positionX,
        //                         pos[1] + settings.ui_clock_positionY);
        //         }
        //         break;
        //     }
        // }
        
        // // Draw day of the week
        // if (settings.ui_day_day != "0") {
        //     var dayText = settings.ui_day_allCaps ? dayNames[dayOfWeek].toUpperCase() : dayNames[dayOfWeek];
            
        //     if (settings.ui_day_day == "2") {
        //         dayText = dayText.substring(0, 3); // Only first 3 letters
        //     }
            
        //     if (settings.ui_day_orientation) {
        //         dayText = dayText.split("").join("\\n"); // Vertical orientation
        //     }
            
        //     if (settings.ui_day_scale > 0) {
        //         let textSize = calculateLargeTextSize(dayText, settings.ui_day_scale);
        //         let pos = [Math.floor((gridWidth - textSize[0]) / 2), Math.floor((gridHeight - textSize[1]) / 2)];
        //         drawLargeText(dayText, pos[0] + settings.ui_day_positionX, 
        //                     pos[1] + settings.ui_day_positionY, settings.ui_day_scale);
        //     } else {
        //         let textSize = calculateSmallTextSize(dayText);
        //         let pos = [Math.floor((gridWidth - textSize[0]) / 2), Math.floor((gridHeight - textSize[1]) / 2)];
        //         drawSmallText(dayText, pos[0] + settings.ui_day_positionX, 
        //                     pos[1] + settings.ui_day_positionY);
        //     }
        // }
        
        // // Draw date
        // if (settings.ui_date_date != "0") {
        //     var dayStr = day.toString();
        //     var monthStr = "";
            
        //     if (dayStr.length < 2) dayStr = "0" + dayStr;
            
        //     // Handle month
        //     if (settings.ui_date_monthName) {
        //         monthStr = monthNames[parseInt(settings.ui_date_date) - 1][month - 1];
        //         if (settings.ui_date_allCaps) monthStr = monthStr.toUpperCase();
        //     } else {
        //         monthStr = month.toString();
        //         if (monthStr.length < 2) monthStr = "0" + monthStr;
        //     }
            
        //     // Handle year
        //     var yearStr = "";
        //     switch(settings.ui_date_year) {
        //         case "1": yearStr = year.toString().substring(2, 4); break;
        //         case "2": yearStr = year.toString(); break;
        //     }
            
        //     // Handle order of month and day
        //     if (settings.ui_date_order == 1) {
        //         let temp = monthStr;
        //         monthStr = dayStr;
        //         dayStr = temp;
        //     }
            
        //     let delimiter = dateDelimiters[parseInt(settings.ui_date_delimiter)];
        //     var dateText;
            
        //     switch(settings.ui_date_style) {
        //         case "0": // Horizontal với delimiter
        //             dateText = (yearStr.length > 0 ? [yearStr, monthStr, dayStr] : [monthStr, dayStr]).join(delimiter);
        //             break;
        //         case "1": // Vertical với newlines
        //             dateText = (yearStr.length > 0 ? [yearStr, monthStr, dayStr] : [monthStr, dayStr]).join("\\n");
        //             break;
        //         case "2": // Single characters vertical
        //             dateText = (yearStr + monthStr + dayStr).split("").join("\\n");
        //             break;
        //     }
            
        //     if (settings.ui_date_scale > 0) {
        //         let textSize = calculateLargeTextSize(dateText, settings.ui_date_scale);
        //         let pos = [Math.floor((gridWidth - textSize[0]) / 2), Math.floor((gridHeight - textSize[1]) / 2)];
        //         drawLargeText(dateText, pos[0] + settings.ui_date_positionX, 
        //                     pos[1] + settings.ui_date_positionY, settings.ui_date_scale);
        //     } else {
        //         let textSize = calculateSmallTextSize(dateText);
        //         let pos = [Math.floor((gridWidth - textSize[0]) / 2), Math.floor((gridHeight - textSize[1]) / 2)];
        //         drawSmallText(dateText, pos[0] + settings.ui_date_positionX, 
        //                     pos[1] + settings.ui_date_positionY);
        //     }
        // }
        
        // Draw custom message if available
        if (settings.ui_message_message) {
            if (settings.ui_message_scale > 0) {
                let textSize = calculateLargeTextSize(settings.ui_message_text, settings.ui_message_scale);
                let pos = [Math.floor((gridWidth - textSize[0]) / 2), Math.floor((gridHeight - textSize[1]) / 2)];
                drawLargeText(settings.ui_message_text, pos[0] + settings.ui_message_positionX,
                            pos[1] + settings.ui_message_positionY, settings.ui_message_scale);
            } else {
                let textSize = calculateSmallTextSize(settings.ui_message_text);
                let pos = [Math.floor((gridWidth - textSize[0]) / 2), Math.floor((gridHeight - textSize[1]) / 2)];
                drawSmallText(settings.ui_message_text, pos[0] + settings.ui_message_positionX,
                            pos[1] + settings.ui_message_positionY);
            }
        }
    }

    // ============================================
    // 4. TEXT RENDERING FUNCTIONS
    // ============================================
    
    // // Draw small text (bitmap font)
    // function drawSmallText(text, x, y) {
    //     maskContext.fillStyle = "#FFF";
    //     var lines = text.split("\\n");
    //     let textSize = calculateSmallTextSize(text);
        
    //     // Clamp position to stay within bounds
    //     x = clamp(0, gridWidth - textSize[0], x);
    //     y = clamp(0, gridHeight - textSize[1], y);
        
    //     for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    //         let words = lines[lineIndex].split(" ");
    //         let charOffset = 0;
            
    //         // Vẽ từng từ
    //         for (let wordIndex = 0; wordIndex < words.length; wordIndex++) {
    //             if (words[wordIndex].length > 0) {
    //                 maskContext.fillRect(
    //                     (x + charOffset) * settings.ui_font_size - fontOffsetX,
    //                     (y + lineIndex) * settings.ui_font_size + fontOffsetY,
    //                     words[wordIndex].length * settings.ui_font_size,
    //                     settings.ui_font_size
    //                 );
    //             }
    //             charOffset += words[wordIndex].length + 1;
    //         }
            
    //         // Đánh dấu vị trí text trong grid
    //         for (let charIndex = 0; charIndex < lines[lineIndex].length; charIndex++) {
    //             textGrid[x + charIndex][y + lineIndex + 1] = 
    //                 lines[lineIndex][charIndex] != " " ? lines[lineIndex][charIndex] : null;
    //         }
    //     }
    // }
    
    // // Draw large text (font scalable)
    // function drawLargeText(text, x, y, scale) {
    //     maskContext.font = (5 * settings.ui_font_size * scale) + "px neo-matrix";
    //     maskContext.fillStyle = "#FFF";
    //     var lines = text.split("\\n");
        
    //     for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    //         maskContext.fillText(
    //             lines[lineIndex],
    //             settings.ui_font_size * x - fontOffsetX,
    //             settings.ui_font_size * (y + (6 * (lineIndex + 1) - 1) * scale) + fontOffsetY
    //         );
    //     }
    // }
    
    // // Calculate size of large text
    // function calculateLargeTextSize(text, scale) {
    //     let smallSize = calculateSmallTextSize(text);
    //     return [(4 * smallSize[0] - 1) * scale, (6 * smallSize[1] - 1) * scale];
    // }
    
    // // Calculate size of small text
    // function calculateSmallTextSize(text) {
    //     var lines = text.split("\\n");
    //     var maxWidth = 0;
        
    //     for (let i = 0; i < lines.length; i++) {
    //         if (lines[i].length > maxWidth) {
    //             maxWidth = lines[i].length;
    //         }
    //     }
    //     return [maxWidth, lines.length];
    // }

    // ============================================
    // 5. INITIALIZATION FUNCTIONS
    // ============================================
    
    // Initialize font settings and calculate grid
    function initializeFont() {
        var fontName = availableFonts[parseInt(settings.ui_font_font) - 1];
            
        tempContext.font = settings.ui_font_size + "px " + fontName;
        fontOffsetY = settings.ui_font_size / 8;
        fontOffsetX = settings.ui_font_size / 16;
        
        calculateGrid();
        render();
        initializeRain();
    }
    
    // Calculate grid dimensions based on canvas size and font size
    function calculateGrid() {
        gridWidth = Math.floor(maskCanvas.width / settings.ui_font_size);
        gridHeight = Math.floor(maskCanvas.height / settings.ui_font_size);
        
        // Tính toán cho audio responsiveness
        audioColumnWidth = Math.floor(360 / gridWidth);
        audioRowHeight = Math.floor(360 / gridHeight);
        audioMultiplier = audioBufferSize / (2 * gridWidth);
        
        clearGrid();
    }
    
    // Clear text grid
    function clearGrid() {
        textGrid = [];
        for (let x = 0; x < gridWidth; x++) {
            textGrid[x] = [];
            for (let y = 0; y < gridHeight; y++) {
                textGrid[x][y] = null;
            }
        }
    }
    
    // Initialize rain drops
    function initializeRain() {
        rainDrops = [];
        
        switch(settings.ui_rain_initialAnimation) {
            case "0": // All drops at bottom
                for (var x = 0; x < gridWidth; x++) {
                    rainDrops[x] = [];
                    for (var i = 0; i < settings.ui_rain_dropCount; i++) {
                        rainDrops[x][i] = [gridHeight + 1, 0, 0, "", 0];
                    }
                }
                break;
                
            case "1": // All drops at top
                for (x = 0; x < gridWidth; x++) {
                    rainDrops[x] = [];
                    rainDrops[x][0] = [1, 0, 0, "", 0];
                    for (i = 1; i < settings.ui_rain_dropCount; i++) {
                        rainDrops[x][i] = [gridHeight + 1, 0, 0, "", 0];
                    }
                }
                break;
                
            case "2": // Random positions
                for (x = 0; x < gridWidth; x++) {
                    rainDrops[x] = [];
                    for (i = 0; i < settings.ui_rain_dropCount; i++) {
                        rainDrops[x][i] = [Math.floor(Math.random() * gridHeight), 0, 0, "", 0];
                    }
                }
                break;
        }
    }

    // ============================================
    // 6. ANIMATION LOOP
    // ============================================
    function animationLoop() {
        window.requestAnimationFrame(animationLoop);
        
        currentTime = Date.now();
        deltaTime = currentTime - lastTime;
        
        if (deltaTime > settings.fpsInterval) {
            lastTime = currentTime - (deltaTime % settings.fpsInterval);
            
            // Main animation update
            updateAnimation();
        }
    }
    
    function updateAnimation() {
        // Copy mask to main canvas
        tempContext.globalCompositeOperation = "source-over";
        tempContext.drawImage(colorOverlayCanvas, 0, 0);
        
        // Apply color overlay if logo preserve color is enabled
        if (logoImage && settings.ui_logo_preserveColor) {
            tempContext.globalCompositeOperation = "source-atop";
            tempContext.drawImage(mainCanvas, 0, 0);
            tempContext.globalCompositeOperation = "source-over";
        }
        
        var isSilent = true;
        
        // Update each column of rain
        for (var columnIndex = 0; columnIndex < rainDrops.length; columnIndex++) {
            var dropProbability = 0.975;
            var brightness = 50;
            
            // Audio responsiveness
            if (settings.ui_audio_audioResponsive) {
                var audioIndex = Math.floor(columnIndex * audioMultiplier);
                var audioLevel = audioData[audioIndex] + audioData[audioIndex + audioBufferSize / 2];
                
                if (audioLevel > 0.01) {
                    isSilent = false;
                }
                
                if (!silenceDetected || settings.ui_audio_silenceAnimation) {
                    dropProbability = 1 - clamp(0, 1, audioLevel * audioLevel * audioLevel * settings.ui_audio_audioSensetivity);
                    brightness = Math.floor(clamp(40, 80, 100 * audioLevel * settings.ui_audio_audioSensetivity));
                }
            }
            
            var hasNewDrop = true;
            
            // Update each drop in column
            for (var dropIndex = 0; dropIndex < settings.ui_rain_dropCount; dropIndex++) {
                var character = getCharacterForDrop(rainDrops[columnIndex][dropIndex], columnIndex);
                var dropBrightness = brightness;
                
                if (rainDrops[columnIndex][dropIndex][1] > 0) {
                    dropBrightness = 100; // Full brightness for code sequences
                }
                
                // Highlight first character effect
                if (settings.ui_color_highlightFirstCharacter) {
                    tempContext.clearRect(
                        columnIndex * settings.ui_font_size - fontOffsetX,
                        (rainDrops[columnIndex][dropIndex][0] - 2) * settings.ui_font_size + fontOffsetY,
                        settings.ui_font_size,
                        settings.ui_font_size
                    );
                    
                    var prevRow = rainDrops[columnIndex][dropIndex][0] - 1;
                    tempContext.fillStyle = getColor(columnIndex, prevRow, rainDrops[columnIndex][dropIndex][4]);
                    tempContext.fillText(
                        rainDrops[columnIndex][dropIndex][3],
                        columnIndex * settings.ui_font_size,
                        prevRow * settings.ui_font_size
                    );
                    tempContext.fillStyle = "#FFF";
                } else {
                    tempContext.fillStyle = getColor(columnIndex, rainDrops[columnIndex][dropIndex][0], dropBrightness);
                }
                
                // Clear and draw new character
                tempContext.clearRect(
                    columnIndex * settings.ui_font_size,
                    (rainDrops[columnIndex][dropIndex][0] - 1) * settings.ui_font_size + fontOffsetY,
                    settings.ui_font_size,
                    settings.ui_font_size
                );
                
                rainDrops[columnIndex][dropIndex][3] = character;
                rainDrops[columnIndex][dropIndex][4] = dropBrightness;
                
                tempContext.fillText(
                    character,
                    columnIndex * settings.ui_font_size,
                    rainDrops[columnIndex][dropIndex][0] * settings.ui_font_size
                );
                
                // Reset drop if it goes off screen
                if (rainDrops[columnIndex][dropIndex][0] > gridHeight && 
                    Math.random() > dropProbability && hasNewDrop) {
                    rainDrops[columnIndex][dropIndex] = [0, 0, 0, "", 0];
                    hasNewDrop = false;
                }
                
                rainDrops[columnIndex][dropIndex][0]++; // Move drop down
            }
        }
        
        // Handle silence detection
        if (settings.ui_audio_silenceAnimation) {
            if (isSilent) {
                if (new Date() - silenceStartTime > 1000 * settings.ui_audio_silenceTimeoutSeconds) {
                    silenceDetected = true;
                }
            } else {
                silenceDetected = false;
                silenceStartTime = new Date();
            }
        }
    }

    // ============================================
    // 7. CHARACTER GENERATION
    // ============================================
    function getCharacterForDrop(drop, columnIndex) {
        // Return existing text character if present
        try {
            if (textGrid[columnIndex][drop[0]] === undefined) {
                return characterSet[Math.floor(Math.random() * characterSet.length)];
            }
        } catch (e) {
            // return characterSet[Math.floor(Math.random() * characterSet.length)];
        }
        
        
        // Handle code sequences
        if (Math.random() > 0.995 && drop[1] == 0) {
            drop[1] = Math.floor(Math.random() * settings.codes.length) + 1;
            drop[2] = drop[0]; // Mark start position
        }
        
        if (drop[1] != 0) {
            var codeOffset = drop[0] - drop[2];
            if (codeOffset < settings.codes[drop[1] - 1].length) {
                return settings.codes[drop[1] - 1][codeOffset];
            }
            // Reset code sequence
            drop[1] = 0;
            drop[2] = 0;
        }
        
        // Return random character
        return characterSet[Math.floor(Math.random() * characterSet.length)];
    }

    // ============================================
    // 8. COLOR GENERATION
    // ============================================
    function getColor(x, y, brightness) {
        var hue;
        var time = Math.floor(settings.colorAnimationSpeed * lastTime);
        
        switch(settings.ui_color_colorMode) {
            case "1": // Time-based
                hue = time * audioRowHeight;
                break;
            case "2": // Row-based
                hue = (y + time) * audioRowHeight;
                break;
            case "3": // Column-based
                hue = (x + time) * audioColumnWidth;
                break;
            default: // Static color
                hue = settings.matrixColor;
        }
        
        return "hsl(" + hue + ", 100%, " + brightness + "%)";
    }

    // ============================================
    // 9. SETTINGS AND CONFIGURATION
    // ============================================
    var settings = {
        // Rain animation settings
        fpsInterval: 1000 / 18,
        ui_rain_trailLength: 0.85,
        trailLength: map(0.85, 0, 1, 0.35, 0.02),
        ui_rain_dropCount: 1,
        ui_rain_initialAnimation: "1",
        
        // Character set settings
        ui_characters_charset: "3",
        
        // Font settings
        ui_font_font: "1",
        ui_font_size: 16,
        
        // Code sequences
        codes: "HCMUS,FIT,ntd,web,backend,security".split(","),
        
        // Color settings
        ui_color_colorMode: "4",
        // ui_color_matrixColor: [0.09411765, 0.10196078, 0.25098039],
        // matrixColor: rgbToHue([0.22411765, 0.10196078, 0.25098039]),
        ui_color_matrixColor: [0.4, 0.7, 0.9],
        matrixColor: 210,
        ui_color_colorAnimationSpeed: 0.5,
        colorAnimationSpeed: map(0.5, -1, 1, 0.05, -0.05),
        ui_color_highlightFirstCharacter: true,
        
        // Audio settings
        ui_audio_audioResponsive: false,
        ui_audio_audioSensetivity: 50,
        ui_audio_silenceAnimation: true,
        ui_audio_silenceTimeoutSeconds: 3,
        
        // Logo settings
        ui_logo_logo: "0",
        ui_logo_customLogo: "img/logo.svg",
        ui_logo_preserveColor: false,
        ui_logo_scale: 1.5,
        ui_logo_positionX: 0,
        ui_logo_positionY: 0,
        
        // // Clock settings
        // ui_clock_clock: "0",
        // ui_clock_24HourFormat: true,
        // ui_clock_dayLightSaving: 0,
        // ui_clock_scale: 1,
        // ui_clock_positionX: 0,
        // ui_clock_positionY: 0,
        
        // // Message settings
        // ui_message_message: false,
        // ui_message_text: "HCMUS-CTF",
        // ui_message_scale: 1,
        // ui_message_positionX: 0,
        // ui_message_positionY: 0,
        
        // // Day settings
        // ui_day_day: "0",
        // ui_day_allCaps: false,
        // ui_day_orientation: false,
        // ui_day_scale: 1,
        // ui_day_positionX: 0,
        // ui_day_positionY: 0,
        
        // // Date settings
        // ui_date_date: "0",
        // ui_date_style: "0",
        // ui_date_year: "2",
        // ui_date_order: "0",
        // ui_date_monthName: false,
        // ui_date_allCaps: false,
        // ui_date_delimiter: "0",
        // ui_date_scale: 1,
        // ui_date_positionX: 0,
        // ui_date_positionY: 0,
        
        // // Utility functions
        // Share() {
        //     copyToClipboard(paramsToUrl({preset: btoa(JSON.stringify(presetManager.save()))}, {}, []));
        //     Log("Copied Preset URL to clipboard.");
        // },
        // Save() {
        //     window.localStorage.setItem("preset", JSON.stringify(presetManager.save()));
        //     Log("Saved preset.");
        // },
        // Load() {
        //     let preset = JSON.parse(window.localStorage.getItem("preset"));
        //     if (preset) {
        //         presetManager.load(preset);
        //         Log("Loaded preset.");
        //     } else {
        //         Log("No preset found.");
        //     }
        // },
        // Reset() {
        //     presetManager.reset();
        //     Log("Settings reset to default.");
        // },
        // LoadFrom(params) {
        //     let preset = presetManager.load(JSON.parse(atob(params.preset)));
        //     if (preset) {
        //         presetManager.load(preset);
        //         Log("Loaded preset from URL.");
        //     } else {
        //         Log("Preset URL is not correct.");
        //     }
        // }
    };

    // ============================================
    // 10. AUDIO HANDLING
    // ============================================
    
    // Wallpaper Engine audio listener
    // if (window.wallpaperRegisterAudioListener) {
    //     window.wallpaperRegisterAudioListener((audioArray) => audioData = audioArray);
    // } 
    // // Sucrose (alternative wallpaper software) audio listener
    // else if (navigator.userAgent.startsWith("Sucrose")) {
    //     window.SucroseAudioData = function(audioObject) {
    //         audioData = audioObject.Data;
    //     };
    // }

    // ============================================
    // 11. EVENT LISTENERS
    // ============================================
    
    // Window resize handler
    window.addEventListener("resize", function() {
        resizeCanvas();
        calculateGrid();
        render();
        initializeFont();
        initializeRain();
    }, false);

    // ============================================
    // 12. CONSTANTS AND DATA ARRAYS
    // ============================================
    
    // // Month names for different calendar systems
    // let monthNames = [
    //     // Gregorian months
    //     ["January", "February", "March", "April", "May", "June", 
    //      "July", "August", "September", "October", "November", "December"],
    //     // Persian months
    //     ["Farvardin", "Ordibehesht", "Khordad", "Tir", "Mordad", "Shahrivar", 
    //      "Mehr", "Aban", "Azar", "Dey", "Bahman", "Esfand"],
    //     // Arabic/Hijri months
    //     ["Muharram", "Safar", "Rabi' al-Awwal", "Rabi' al-Thani", 
    //      "Jumada al-Awwal", "Jumada al-Thani", "Rajab", "Sha'ban", 
    //      "Ramadan", "Shawwal", "Dhu al-Qadah", "Dhu al-Hijjah"]
    // ];
    
    // // Date delimiters
    // let dateDelimiters = ["", " ", "-", ".", "/"];
    
    // // Day names
    // let dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    
    // Available fonts
    let availableFonts = ["monospace", "consolas", "courier-bold", "neo-matrix"];
    
    // Character sets
    let characterSets = [
        // Basic alphabet
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
        // Alphanumeric
        "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",
        // Extended ASCII
        "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ()._,-=+*/\\:;'\"<>?!@#$%&^[]{}",
        // Katakana and numbers
        "1234567890アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン日Z:・.\"=*+-<>¦｜_╌",
        // Binary
        "01",
        // Hexadecimal
        "0123456789ABCDEF",
        // Minimal
        "|."
    ];

    // ============================================
    // 13. GLOBAL VARIABLES
    // ============================================
    
    // Animation timing
    var currentTime, lastTime, deltaTime;
    
    // Character set
    var characterSet;
    
    // Grid dimensions
    var gridWidth, gridHeight;
    
    // Rain drops array
    var rainDrops;
    
    // Text grid for static text
    var textGrid;
    
    // Audio data
    var audioData;
    
    // Audio calculations
    var audioMultiplier, audioColumnWidth, audioRowHeight;
    
    // Font rendering offsets
    var fontOffsetY, fontOffsetX;
    
    // Logo image
    var logoImage = null;
    
    // Logo file names
    var logoFiles = [
        "ipaf", "kali-1", "kali-2", "pardus", "ubuntu-1", "ubuntu-2",
        "windows-11", "windows-10-8", "windows-7", "visual-studio", "vs-code",
        "unity-1", "unity-2", "unreal", "python", "blazor", "docker", "flutter",
        "git", "blender", "angular", "c-sharp", "c-plus-plus", "qt", "sucrose"
    ];
    
    // // Date/time variables
    // var year = "", month = "", day = "", dayOfWeek = "", hours = "", minutes = "";
    
    // Silence detection
    var silenceDetected = false;
    var silenceStartTime = new Date();
    // var currentlySilent = false;
    
    // Audio buffer size
    var audioBufferSize = 128;
    
    // Canvas elements
    var colorOverlayCanvas = document.getElementById("mask");
    var maskContext = colorOverlayCanvas.getContext("2d");
    var mainCanvas = document.getElementById("color-overlay");
    var colorOverlayContext = mainCanvas.getContext("2d");
    var maskCanvas = document.getElementById("neo-matrix");
    var tempContext = maskCanvas.getContext("2d");

    // ============================================
    // 14. INITIALIZATION SEQUENCE
    // ============================================
    
    // Initialize canvas sizes
    resizeCanvas();
    
    // Set up character set
    characterSet = (settings.ui_characters_charset == "0" ? 
        settings.ui_characters_customCharset : 
        characterSets[parseInt(settings.ui_characters_charset) - 1]).split("");
    
    // Initialize date/time
    // updateDateTime();
    
    // Initialize font and rendering
    initializeFont();
    
    // Start animation loop
    lastTime = Date.now();
    animationLoop();
    
    // ============================================
    // 15. LOGO LOADING
    // ============================================
    function loadLogo() {
        logoImage = new Image();
        logoImage.onload = render; // Re-render when logo loads
        
        switch(settings.ui_logo_logo) {
            case "0": // No logo
                logoImage = null;
                render();
                break;
            case "1": // Custom logo
                logoImage.src = settings.ui_logo_customLogo;
                break;
            default: // Predefined logo
                logoImage.src = "images/" + logoFiles[parseInt(settings.ui_logo_logo) - 2] + ".svg";
        }
    }
    
    // Load initial logo
    loadLogo();
    
    // ============================================
    // 16. PERIODIC UPDATES
    // ============================================
    
    // Update time every minute and re-render clock if enabled
    // setInterval(() => {
    //     updateDateTime();
    //     if (settings.ui_clock_clock != "0") {
    //         render();
    //     }
    // }, 60000); // 60 seconds

}; // End of window.onload