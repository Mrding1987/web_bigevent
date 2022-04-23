$(function() {
    var layer = layui.layer
    initcate()
    initEditPage()

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

    $('#cfmedit').on('click', e => {
        e.preventDefault();
        var fd = {}
        getFormdata('已发布')
        submitUpdate()
        localStorage.removeItem('id')
    })

    $('#draftdit').on('click', e => {
        e.preventDefault();
        var fd = {}
        getFormdata('草稿')
        submitUpdate()
        localStorage.removeItem('id')
    })




    $('#notedit').on('click', () => {
        localStorage.removeItem('id')
        location.href = '../../article/art_list.html'
    })



})

function initEditPage() {
    let id = localStorage.getItem('id')
    $.ajax({
        type: 'GET',
        url: '/my/article/' + id,
        success: res => {
            if (res.status !== 0) return layer.msg('获取文章信息失败')

            console.log(res.data[0]);
            // 下面需要实现的功能：把对应文章的信息初始化到修改文章的页面上
            $('#title').val(res.data[0].title)
            $('#cateselect').val(res.data[0].cate_id)
            $('#mytextarea').val(res.data[0].content)
            $('#image').val(res.data[0].cover_img)
            layui.form.render()

        }
    })
}

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

function getFormdata(state) {
    // 以下代码的作用：在启用富文本编辑器后，获取文本框内的纯文本内容。原来的textareea获取文本方法不能使用
    var activeEditor = tinymce.activeEditor;
    var editBody = activeEditor.getBody();
    activeEditor.selection.select(editBody);
    var text = activeEditor.selection.getContent({ 'format': 'text' })

    fd = new FormData()
    fd.append('id', localStorage.getItem('id'))
    fd.append('title', $('#title').val())
    fd.append('cate_id', $('#cateselect').val())
    fd.append('content', text)
    fd.append('state', state)

    var dataURL = $image.cropper('getCroppedCanvas', {
            width: 400,
            height: 300
        })
        .toDataURL('image/png')
    var blob = dataURLtoBlob(dataURL)

    fd.append('cover_img', blob)
}

function submitUpdate() {
    $.ajax({
        type: 'POST',
        url: '/my/article/edit',
        data: fd,
        contentType: false,
        processData: false,
        success: res => {
            if (res.status !== 0) return layer.msg('更新文章失败')
            layer.msg('更新发布成功')

            //将页面跳转到文章列表
            location.href = '../../article/art_list.html'
        }
    })
}