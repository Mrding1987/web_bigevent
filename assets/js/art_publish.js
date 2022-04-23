$(function() {
    var layer = layui.layer
    initcate()

    $('#btnselectpic').on('click', () => {
        $('#file').click()
    })

    $('#file').on('change', e => {
        var filelist = e.target.files
        if (filelist.length === 0) {
            return layui.layer.msg('请选择照片！')
        }

        var file = e.target.files[0]
        var newImgURL = URL.createObjectURL(file)
        $image.cropper('destroy').attr('src', newImgURL).cropper(options)
    })

    $('#btnPublish').on('click', e => {
        e.preventDefault();

        // 以下代码的作用：在启用富文本编辑器后，获取文本框内的纯文本内容。原来的textareea获取文本方法不能使用
        var activeEditor = tinymce.activeEditor;
        var editBody = activeEditor.getBody();
        activeEditor.selection.select(editBody);
        var text = activeEditor.selection.getContent({ 'format': 'text' })

        var fd = new FormData()
        fd.append('title', $('#title').val())
        fd.append('cate_id', $('#cateselect').val())
        fd.append('content', text)
        fd.append('state', '已发布')

        var dataURL = $image.cropper('getCroppedCanvas', {
                width: 400,
                height: 300
            })
            .toDataURL('image/png')
        var blob = dataURLtoBlob(dataURL)

        fd.append('cover_img', blob)

        // fd.forEach((v, k) => {
        //     console.log(k, v);
        // })

        $.ajax({
            type: 'POST',
            url: '/my/article/add',
            data: fd,
            contentType: false,
            processData: false,
            success: res => {
                if (res.status !== 0) return layer.msg('发表文章失败')
                layer.msg('文章发布成功')

                //将页面跳转到文章列表
                location.href = '../../article/art_list.html'
            }
        })
    })

    $('#btnDrift').on('click', e => {
        e.preventDefault();

        // 以下代码的作用：在启用富文本编辑器后，获取文本框内的纯文本内容。原来的textareea获取文本方法不能使用
        var activeEditor = tinymce.activeEditor;
        var editBody = activeEditor.getBody();
        activeEditor.selection.select(editBody);
        var text = activeEditor.selection.getContent({ 'format': 'text' })

        var fd = new FormData()
        fd.append('title', $('#title').val())
        fd.append('cate_id', $('#cateselect').val())
        fd.append('content', text)
        fd.append('state', '草稿')

        var dataURL = $image.cropper('getCroppedCanvas', {
                width: 400,
                height: 300
            })
            .toDataURL('image/png')
        var blob = dataURLtoBlob(dataURL)

        fd.append('cover_img', blob)

        // fd.forEach((v, k) => {
        //     console.log(k, v);
        // })

        $.ajax({
            type: 'POST',
            url: '/my/article/add',
            data: fd,
            contentType: false,
            processData: false,
            success: res => {
                if (res.status !== 0) return layer.msg('存为草稿失败')
                layer.msg('存为草稿成功')

                //将页面跳转到文章列表
                location.href = '../../article/art_list.html'
            }
        })
    })
})

function initcate() {
    $.ajax({
        type: 'GET',
        url: '/my/article/cates',
        success: res => {
            if (res.status !== 0) return layer.msg('初始化文章分类失败')
            var htmlStr = template('catelist', res)
            $('[name=artcate]').html(htmlStr)

            //一定要调用layui form的render函数才能在页面显示下拉项
            layui.form.render()
        }
    })
}

function dataURLtoBlob(dataURL) {
    var arr = dataURL.split(',')
    var mime = arr[0].match(/:(.*?);/)[1]
    var bstr = atob(arr[1])
    var n = bstr.length
    var u8arr = new Uint8Array(n)

    while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
    }

    return new Blob([u8arr], { type: mime })

}