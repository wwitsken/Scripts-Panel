// Format the scope of a proposal after copied from docx 
// Wesley Witsken witsken.w@gmail.com
// Designed for RRM Design group

(function() {

        var title = "Format Scope";
        if (!/indesign/i.test(app.name)) {
            alert("Script for InDesign", title, false);
            return;
        }

        // Script variables.
        var doc;
        var selection;
        var story; // A story is just a block of text - can span multiple text boxes when they're connected
        var text; // The full text of the story
        var newStory; // The output story, with formatting. We will put this into a text frame
        var newTextFrame;


        // SETUP
        if (!app.documents.length) {
            alert("Open a document", title, false);
            return;
        }
        doc = app.activeDocument;


        // Script CONSTANTS.
        // Regex patterns for Task / Subtask
        var MAINTASKPATTERN = new RegExp(/^(Task|Phase) \d\.\d:.*$/)
        var SUBTASKPATTERN = new RegExp(/^(Task|Phase|Subtask)*\d\.\d:.*$/)


        var STYLEGROUP = doc.paragraphStyleGroups.itemByName("RRM Cutsheet/Proposal Styles");

        // The styles we use
        var H3 = STYLEGROUP.paragraphStyles.itemByName("H3 - Orange");
        var H4 = STYLEGROUP.paragraphStyles.itemByName("H4 - Grey");
        var BODY = STYLEGROUP.paragraphStyles.itemByName("Body Text");
        var BULLET = STYLEGROUP.paragraphStyles.itemByName("Basic-Bullets");
        var SUBBULLET = STYLEGROUP.paragraphStyles.itemByName("Basic-SubBullets");

        // Helper function to determine what paragraph style a string should get
        // returns an object of text (might be changed) and style (paragraphStyle)
        function apply_style(string) {
            if (MAINTASKPATTERN.test(string)) {
                return {
                    text: string,
                    style: H3
                }
            } else if (SUBTASKPATTERN.test(string)) {
                return {
                    text: string,
                    style: H4
                }
            } else if (string.indexOf("Deliverables" !== -1)) {
                return {
                    text: string,
                    style: BODY
                }
            } else if (string.charAt(0) === "•") {
                return {
                    text: string.replace(/^.(?:\s)*/, ""),
                    style: BULLET
                }
            } else if (string.charAt(0) === "o") {
                return {
                    text: string.replace(/^.(?:\s)*/, ""),
                    style: SUBBULLET
                }
            } else {
                return {
                    text: string,
                    style: BODY
                }
            }
        }

        // Execute
        // Get selected story (spans multiple text boxes)

        // New
        selection = doc.selection[0];

        // Check if we have an actual selection
        if (selection) {

            // Not sure why this try block is here, but I'll keep it
            try {

                // Making sure that we're actually capturing some text
                if (selection instanceof TextFrame) {

                    // Debug, check what kind of object we're working with
                    alert("You selected a text frame!")

                    // Get the whole story from selection, then get the text
                    story = selection.parentStory

                    // TODO: Do I need the text like this?
                    text = selection.parentStory.lines

                    // Debug
                    alert("Should be a story object: " + typeof story + "\n" +
                        "Should be a string: " + story.lines[0].content)

                } else {
                    alert("Select a text frame before running script\nYou selected a " +
                        typeof selection + "object!", errorIcon = true)
                    return
                }

            } catch (_) {
                // Ignore.
            }
        }

        // // Old code
        // if (selection) {
        //     try {
        //         if (selection instanceof TextFrame || selection instanceof Text) {
        //             alert("You selected a text frame!")
        //             story = selection.parentStory
        //             text = story.lines
        //         } else {
        //             alert("Select a text frame before running script", errorIcon = true)
        //             return
        //         }

        //     } catch (_) {
        //         // Ignore.
        //     }

        //     alert("Story: " + typeof story)


        if (text) {

            // Type checking to make sure we just get a good string
            if (typeof text === "string") {
                alert("This is your text: " + text.substring(0, 200))

                // Create a new text frame with same dimensions as selected, no content
                newTextBox = selection.parentPage.textFrames.add({
                    geometricBounds: selection.geometricBounds
                })
                newTextBox.contents = "";

                // Position the new text frame on top of the original text frame
                newTextBox.move([selection.geometricBounds[0], selection.geometricBounds[1]]);

                // Split the string into an array of lines using the '\n' delimiter
                var lines = text.split("/n")

                for (var i = 0; i < lines.length; i++) {
                    var line = apply_style(lines[i]);
                    // at this point, line is an object with the text and its appropriate format
                    var newText = newTextBox.texts.add(line.txt);
                    // Add the new text, apply the line text and style
                    newTextBox.lines.lastItem().appliedParagraphStyle = line.style
                }

            } else if (text instanceof TextFrameContents) {
                throw new Error("This feature is not implemented yet. " + (typeof text))
            } else {
                throw new Error("This feature is not implemented yet. " + (typeof text))
            }
        } else {
            alert("No text in this selection")
            return
        }
    }

}());