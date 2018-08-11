function searchRestaurant(query) {
    const searchData = {"search_term": query};
    $.ajax({
        url: '/search',
        type: 'post',
        dataType: 'html',
        contentType: 'application/json',
        data: JSON.stringify(searchData),

        beforeSend: function(xhr, settings) {
            var csrftoken = Cookies.get('csrftoken');
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
            console.log(`searching: ${JSON.stringify(searchData)}`);
        },
        success: function(data) {
            $('#search_container').replaceWith(data);
            $('.clear_search a').click(event => {
                resetSearch();
            });
            $('#search_results .btn').each(function() {
                var restaurant_id = $(this).data('restaurant');
                $(this).click(event => {
                    $('#create_event_modal').find('button[type=submit]').show();
                    $('#create_event_modal').off('show.bs.modal');
                    $('#create_event_modal').on('show.bs.modal', () => {
                        createEventGet(restaurant_id);
                    });
                    $('#create_event_modal').modal('show');
                });
            });
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(`an error occured during search`);
        }
    });
}

function resetSearch() {
    $.ajax({
        url: `/search`,
        type: 'get',
        dataType: 'html',

        beforeSend: function(xhr, settings) {
            var csrftoken = Cookies.get('csrftoken');
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
            console.log('resetting search');
        },
        success: function(data) {
            $('#search_container').replaceWith(data);
            $('#search_term').val('');
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(`an error occured during search reset`);
        }
    });   
}

function createEventGet(restaurant_id) {
    $.ajax({
        url: `/createEvent/${restaurant_id}`,
        type: 'get',
        dataType: 'html',

        beforeSend: function(xhr, settings) {
            var csrftoken = Cookies.get('csrftoken');
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
            console.log(`getting create event for : ${restaurant_id}`);
        },
        success: function(data) {
            $('#create_event_modal').find('.modal-body').html(data);
            $('#add_attendee_btn').click(event => {
                const name = $('#add_colleague').val();
                if (name == 'Select...')
                    return;
                const id = $(`#add_colleague option[value='${name}']`).attr('data-id');
                console.log(`id: ${id}, name: ${name}`);

                $('#attendees').append(
                    $('<li>').attr('id', id).text(name).append(
                        $('<a>').attr('class', 'remove_attendee').attr('href','#').append(
                            $('<i>').attr('class', 'far fa-trash-alt ml-2')
                        ).click(function() {
                            $(`#${id}`).remove();
                            $('#add_colleague').append(
                                $('<option>').attr('value', name).attr('data-id', id).text(name)
                            );
                            validateCreateEvent();
                        })
                    )
                );
                $('#add_colleague').val('');
                $(`#add_colleague option[value='${name}']`).remove();
            });

            $('#create_event_date').change(event => {
                validateCreateEvent();
            });

            $('#create_event_time').change(event => {
                validateCreateEvent();
            });

            $('#add_attendee_btn').click(event => {
                validateCreateEvent();
            });

            validateCreateEvent();
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(`an error occured during event get`);
        }
    });
}

function createEventPost(restaurant_id) {
    var attendees_list = [];
    $('#attendees li').each(function() {
        attendees_list.push({'id': $(this).attr('id'),
                               'name': $(this).text()})
    });

    const data = {
        'restaurant_id': restaurant_id,
        'attendees': attendees_list,
        'event_date': $('#create_event_date').val(),
        'event_time': $('#create_event_time').val()
    }
    $.ajax({
        url: `/createEvent/${restaurant_id}`,
        type: 'post',
        dataType: 'html',
        contentType: 'application/json',
        data: JSON.stringify(data),

        beforeSend: function(xhr, settings) {
            var csrftoken = Cookies.get('csrftoken');
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
            console.log(`posting create event: ${JSON.stringify(data)}`);
        },
        success: function(data) {
            $('#create_event_modal').find('.modal-body').html(data);
            $('#create_event_modal').find('button[type=submit]').hide();
            getUpcomingLunches();
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(`an error occured during event post`);
        }
    });
}

function validateCreateEvent(){
    if ($('#create_event_date').val() != '' 
        && $('#create_event_time').val() != ''
        && $('#attendees li').length > 0) {
        $('#create_event_form button[type=submit]').prop("disabled",false);
        return true;
    } else {
        $('#create_event_form button[type=submit]').prop("disabled",true);
        return false;
    }
}

$(document).ready(function() {
    setupUpdateCompanyModal();
    setupColleagueCard();
    setupUpcomingLunchesCard();

    $('#navbar_search_form').submit(event => {

        if ($('#search_term').val() != '') {
            searchRestaurant($('#search_term').val());
        }

        return false;
    })

    $('#create_event_form').submit(event => {
        if (validateCreateEvent())
            createEventPost($('#event_restaurant_id').val());
        return false;
    })

});
