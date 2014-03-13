;$(function() {
    var harvest = {
        'version': '0.0.1',
        'config': {
            'url': "http://www.baidu.com/s?ie=utf-8&bs=YOLO&f=3&rsv_bp=1&rsv_spt=3&wd=%E5%91%A8%E6%9D%B0%E4%BC%A6&rsv_sug3=3&rsv_sug=0&rsv_sug4=38&rsv_sug1=2&oq=zhou&rsp=1&rsv_sug2=1&rsv_sug5=0&inputT=3456",
            'json': '',
            "pageType": 'html'
        }
    };
    // export to global
    window.harvest = harvest;
    // $(window).keydown(function(e){
    //     if(e.keyCode == 116)
    //     {
    //         if(!confirm("刷新会将所有数据情况，确定要刷新么？"))
    //         {
    //             e.preventDefault();
    //         }
    //     }
    // });
    // Editor config
    if (!!jade && jade.url) {
        harvest.config.url = unescape(jade.url);
    } 

    $.cookie("url", harvest.config.url, {expires: 7, path: "/"});
    $.cookie("proxy", true, {expires: 7, path: "/"});

    var editor = ace.edit("editor");
    editor.setTheme("ace/theme/chrome"); 
    editor.getSession().setMode("ace/mode/javascript");
    
    if (jade && jade.code) {
        editor.setValue(unescape(jade.code));
    } else if (localStorage.getItem("code")) {
        editor.setValue(localStorage.getItem("code"));
    } else {
        editor.setValue("/* Edit your js code with powerful JQuery & Run it! */");
    }

    // setInterval("window.localStorage.setItem('code', window.harvest.editor.getValue())",300);
    harvest.editor = editor;
    // Init web socket
    if (/Firefox\/\s/.test(navigator.userAgent)){
        var iosocket = io.connect({transports:['xhr-polling']}); 
    } 
    else if (/MSIE (\d+.\d+);/.test(navigator.userAgent)){
        var iosocket = io.connect({transports:['jsonp-polling']}); 
    } 
    else { 
        var iosocket = io.connect(); 
    }
    var from = $("#uuap").text();

    iosocket.on('connect', function () {
        iosocket.emit('online',JSON.stringify({user:from}));
        sandbox.model.addHistory({'command': 'WebSocket', 'result': 'connect to server'});

        iosocket.on('message', function(message) {
            if (message !== "") {
                var item = JSON.parse(message);
                sandbox.model.addHistory(item);
            }
        });
        iosocket.on('disconnect', function() {
            sandbox.model.addHistory({'command': 'WebSocket', 'result': 'disconnect to server'});
        });
    });

    // Init Panel
    var sizeLeft = $('.Splitter')[0]["offsetLeft"] - 3;
    // Horizontal splitter, nested in the right pane of the vertical splitter.
    v13("#LeftPane").splitter({
		splitHorizontal: true,
		sizeTop: true,
		accessKey: "H"
	});
	// Vertical splitter. Set min/max/starting sizes for the left pane.
    v13("#Splitter").splitter({
    	splitVertical: true,
        type: "v",
        outline: true,
        minLeft: 300, sizeLeft: sizeLeft, maxLeft: 1300,
        anchorToWindow: true,
        accessKey: "L",
        resizeTo: window
    });

    // Init console
    window.sandbox = new Sandbox.View({
            // these two are required:
        model : new Sandbox.Model(), // see below for more
        el : $('#sandbox'), // or etc.
        
        // these are optional (defaults are given here):
        resultPrefix : "  => ",
        helpText : "type javascript commands into the console, hit enter to evaluate. \n[up/down] to scroll through history, ':clear' to reset it. \n[alt + return/up/down] for returns and multi-line editing.",
        tabCharacter : "\t",
        placeholder : "// type some javascript and hit enter (:help for info)"
    });
    $(window).on('unload', function (event){
        if (event.clientX>document.body.clientWidth && event.clientY<0 || event.altKey) {   
            $.cookie("proxy", null);
        }
        return "This should create a pop-up";
    });
});
