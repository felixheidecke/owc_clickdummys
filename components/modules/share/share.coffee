share = new Vue(
    el: '#share'
    data:
        sidebar:
            buttonAddLink: true
        shares: []
    methods:
        addLink: ->
            @.sidebar.buttonAddLink = false
            @.shares.push(
                hash: Math.random().toString(36).substring(3)
                allowUploads: false
                password: null
                expires: null
                expanded: true
                changes: false
                buttonSave: false
                created: Date.now()
                history: []
            )
)

Vue.component("publink"
    template : "#publink"
    props    : ['publink']
    data     : ->
        link: @.publink
    computed:
        linkUrl: ->
            "http://domain.com/#{@.link.hash}"

    methods:
        save: (e) ->
            UIkit.notification("Saved!", 'success');
            @.link.buttonSave = false
            e.preventDefault()

        changes: (e) ->
            @.link.buttonSave = true
            e.preventDefault()

        edit: (e) ->
            @.expand()
            e.preventDefault()

        close: (e) ->
            @.collapse()
            e.preventDefault()

        trash: (e) ->

            index = @._indexOf()

            UIkit.modal.confirm("Delete #{@.link.hash}").then( ->
                share.shares.splice index, 1
                share.sidebar.buttonAddLink = true
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
            share.sidebar.buttonAddLink = false

        collapse: ->
            @.link.expanded = false
            share.sidebar.buttonAddLink = true

        addHistory: (event) ->
            @.link.history.push(event)

        _indexOf: ->
            _.indexOf share.shares, @.link

    mounted: ->
        @.addHistory "Created on " + moment(@.created).format "lll"


)