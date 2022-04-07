$(function() {
    $('#link_reg').on('click', () => {
        $('.login-box').hide()
        $('.reg-box').show()
    })

    $('#link_login').on('click', () => {
        $('.login-box').show()
        $('.reg-box').hide()
    })

})