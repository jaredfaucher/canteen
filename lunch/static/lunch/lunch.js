function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

function getUpcomingLunches() {
    $.ajax({
        url: `/upcomingLunches`,
        type: 'get',
        dataType: 'html',

        beforeSend: function(xhr, settings) {
            var csrftoken = Cookies.get('csrftoken');
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
            console.log('getting upcoming lunches');
        },
        success: function(data) {
            $('#upcoming_lunches').replaceWith(data);
            setupUpcomingLunchesCard();
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(`an error occured during getUpcomingLunches`);
        }
    });
}

function getUpdateCompany() {
    $.ajax({
        url: '/updateCompany',
        type: 'get',
        dataType: 'html',

        beforeSend: function(xhr, settings) {
            var csrftoken = Cookies.get('csrftoken');
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
            console.log(`getting update company`);
        },
        success: function(data) {
            $('#update_company_modal').find('.modal-body').html(data);
            $('#new_company_div').hide();
            $('#update_company_modal').find('button[type=submit]').show();

            $('#company_select').change(event => {
                validateUpdateCompany();
            });

            $('#new_company').change(event => {
                if ($('#new_company').is(":checked")) {
                    $( "#company_select" ).val('none');
                    $( "#company_select" ).prop('disabled', 'disabled');
                    $( "#company_select" ).prop('required', false);
                    $('#new_company_div').show();
                    $('#new_company_name').prop('required','required');
                    $('#new_address_1').prop('required','required');
                    $('#new_city').prop('required','required');
                    $('#new_state').prop('required','required');
                    $('#new_zipcode').prop('required','required');
                } else {
                    $('#new_company_div').hide();
                    $('#new_company_name').val('');
                    $('#new_address_1').val('');
                    $('#new_address_2').val('');
                    $('#new_city').val('');
                    $('#new_state').val('');
                    $('#new_zipcode').val('');
                    $('#new_company_name').prop('required', false);
                    $('#new_address_1').prop('required', false);
                    $('#new_city').prop('required', false);
                    $('#new_state').prop('required', false);
                    $('#new_zipcode').prop('required', false);
                    $( "#company_select" ).prop('disabled', false);
                    $( "#company_select" ).prop('required','required');
                }
                validateUpdateCompany();
            });

            $('#new_company_name').keyup(event => {
                validateUpdateCompany();
            });

            $('#new_address_1').keyup(event => {
                validateUpdateCompany();
            });
            
            $('#new_city').keyup(event => {
                validateUpdateCompany();
            });
            
            $('#new_state').change(event => {
                validateUpdateCompany();
            });
            
            $('#new_zipcode').keyup(event => {
                validateUpdateCompany();
            });

            validateUpdateCompany();
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(`an error occured during getting update company`);
        }
    }); 
}

function updateCompany(data) {
    $.ajax({
        url: '/updateCompany',
        type: 'post',
        dataType: 'html',
        contentType: 'application/json',
        data: JSON.stringify(data),

        beforeSend: function(xhr, settings) {
            var csrftoken = Cookies.get('csrftoken');
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
            console.log(`updating company: ${JSON.stringify(data)}`);
        },
        success: function(data) {
            $('#update_company_modal').find('.modal-body').html(data);
            $('#close_company_modal').show();
            $('#update_company_form').find('button, .class').show();
            $('#update_company_modal').find('button[type=submit]').hide();
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(`an error occured during add`);
        }
    });
}


function validateUpdateCompany() {
    if ($('#new_company').is(":checked")) {
        if ($('#new_company_name').val() != '' && $('#new_address_1').val()
            && $('#new_city').val() != '' && $( "#new_state option:selected" ).val() != 'none' 
            && $('#new_zipcode').val() != '') {
            $('#update_company_form button[type=submit]').prop("disabled",false);
            return true;
        } else {
            $('#update_company_form button[type=submit]').prop("disabled",true);
            return false;
        }
    } else {
        if ($( "#company_select option:selected" ).val() != 'none') {
            $('#update_company_form button[type=submit]').prop("disabled",false);
            return true;
        } else {
            $('#update_company_form button[type=submit]').prop("disabled",true);
            return false;
        }
    }
}

function setupUpdateCompanyModal() {
    $('#new_company_div').hide();

    $('#update_company_modal').on('show.bs.modal', function() {
        getUpdateCompany();
    });

    if ($('#company_id').val() == '') {
        $('#update_company_modal').attr('data-backdrop', 'static');
        $('#update_company_modal').modal('toggle');
        $('#current_company_div').hide();
        $('#close_company_modal').hide();
        $('#update_company_form').find('button, .class').hide();
    }

    $('#update_company_form').submit(event => {
        if(validateUpdateCompany() != true)
            return false;
        var data;
        if ($('#new_company').is(":checked")) {
            data = {
                "new_company": true,
                "company_name": $('#new_company_name').val(),
                "address_1": $('#new_address_1').val(),
                "address_2": $('#new_address_2').val(),
                "city": $('#new_city').val(),
                "state": $('#new_state').val(),
                "zipcode": $('#new_zipcode').val() 
            }
        } else if ($( "#company_select option:selected" ).text() != 'none') {
            data = {
                "new_company": false,
                "company_id": $( "#company_select option:selected" ).val()
            }
        }
        updateCompany(data);
        return false;
    })
}

function getColleague(id) {
    $.ajax({
        url: `/getColleague/${id}`,
        type: 'get',
        dataType: 'html',

        beforeSend: function(xhr, settings) {
            var csrftoken = Cookies.get('csrftoken');
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
            console.log(`getting colleague: ${id}`);
        },
        success: function(data) {
            $('#view_colleague_modal').find('.modal-content').html(data);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(`an error occured during getting colleague`);
        }
    }); 
}

function setupViewColleagueModal(id) {
    $('#view_colleague_modal').off('show.bs.modal');
    $('#view_colleague_modal').on('show.bs.modal', function() {
        getColleague(id);
    });
}

function setupColleagueCard() {
    $('.colleague_list_item').each(function() {
        $(this).click(event => {
            const id = $(this).attr('id').split('_')[1];
            setupViewColleagueModal(id);
        })
    })
}

function getEvent(id) {
    $.ajax({
        url: `/getEvent/${id}`,
        type: 'get',
        dataType: 'html',

        beforeSend: function(xhr, settings) {
            var csrftoken = Cookies.get('csrftoken');
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
            console.log(`getting event: ${id}`);
        },
        success: function(data) {
            $('#view_event_modal').find('.modal-body').html(data);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(`an error occured during getting event`);
        }
    }); 
}

function setupViewEventModal(id) {
    $('#view_event_modal').off('show.bs.modal');
    $('#view_event_modal').on('show.bs.modal', function() {
        getEvent(id);
    });
}

function setupUpcomingLunchesCard() {
    $('.event_list_item').each(function() {
        $(this).click(event => {
            const id = $(this).attr('id').split('_')[1];
            setupViewEventModal(id);
        })
    })
}
