//每次调用ajax请求的时候，会先调用下面这个函数
//options是我们给ajax提供的配置对象
$.ajaxPrefilter((options) => {
    options.url = 'http://192.168.1.11' + options.url
})