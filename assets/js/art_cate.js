$(function() {
    getArticleList()
    const layer = layui.layer
    $('#addcate').on('click', e => {
        e.preventDefault();
        let index = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html(),
        })

        $('#catename').on('click', e => {
            e.preventDefault()
            $.ajax({
                type: 'POST',
                url: '/my/article/addcates',
                data: {
                    name: $('#name').val().trim(),
                    alias: $('#alias').val().trim()
                },
                success: res => {
                    if (res.status !== 0) return layer.msg('添加文章分类失败')
                    layer.msg('添加文章分类成功')
                    $('#catealias').click()
                    layer.close(index)
                    getArticleList()
                }
            })
        })
        $('#catealias').on('click', () => {
            $('#name').val('')
            $('#alias').val('')

        })
    })

    $('tbody').on('click', '#btneditcate', (e) => {
        console.log(e);
        let index = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html(),
        })

        //从控制台中找到e.target.dataset中可以拿到id数据
        let num = e.target.dataset.id;

        $.ajax({
            type: 'GET',
            url: '/my/article/cates/' + num,
            success: res => {

                $('#name').val(res.data.name)
                $('#alias').val(res.data.alias)
            }
        })

        $('#cfmedit').on('click', e => {
            console.log(e);
            e.preventDefault()
            $.ajax({
                type: 'POST',
                url: '/my/article/updatecate',
                data: {
                    Id: num,
                    name: $('#name').val().trim(),
                    alias: $('#alias').val().trim()
                },
                success: res => {
                    console.log(res);
                    if (res.status !== 0) return layer.msg('修改文章分类失败')
                    layer.msg('修改文章分类成功')
                    layer.close(index)
                    getArticleList()
                }
            })
        })
        $('#cfmreset').on('click', () => {
            $('#name').val('')
            $('#alias').val('')

        })
    })

    $('tbody').on('click', '#btndeletecate', (e) => {
        layui.layer.confirm('确定删除吗？', { icon: 3, title: '提示' }, index => {
            $.ajax({
                type: 'GET',
                url: '/my/article/deletecate/' + e.target.dataset.id,
                success: res => {
                    if (res.status !== 0) return layer.msg('删除文章分类失败')
                    layer.msg('删除文章分类成功！')
                    getArticleList()
                }
            })
            layer.close(index)
        })

    })

})

function getArticleList() {
    $.ajax({
        type: 'GET',
        url: '/my/article/cates',
        success: res => {
            //以下为传统方式进行数组循环及动态创建元素
            /*  for (var i = 0; i < res.data.length; i++) {
                            var $tr = "<tr><td>" + res.data[i].name + "</td><td>" + res.data[i].alias + "</td><td></td></tr>"
                            $('tbody').append($tr)
                        } */

            //以下为使用模板引擎方法的动态创建元素
            var htmlStr = template('tpl-table', res)
            $('tbody').html(htmlStr)
        }
    })
}