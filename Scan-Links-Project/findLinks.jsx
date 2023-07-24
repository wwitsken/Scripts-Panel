#include "json2-mini.js";

(function() {
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

})