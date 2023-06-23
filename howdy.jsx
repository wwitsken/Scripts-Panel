(function () {

    // Script variables
    var pdfPresetNames;
    var title = "Adobe Script Tutorial 2"

    // Reusable UI variables
    var g; // group
    var p; // panel
    var w; // window

    // Permanent UI variables

    var btnCancel;
    var btnFolderInput;
    var btnOk;
    var listPdfPresets;
    var txtFolderInput;

    // Setup
    
    // Load application PDF presets
    pdfPresetNames = app.pdfExportPresets.everyItem().name;
    pdfPresetNames.sort();

    // Create User Interface

    w = new Window("dialog", title);
    w.alignChildren = "fill";
    p = w.add("panel")
    g = p.add("group");
    g.alignment = "left";
    btnFolderInput = g.add("button", undefined, "Folder...");
    txtFolderInput = g.add("statictext", undefined, "", {
        truncate: "middle"
    });
    txtFolderInput.preferredSize = [200, -1];
    p = w.add("panel", undefined, "Options");
    g = p.add("group");
    g.add("statictext", undefined, "PDF preset:");
    listPdfPresets = g.add("dropdownlist", undefined, pdfPresetNames);
    g = w.add("group");
    g.alignment = "center";
    btnOk = g.add("button", undefined, "OK");
    btnCancel = g.add("button", undefined, "Cancel");

    // UI Event Handlers

    btnFolderInput.onClick = function() {
        var f = Folder.selectDialogue();
        if (f) {
            txtFolderInput.text = f.fullName;
        }

    };

    btnOk.onClick = function () {
        w.close(1);
    };

    btnCancel.onClick = function () {
        w.close(0);
    };

    // Show the window

    // w.show();

    if(w.show() == 1) {
        // alert("OK was clicked");
        process();
        alert("Done", title, false);
    }

    function process() {
        // alert("Happy trails, cowboy");
        var doc;
        var filePdf;
        var files;
        var i;
        var pdfPreset;
        // Get PDF preset chosen
        pdfPreset = app.pdfExportPresets.item(listPdfPresets.selection.text);
        // Ignore messages when opening documents
        app.scriptPreferences.userInteractionLevel = UserInteractionLevels.NEVER_INTERACT;
        // Set export preferences to all pages
        app.pdfExportPreferences.pageRange = PageRange.ALL_PAGES;
        // Get Indesign files in folder
        files = new Folder(txtFolderInput.text).getFiles("*indd");
        // Loop through files array
        for (i = 0; i < files.length; i++) {
            doc = app.open(files[i]);
            filePdf = new File(files[i].fullName.replace(/|.indd$/i, "") + ".pdf");
            doc.exportFile(ExportFormat.PDF_TYPE, filePdf, false, pdfPreset);
            doc.close(SaveOptions.NO);
        }
    }

})();