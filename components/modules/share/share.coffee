share = new Vue(
    el: '#share'
    data:
        shares: []
    methods:
        addLink: ->
            @.shares.push(
                hash: Math.random().toString(32).substring(2, 15)
                data:
                    password: null
                    expires: null
                    rw: false
                created: Date.now()
                expanded: true
                history: []
            )
)

Vue.component("publink"
    template : "#publink"
    props : ['link']
    data : ->
        modified: false

    computed:
        linkUrl: ->
            "http://domain.com/#{@.link.hash}"

    methods:
        notify: (e) ->
            @.modified = true
            UIkit.notification(e + "!", 'warning');

        close: (e) ->
            @.collapse()
            e.preventDefault()

        trash: (e) ->

            index = @._indexOf()

            UIkit.modal.confirm("Delete #{@.link.hash}").then( ->
                share.shares.splice index, 1
            , ->
                console.log 'wimp!'
            )
            e.preventDefault()

        mailto: (e)->

            self = @

            UIkit.modal.prompt('Send link to:').then( (mail) ->
                if mail
                    self.addHistory "Send to #{mail}"
            )
            e.preventDefault()

        expand: ->
            @.link.expanded = true

        collapse: ->
            @.link.expanded = false

        addHistory: (event) ->
            @.link.history.push(event)

        undo: (e) ->
            UIkit.notification("Changes undone!", 'danger');

            @.modified = false
            @.link.data.password = null
            @.link.data.expires = null
            @.link.data.rw = false

            e.preventDefault()

        _indexOf: ->
            _.indexOf share.shares, @.link

    mounted: ->
        @.addHistory "Created on " + moment(@.created).format "lll"

)