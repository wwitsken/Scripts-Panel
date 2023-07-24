(function() {
    function testProjectFolder(f) {
        var indesignFolder = new Folder(f.fsName + "\\Proposal\\InDesign")
        // alert(indesignFolder.getFiles('*.indd').length)
        return (f.name[0] === "X" && indesignFolder.getFiles('*.indd').length > 0)
    }

    var testFolder = new Folder('N:\\X-FILES\\X-Files-3000\\X3001-02-PS23-Scotts-Valley-FS-No1');
    var testNullFolder = new Folder('N:\\X-FILES\\X-Files-3000\\X3006-01-RS23-Robinson-Road-Landscape-Arch-Services')

    alert(testProjectFolder(testNullFolder))
    alert(testProjectFolder(testFolder))
})();