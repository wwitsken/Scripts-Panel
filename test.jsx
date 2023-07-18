(function() {
    var file = new File("~/Desktop/" + "output.json");
    var jsonString = '{"key": "value"}';
    if (file.open("w")) {
        file.write(jsonString)
        file.close();
    }
})();