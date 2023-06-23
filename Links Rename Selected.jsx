/*

Links Rename Selected
Copyright 2021 William Campbell
All Rights Reserved
https://www.marspremedia.com/contact

Permission to use, copy, modify, and/or distribute this software
for any purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.

*/

(function() {

    var title = "Links Rename Selected";

    if (!/indesign/i.test(app.name)) {
        alert("Script for InDesign", title, false);
        return;
    }

    // Script variables.
    var doc;
    var extension;
    var file;
    var fileNew;
    var link;
    var baseName;
    var nameNew;
    var selection;

    // SETUP

    if (!app.documents.length) {
        alert("Open a document", title, false);
        return;
    }
    doc = app.activeDocument;

    // EXECUTE

    selection = doc.selection[0];
    if (selection) {
        try {
            if (selection instanceof Rectangle) {
                link = selection.allGraphics[0].itemLink;
            } else {
                link = selection.itemLink;
            }
        } catch (_) {
            // Ignore.
        }

        if (link) {
            // Split filename into name and extension.
            baseName = link.name.replace(/\.[^\.]*$/, "");
            extension = String(String(link.name.match(/\..*$/) || "").match(/[^\.]*$/) || "");
            nameNew = prompt("Revise name as desired\n(extension remains the same)", baseName, title);
            if (nameNew && nameNew != baseName) {
                // Add back extension.
                nameNew += "." + extension;
                // Test if new name exists.
                fileNew = new File(new File(link.filePath).path + "/" + nameNew);
                if (fileNew.exists) {
                    alert(nameNew + " already exists", title, true);
                    return;
                }
                // Rename and relink.
                file = new File(link.filePath);
                file.rename(nameNew);
                link.relink(file);
                link.update();
            }
            return;
        }
    }
    alert("Select a placed graphic or its frame", title, false);

})();