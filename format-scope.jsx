// Format the scope of a proposal, based on the common RRM Word document template
// This is extremely case-specific: It relies on standard practices for this specific company, using
// common expressions to identify what formatting should be used. Code needs to evolve if those standards ever change
// Wesley Witsken: witsken.w@gmail.com
// Designed for RRM Design group, 2023

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
    var MAINTASKPATTERN = /^(Task|Phase)\s*\d+:\s*.*/i; // case insensitive
    var SUBTASKPATTERN = /^(Task|Phase|Subtask) \d\.\d:.*/i; // case insensitive
    var BULLETPATTERN = /^\s*•\s/
    var SUBBULLETPATTERN = /^\s*o\s/

    var STYLEGROUP = doc.paragraphStyleGroups.itemByName("RRM Cutsheet/Proposal Styles");

    // The styles we use
    var H3 = STYLEGROUP.paragraphStyles.itemByName("H3 - Orange");
    var H4 = STYLEGROUP.paragraphStyles.itemByName("H4 - Grey");
    var BODY = STYLEGROUP.paragraphStyles.itemByName("Body Text");

    var baseBULLET = STYLEGROUP.paragraphStyles.itemByName("Basic-Bullets");
    var baseSUBBULLET = STYLEGROUP.paragraphStyles.itemByName("Basic-SubBullets");

    var BULLET = STYLEGROUP.paragraphStyles.itemByName("Ital-Basic-Bullets")
    var SUBBULLET = STYLEGROUP.paragraphStyles.itemByName("Ital-Basic-SubBullets")

    if (BULLET.isValid) {
        BULLET = STYLEGROUP.paragraphStyles.itemByName("Ital-Basic-Bullets")
    } else {
        BULLET = STYLEGROUP.paragraphStyles.itemByName("Basic-Bullets").duplicate()
        BULLET.name = "Ital-Basic-Bullets"
        BULLET.fontStyle = "Italic"
    }
    if (SUBBULLET.isValid) {
        SUBBULLET = STYLEGROUP.paragraphStyles.itemByName("Ital-Basic-SubBullets")
    } else {
        SUBBULLET = STYLEGROUP.paragraphStyles.itemByName("Basic-SubBullets").duplicate()
        SUBBULLET.name = "Ital-Basic-SubBullets"
        SUBBULLET.fontStyle = "Italic"
    }


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
        } else if (string.indexOf("Deliverables") !== -1) {
            return {
                text: string,
                style: BODY
            }
        } else if (BULLETPATTERN.test(string)) {
            return {
                text: string.replace(/^.*•\s*/, ""),
                style: BULLET
            }
        } else if (SUBBULLETPATTERN.test(string)) {
            return {
                // text: string.replace(/^.*o\s*/, ""),
                text: string.replace(/^\s*o(?=\s)/, ""),
                style: SUBBULLET
            }
        } else {
            return {
                text: string,
                style: BODY
            }
        }
    }

    // Check if we have an actual selection & bock grabs the story and text
    // Also sets up new text frame same size on top of the old one, which we will use to input our new story
    function set_story(selection) {
        // Making sure that we're actually capturing some text
        if (selection instanceof TextFrame) {
            if (selection.contents.length < 1) {
                throw new Error("There is no text in this text frame")
            } else {
                // Create a new text frame with same dimensions as selected, no content
                newTextFrame = selection.parentPage.textFrames.add({
                    geometricBounds: selection.geometricBounds
                })
                newTextFrame.contents = "";

                // Position the new text frame on top of the original text frame
                newTextFrame.move([selection.geometricBounds[0], selection.geometricBounds[1]]);
                story = selection.parentStory;
                newStory = newTextFrame.parentStory;
                // Debug
                // alert("Should be a string: " + story.lines[0].contents) }
            }
        } else {
            throw new Error("Select a text frame before running script")
        }
    }

    // Execute
    selection = doc.selection[0]; // This variable should always be a Text Frame
    set_story(selection) // Sets newTextFrame, story, and newStory
    text = story.paragraphs // Text is a list of paragraph objects

    if (text.length > 0) {
        for (var i = 0; i < text.length; i++) {
            // Now we have a paragraph, in string format
            var paragraph_string = text[i].contents;

            // Get style for the paragraph, and adjust it's content using the helper function
            var paragraph_details = apply_style(paragraph_string)

            // Ripped this from stackoverflow:
            // https://stackoverflow.com/questions/23985785/indesign-jsx-scripted-add-of-heading-and-content-into-textframe
            newStory.insertionPoints[-1].contents = paragraph_details.text; // Using a newline to separate 
            newStory.insertionPoints[-2].appliedParagraphStyle = paragraph_details.style

        }
    } else {
        alert("No text in this selection")
        return
    }
    alert("Success! The formatted text story contains all the content from the text selection you made.")
}());