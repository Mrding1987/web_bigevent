$(function() {
    $('#btnChoose').on('click', () => {
        $('#file').click()
    })

    $('#file').on('change', e => {
        console.log(e);
        var filelist = e.target.files
        if (filelist.length === 0) {
            return layui.layer.msg('请选择照片！')
        }

        var file = e.target.files[0]
        var newImgURL = URL.createObjectURL(file)
        $image.cropper('destroy').attr('src', newImgURL).cropper(options)
    })

    $('#btnUpload').on('click', e => {
        var dataURL = $image.cropper('getCroppedCanvas', {
                width: 100,
                height: 100
            })
            .toDataURL('image/png') //将裁剪后的图片生成base64格式图片

        $.ajax({
            type: 'POST',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success: res => {
                if (res.status !== 0) return layui.layer.msg('更新头像失败！')
                layui.layer.msg('更新头像成功！')
                window.parent.getUserInfo()
            }
        })
    })
})