;$(function() {
    $('#Run').on('click',function(e){
        var code = harvest.editor.getValue(),
            url = harvest.config.url,
            vars = harvest.config.json,
            pageType = harvest.config.pageType;

        $.post('/Run', {code: code, url: url, vars: vars, pageType: pageType}, function(data) {
            if (data) {
                setframeWithHtml(data);
            } else {

            }
        });
    });

    $('#TidyUp').on('click',function(e){
        var code = '',
            url = harvest.config.url,
            pageType = harvest.config.pageType;

        $.post('/Run', {code: code, url: url, pageType: pageType}, function(data) {
            if (data) {
                setframeWithHtml(data);
            } else {
            }
        });
    });
    $("#Config").on('click', function (e) {
        e.preventDefault();
        var json = harvest.config.json || '';
        var pageType = harvest.config.pageType || 'html';
        var markup = [
            '<div class="grid span6">',
                '<div class="row">',
                    '<div style="line-height: 30px;" class="span2">',
                        '<h3>sandbox vars</h3>',
                    '</div>',
                    '<div class="span4 input-control text">',
                        '<input name="vars" type="text" value=\'' + json,
                        '\'>',
                    '</div>',
                '</div>',
                '<div class="row">',
                    '<div style="line-height: 30px;" class="span2">',
                        '<h3>page type</h3>',
                    '</div>',
                    '<div class="span4 input-control text">',
                        '<input name="pageType" type="text" value=\'' + pageType,
                        '\'>',
                    '</div>',
                '</div>',
            '</div>'
        ].join("");

        $.Dialog({
            'title'       : 'Config',
            'content'     : markup,
            'draggable'   : true,
            'overlay'     : true,
            'closeButton' : true,
            'buttonsAlign': 'right',
            'keepOpened'  : true,
            'position'    : {
                'zone'    : 'center'
            },
            'buttons'     : {

                '确认'     : {
                    'action': function(){
                        var vars = $("input[name='vars']").val().trim(),
                            pageType = $("input[name='pageType']").val().trim();
                        (pageType==="json") ? pageType = "json" : pageType = "html";
                        harvest.config.pageType = pageType;
                        if(vars) {
                            try{
                                console.dir(JSON.parse(vars));
                                harvest.config.json = vars;
   
                            } catch(e) {
                                alert("Invalid value, can not be parsed. Use JSON.parse() check it!");
                            }
                        }
                        // return false;
                    }
                },
                '取消'     : {
                    'action': function(){}
                }
            }
        });
    });
  	function setframeWithHtml(html) {
        $("#frame_container").empty()
            .append("<iframe src='proxy' style='width: 100%; height: 100%' name='preview'>");
        var iframe = window.frames["preview"];
        iframe.document.open();
        iframe.document.write(html);
        iframe.document.close();
  	}

    $('#Run').click();
});