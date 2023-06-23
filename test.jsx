#target "InDesign"

(function() {

        function get_text() {
            // Get the active document
            var doc = app.activeDocument;

            // Prompt the user to select text
            alert("Please select the text frame object you want.");

            // Wait for the user to make a selection
            while (app.selection.length === 0) {
                // Continue to wait until the user makes a selection
            }

            // Get the parent text frames of the selected text in array
            var selectedTextFrame = app.selection[0];
            alert("This box: " + selectedTextFrame.parentPage.name)

            for (var i = selectedTextFrame.length - 1; i > 0; i++) {
                // if (selectedTextFrame[i] ) {
                alert("This box: " + selectedTextFrame[i].parentPage.name);
                // }

                // Do something with the selected text
                alert("Selected text: " + selectedTextFrame.contents);
                alert(selectedText) // Check for bugs
                return selectedText;
            }
        }
        get_text()
    }
    ())