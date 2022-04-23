//定义Ajax请求的查询参数
var q = {
    pagenum: 1,
    pagesize: 2,
    cate_id2: undefined,
    state2: undefined
}

$(function() {
    var layer = layui.layer
    initList()
    getCate()

    $('#qselect').on('click', e => {
        e.preventDefault();
        q.cate_id2 = $('#cate_id2').val() ? $('#cate_id2').val() : undefined
        q.state2 = $('#state2').val() ? $('#state2').val() : undefined
        $('tbody').html('')
        initList()
    })

    $('tbody').on('click', '#read-art', e => {
        e.preventDefault()
        let id = e.target.dataset.id
        $.ajax({
            type: 'GET',
            url: '/my/article/' + id,
            success: res => {
                if (res.status !== 0) return layer.msg('查看文章失败')
                console.log(res.data);
                let resStr = '<h2 style="margin: 10px auto">' + res.data[0].title + '</h2><p>' + res.data[0].content + '</p>'


                //显示封面图片的功能没做完，后续补上，能力暂时达不到
                layer.open({
                    type: 1,
                    skin: 'layui-layer-rim', //加上边框
                    area: ['600px', '450px'], //宽高
                    content: resStr

                });
            }
        })

    })

    $('tbody').on('click', '#delete-art', e => {
        e.preventDefault()

        //下面这句代码是用来获取当前页面上有几个删除按钮，用来判断在删除完成后是否需要将页码值减1,但是实测之后不起作用
        /* let len0 = $('#delete-art').length
        console.log('len0:' + len0); */

        // 打印事件对象e之后找到了以下这个可以找出当前页面还是多少删除按钮的参数：
        let len = e.delegateTarget.childElementCount

        let id = e.target.dataset.id

        layer.confirm('确定删除吗？', { icon: 3, title: '提示' }, index => {
            $.ajax({
                type: 'GET',
                url: '/my/article/delete/' + id,
                success: res => {
                    if (res.status !== 0) return layer.msg('删除文章失败')
                    layer.msg('删除文章成功')
                    if (len === 1)
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    $('tbody').html('')
                    initList()

                }
            })
            layer.close(index)
        })


    })

    $('tbody').on('click', '#edit-art', e => {
        e.preventDefault()
        localStorage.setItem('id', e.target.dataset.id)
        location.href = '../../article/art_edit.html'
    })

})

function initList() {
    $.ajax({
        type: 'GET',
        url: '/my/article/list',
        data: q,
        success: res => {
            if (res.status !== 0) return layer.msg('获取文章列表失败')
            let htmlStr = template('tem-list', res)
            $('tbody').html(htmlStr)
            pageRender(res.total)
        }
    })
}

function getCate() {
    $.ajax({
        type: 'GET',
        url: '/my/article/cates',
        success: res => {
            if (res.status !== 0)
                return layer.msg('获取文章分类失败')
            let htmlStr = template('tem-cate', res)
            $('#cate-select').html(htmlStr)

            //以下代码用来将从数据库拿到的内容渲染到下拉框中，不加这段代码则页面不会显示任何下拉框内容
            layui.form.render()
        }
    })
}

function pageRender(total) {

    // 以下为分页模块的创建
    layui.use('laypage', function() {
        var laypage = layui.laypage;

        laypage.render({
            elem: 'test1', //注意，这里的 test1 是 ID，不用加 # 号   
            count: total, //数据总数，从服务端得到
            curr: q.pagenum,
            limit: q.pagesize,
            limits: [2, 3, 5, 10],
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            jump: function(obj, first) {
                //obj包含了当前分页的所有参数，比如：
                // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                // console.log(obj.limit); //得到每页显示的条数
                q.pagenum = obj.curr
                q.pagesize = obj.limit

                //首次不执行
                if (!first) {
                    //do something
                    initList()
                }
            }
        });
    });
}

/* function blobToDataURI(blob, callback) {
    var reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onload = function(e) {
        callback(e.target.result);
    }
} */