$(".share--tab:last-child").addClass 'uk-active'

buttonAddBox = $ '[js-button="addBox"]'
buttonAddBox.removeAttr 'disabled'

buttonAddBox.click ->

    link = Math.random().toString(36).substring(3)

    $(@).prop 'disabled', true

    $box = $('[js-box="template"]').clone()

    $box.find('svg').remove()

    $box.find('[js-card-title]').text(link)
    $box.find('[js-public-link]').text("https://domain.tld/#{link}")

    $box
        .attr 'js-box', 'live'
        .insertAfter $('[js-entrypoint]')
        .addClass 'uk-animation-slide-left-small'
        .slideDown 250

$(document).on 'click', '[js-box] [js-button]', (e)->
    e.preventDefault();

    button     = $ @
    buttonType = button.attr 'js-button'
    parentBox  = button.parents('[js-box]')

    if buttonType is "cancel"
        parentBox
            .toggleClass 'uk-animation-slide-left-small uk-animation-slide-right-small uk-animation-reverse'
            .slideUp 250

        setTimeout( ->
            parentBox.remove()
            buttonAddBox.removeAttr 'disabled'
        , 250)

$(document).on 'keyup', '[js-input="sendmail"]', (e)->

    $box = $(@).parents '[js-box]'
    $button = $box.find '[js-button="save"]'
    val = $(@).val()

    if val.length > 0
        $button.text 'Save & send'
    else
        $button.text 'Save'

$(document).on 'click', '[js-button="save"]', (e)->

    $ '[js-box="live"] [js-card-header], [js-box="live"] [js-history]'
        .show()
        .addClass 'uk-animation-fade'

    $ '[js-box="live"] [js-form]'
        .slideUp()

    $ '[js-box="live"] [js-button="cancel"]'
        .remove()

    $ '[js-box="live"] [js-button="remove"]'
        .show()

    $ '[js-box="live"] [js-button="save"]'
        .text 'edit'

    $ '[js-button="addBox"]'
        .removeAttr 'disabled'