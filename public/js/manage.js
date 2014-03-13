;$(function() {
    // $('.page-region-content').load('/manage/ajax/' + jade.group + "/" + jade.subgroup);
    $('.sub-menu li a').on('click', function (e) {
        e.preventDefault();
        var subgroup = $(this).attr('href'),
            group = $(this).data("group");
        $('.page-region-content').load('/manage/ajax/' + group + "/" + subgroup);
        window.history.pushState(null, group , '/manage/' + group + "/" + subgroup);
        $('.sub-menu li.liselected').removeClass("liselected");
        $(this).parent().addClass("liselected");
        return false;
    });
    $(".sub-menu li a[href=" + jade.subgroup + "]").click();
    $(".page-region-content").on("click", "button[data-role='preview']",function (e) {
        // alert("edit");
        var tid = $(this).attr("href");
        window.location.href = "/edit/" + tid;
    });

    $("li#Create a").on('click', function (e) {
        e.preventDefault();
        $.get('/createform/', function(data) {
            if(!data) return;
            var markup = data;
            $.Dialog({
                'title'       : 'Create Template',
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
                            $("#create_form").submit();
                        }
                    },
                    '取消'     : {
                        'action': function(){}
                    }
                }
            });
        });
    });

    $(".page-region-content").on("click", "button[data-role='edit']",function (e) {
        // var $tr = $(this).parent().parent(), uid;
        // if ($("#meta-container")) {
        //     uid = $("#meta-container").parent().attr("uid");
        //     $("#meta-container").remove();
        // }

        // if (!uid || $tr.attr("id") !== uid) {
        //     var $meta_tr = $("<tr>").attr('uid', $tr.attr("id")).hide().append("<td colspan='6' id='meta-container'></div>")
        //     $tr.after($meta_tr);
        //     $("#meta-container").load('/meta/' + $tr.attr("id"));
        //     $meta_tr.show(); 
        // }
        var tid = $(this).attr("href");
        $.get('/meta/' + tid, function(data) {
            if(!data) return;
            var markup = data;
            $.Dialog({
                'title'       : 'Meta Info',
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
                            $("#metaedit").submit();
                        }
                    },
                    '取消'     : {
                        'action': function(){}
                    }
                }
            });
        });
    });
    $(".page-region-content").on("click", "button[data-role='remove']",function (e) {
        var tid = $(this).attr("href");
        $.get("/remove/" + tid, function (data) {
            console.log(data);
            if (data.code === 0) {
                $("#" + tid).remove();
            } else {
                $.Dialog({
                    'title'       : 'Error Info',
                    'content'     : data.msg,
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
                            }
                        },
                        '取消'     : {
                            'action': function(){}
                        }
                    }
                });
            }
        })
    });
});