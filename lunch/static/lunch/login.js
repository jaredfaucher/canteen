$(document).ready(function() {
    $('#id_username').keyup(() => {
        $('#password-error').prop('hidden', 'hidden');
    });
    $('#id_password').keyup(() => {
        $('#password-error').prop('hidden', 'hidden');
    });
});