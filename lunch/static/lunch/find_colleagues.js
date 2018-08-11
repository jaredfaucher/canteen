function searchColleagues(query) {
    const searchData = {"search_term": query};
    $.ajax({
        url: '/searchColleagues',
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
                var colleague_id = $(this).data('colleague');
                $(this).click(event => {
                    addColleague(colleague_id);
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
        url: `/searchColleagues`,
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

function addColleague(id) {
    const searchData = {"user_id": id};
    $.ajax({
        url: `/addColleague/${id}`,
        type: 'post',
        dataType: 'html',

        beforeSend: function(xhr, settings) {
            var csrftoken = Cookies.get('csrftoken');
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
            console.log(`adding colleague: ${id}`);
        },
        success: function(data) {
            $('#colleagues_card').replaceWith(data);
            setupColleagueCard();
            $(`#${id}_card`).remove()
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(`an error occured during add colleague`);
        }
    }); 
}

$(document).ready(function() {
    setupUpdateCompanyModal();
    setupColleagueCard();
    setupUpcomingLunchesCard();

    $('#navbar_search_form').submit(event => {

        if ($('#search_term').val() != '') {
            searchColleagues($('#search_term').val());
        }

        return false;
    })
});