function validatePassword(){
    if($('#id_password1').val() != $('#id_password2').val()) {
        $('#password-error').prop('hidden', false);
        $('button').prop('disabled', 'disabled');
    } else {
        $('#password-error').prop('hidden', 'hidden');
        $('button').prop('disabled', false);
    }
}

$(document).ready(function() {
    $('#id_password1').change(() => {
        validatePassword()
    });
    $('#id_password2').keyup(() => {
        validatePassword()
    });
});