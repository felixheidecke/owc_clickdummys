$(document).ready ->
    setTimeout(->
        $('svg + svg').remove()
    , 1000)