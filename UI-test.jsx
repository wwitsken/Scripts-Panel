function links_ui(steps) {
    var b;
    var t;
    var w;
    var c;
    w = new Window("palette", "Progress", undefined, {
        closeButton: false
    });

    t = w.add('statictext');
    t.preferredSize = [450, -1]; // 450 pixels wide, default height.

    c = w.add('button', undefined, 'Cancel')

    if (steps) {
        b = w.add("progressbar", undefined, 0, steps);
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

// Example is ten things to do. That is the number of 'steps' to do.

var steps = 10;
links_ui(steps);
// Your loop of something to do...
for (var i = 0; i < steps; i++) {
    $.sleep(500)
    links_ui.message("Doing step " + i);

    // Do something.
    links_ui.increment();
}
// All done.
links_ui.close();

$.writeln("This is a test! :D")