#include "json2-mini.js";

/*  Game plan...
    1. Function to extract links from a document and return object { filepath, links[] }
    2. Function to find and return all indd documents in a directory recursively
    3. Wrapper function for (2) that will make a ui for the user to select a directory
    4. Main function to call 3 -> 2 -> 1, will create JS object
    5. Function to convert JS object to formal JSON OR XML, to pass onto another program in the data pipeline

    Output:

{
  "Indesign Proposals": [
    {
    "path": file.fsName,
    "project": file.fsName.split('\\')[2],
    "fileName": file.name,
    "fileSize": 20000,
      "links": [
        {"path": linkpath,
        "valid": bool},
      ]
    }
  ]
}
*/

(function() {
    while (ScriptUI.environment.keyboardState.keyName != "Escape") {
        // CONSTANTS
        // var ROOTFOLDER = new Folder("N:/X-FILES");
        var ROOTFOLDER = new Folder("C:\\Users\\wwitsken\\OneDrive - RRM Design Group\\Desktop\\Test M Drive Links"); /* Test */
        app.scriptPreferences.userInteractionLevel = UserInteractionLevels.NEVER_INTERACT;

        // --------------------------------- Extract Links ----------------------------------- 
        function processDocument(file) {
            if (file) {
                try {
                    var doc = app.open(file, showingWindow = false);

                    var linkList = doc.links
                    var links = []

                    for (var i = 0; i < linkList.length; i++) {
                        var link = {
                            "path": linkList[i].filePath,
                            "valid": linkList[i].status === LinkStatus.NORMAL
                        }
                        links.push(link)
                    }

                    var myObj = {
                        "path": file.fsName,
                        "project": file.fsName.split('\\')[3],
                        "fileName": file.displayName,
                        "fileSize": file.length,
                        "links": links
                    }
                    doc.close(saving = SaveOptions.NO);
                    return myObj
                } catch (error) {
                    return null
                }
            } else {
                return null
            }
        }

        // TESTS
        // theobj = processDocument("N:\\X-FILES\\X-Files-3000\\X3133-01-RC23-Heroes-Park\\Proposal\\InDesign\\(Single Page) Heroes Park Proposal FINAL.indd")
        // alert(theobj.toSource())

        // -------------------- Helper function test if valid group folder -------------------
        function testGroupFolder(f) {
            return (f.name.length === 12 && f.name.slice(0, 8) === "X-Files-")
        }

        // -------------------- Helper function test if valid project folder -----------------
        // Will return true if there is an X at the beginning of the project folder name, and there is at least one .indd document in the ...Proposal/InDesign/ folder location
        function isProjectFolder(f) {
            var indesignFolder = new Folder(f.fsName + "\\Proposal\\InDesign")
            return (f.name[0] === "X")
        }

        // -------------------- Helper function finds largest indd document ------------------
        // Recursive
        function getLargestIndesign(fileArr, debugMode, largestFile, largestFileSize) {
            largestFile = (largestFile !== undefined) ? largestFile : new File();
            largestFileSize = (largestFileSize !== undefined) ? largestFileSize : 0
            if (debugMode) {
                alert(fileArr.length + "\nLargest File so far: " + largestFile.fsName + "\n Largest File Size: " + largestFileSize)
            }
            if (fileArr.length === 0) {
                return null

            } else if (fileArr.length === 1) {
                if (fileArr[0].length > largestFileSize) {
                    return fileArr[0]
                } else {
                    return largestFile
                }
            } else if (fileArr.length > 1) {

                if (fileArr[0].length > largestFileSize) {
                    return getLargestIndesign(fileArr.slice(1), debugMode, fileArr[0], fileArr[0].length)
                } else {
                    return getLargestIndesign(fileArr.slice(1), debugMode, largestFile, largestFileSize)
                }
            }
        }
        // TESTS
        // var indesignFolder = new Folder('C:\\Users\\wwitsken\\OneDrive - RRM Design Group\\Desktop\\Test M Drive Links\\X-Files-3000\\X3133-01-RC23-Heroes-Park\\Proposal\\InDesign')
        // var indesignFiles = indesignFolder.getFiles('*.indd')
        // var largestINDD = getLargestIndesign(indesignFiles, debugMode = true)
        // alert("Largest file: \n" + largestINDD)

        // ------------------------ Find INDD Documents, create JSON ------------------------

        function findProposals(rootfolder, debugMode) {
            // Get list of group directories with names that match the pattern "X-Files" and have length 12 characters
            var groupFolders = rootfolder.getFiles(mask = testGroupFolder);
            var validatedProjectFolders = [];
            var files = [];

            for (var i = 0; i < groupFolders.length; i++) {
                validatedProjectFolders = validatedProjectFolders.concat(groupFolders[i].getFiles(mask = isProjectFolder))
                if (debugMode) {
                    alert("iteration: " + (i + 1) + " of " + groupFolders.length + "\nGroup folder: " + groupFolders[i] + "\nProject folders:\n" + validatedProjectFolders)
                }
            }

            // alert("Total folder count: " + validatedProjectFolders.length)

            for (var i = 0; i < validatedProjectFolders.length; i++) {
                var indesignFolder = new Folder(validatedProjectFolders[i].fsName + "\\Proposal\\InDesign")
                var indesignFiles = indesignFolder.getFiles('*.indd')
                var largestFile = getLargestIndesign(indesignFiles)
                if (largestFile) {
                    files.push(largestFile)
                }
            }

            return files
        }

        // TESTS
        // var findProposalsPrint = ""
        // var findProposalsResult = findProposals(ROOTFOLDER, debugMode = true)
        // for (var i = 0; i < findProposalsResult.length; i++) {
        //     findProposalsPrint = findProposalsPrint.concat(findProposalsResult[i].displayName + "\n")
        // }
        // alert("Completed findProposals test:\n" + findProposalsPrint)

        // --------------------------------- UI ----------------------------------------------
        function links_ui(arr, debugTime) {
            var b;
            var t;
            var tDebug;
            var guide;
            var w;
            w = new Window("palette", "Progress", undefined, {
                closeButton: false
            });

            guide = w.add('statictext')
            guide.preferredSize = [450, -1];
            guide.text = 'Press ESC to exit the program'

            tDebug = w.add('statictext')
            tDebug.preferredSize = [450, -1];
            tDebug.text = 'Time to scan files: ' + (debugTime / 1000) + " seconds. Files scanned: " + arr.length

            t = w.add('statictext');
            t.preferredSize = [450, -1]; // 450 pixels wide, default height.

            if (arr.length) {
                b = w.add("progressbar", undefined, 0, arr.length);
                b.preferredSize = [450, -1]; // 450 pixels wide, default height.
            }
            links_ui.close = function() {
                w.close();
            };
            links_ui.increment = function() {
                b.value++;
            };
            links_ui.message = function(message) {
                t.text = message;
            };

            w.show();
        };

        // --------------------------------- Main --------------------------------------------
        function main() {
            var start = Date.UTC(new Date());
            var proposals = findProposals(ROOTFOLDER);
            var end = Date.UTC(new Date());
            var elapsed = end - start;
            var inddProposals = []
            links_ui(proposals, elapsed)

            // Loop over reading the files
            for (var i = 0; i < proposals.length; i++) {
                links_ui.message("Analyzing proposal " + i + ": " + proposals[i].displayName)
                var p = processDocument(proposals[i])
                if (p) {
                    inddProposals.push(p)
                }
                links_ui.increment()
            }
            links_ui.close()
            return JSON.stringify(inddProposals, null, 2)
        }
        var jsonString = main();
        var finalFile = new File("~/Desktop/" + "linksINDD.json");
        if (finalFile.open("w")) {
            finalFile.write(jsonString)
            finalFile.close();
        }
        return
    }
})();