// Format a text selection of proposal resumes, after they are pulled from vision and input into Indesign
// Wesley Witsken: witsken.w@gmail.com
// Designed for RRM Design group, 2023

(function() {
    var title = "Format Resume Projects";
    if (!/indesign/i.test(app.name)) {
        alert("Script for InDesign", title, false);
        return;
    }

    $.writeln('Does this work?')

    // Script variables.
    var doc;
    var selection;
    var text; // The full text of the story

    // SETUP
    if (!app.documents.length) {
        alert("Open a document", title, false);
        return;
    }
    doc = app.activeDocument;

    // Helper function for formatting resume project strings to get rid of redundant information
    function modifyString(str) {
        if (str.charAt(str.length - 1) === '\n' || '\r') {
            str = str.slice(0, -1);
        }
        var lastPartIndex, lastPart;
        if (str.substring(str.length - 4, str.length) === ', CA') {
            str = str.substring(0, str.length - 4);
        }
        lastPartIndex = str.lastIndexOf(', ') + 2;
        lastPart = str.substring(lastPartIndex);
        if (str.indexOf(lastPart) === 0) {
            str = str.substring(0, lastPartIndex - 2);
        }
        return str + '\r';
    }

    // Execute
    selection = doc.selection[0]
    text = selection.parentStory.paragraphs // Text is a list of paragraph objects

    if (text.length > 0) {
        // Loop first to change formatting
        for (var i = 0; i < text.length; i++) {
            $.writeln(text[i].contents)
            try {
                var para = text[i];
                if (para.length > 1) {
                    var line_string = para.contents;
                    if (!(line_string <= 1)) {
                        para.contents = modifyString(line_string)
                    }
                }
            } catch (e) {
                $.writeln("An error occured: " + e)
            }
        }
    }
    alert("Success! The formatted text story contains all the content from the text selection you made.")
}());