#target "InDesign"#include "json2.jsx"

var folderName = "RRM Cutsheet/Proposal Styles"
var styleGroup = app.activeDocument.paragraphStyleGroups.itemByName(folderName);

var styleNames = [
    "H3 - Orange",
    "H4 - Grey",
    "Body Text",
    "Basic-Bullets",
    "Basic-SubBullets"
];

// Custom function to convert the attributes object to a string
function convertObjectToString(obj) {
    var str = '';

    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            var value = obj[key];

            // Check if the value is an object
            if (typeof value === 'object' && value !== null) {
                value = convertObjectToString(value); // Recursively convert nested objects
            }

            // Exclude null values from the string
            if (value !== null) {
                str += key + ': ' + value + '\n';
            }
        }
    }

    return str;
}


// Check if the style group exists
if (styleGroup.isValid) {
    var file = new File("~/Desktop/styleAttributes.txt");
    file.open("w");
    for (var i = 0; i < styleNames.length; i++) {
        // alert(styleNames[i])
        var style = styleGroup.paragraphStyles.itemByName(styleNames[i]);

        // Create an object to store the style attributes
        var styleAttributes = {};
        var styleName = style.name;
        var upper_case
        if (style.capitalization === Capitalization.ALL_CAPS) {
            var upper_case = true
        }

        // Create an object to store the attributes of the current style
        var attributes = {
            name: styleName,
            basedOn: style.basedOn.name,
            fontStyle: style.fontStyle,
            fillColor: style.fillColor.name,
            pointSize: style.pointSize,
            leading: style.leading,
            capitalization: upper_case,
            kerningMethod: style.kerningMethod,
            leftIndent: style.leftIndent,
            firstLineIndent: style.firstLineIndent,
            bulletsAndNumberingListType: style.bulletsAndNumberingListType,
        };
        // Convert the styleAttributes object to a string
        file.write(convertObjectToString(attributes));
        file.write("\n")
    }
    file.close();
    // Display a success message
    alert("Style attributes exported to a text file.");
} else {
    alert("Paragraph style folder not found: " + folderName);
}