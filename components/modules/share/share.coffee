ModalNew =
    template: '#modal-new'
    data : ->
        rw: false
        password: null
        expires: null
        history: []
        mail:
            recipients: null
            body: null

    methods:

        addHistory: (event) ->
            @.history.push(event)
            true

        reset: ->
            @.rw = false
            @.password = null
            @.expires = null
            @.history = []
            @.mail.recipients = null
            @.mail.body = null

        addLink: ->
            @.addHistory "Created on #{moment(@.created).format "lll"}"

            if @.mail.recipients
                self = @
                _.forEach( @.mail.recipients.split(' '), (mail) ->
                    self.addHistory "Send to #{mail}"
                )

            share.shares.push(
                hash: Math.random().toString(32).substring(2, 15)
                created: Date.now()
                data:
                    password: @.password
                    expires: @.expires
                    rw: @.rw
                history: @.history
            )

            @.reset()

ModalEdit =
    template : '#modal-edit'
    props    : ['link']
    methods  :

        addHistory: (event) ->
            @.history.push(event)
            true

        addLink: ->
            @.addHistory "Created on #{moment(@.created).format "lll"}"

            if @.mail.recipients
                self = @
                _.forEach( @.mail.recipients.split(' '), (mail) ->
                    self.addHistory "Send to #{mail}"
                )

            share.shares.push(
                hash: Math.random().toString(32).substring(2, 15)
                created: Date.now()
                data:
                    password: @.password
                    expires: @.expires
                    rw: @.rw
                history: @.history
            )

            @.reset()

Link =
    template : "#link"
    props : ['link']
    components:
        'modalEdit': ModalEdit
    computed:
        linkUrl: ->
            "http://domain.com/#{@.link.hash}"

    methods:
        trash: (e) ->
            index = @._indexOf()
            share.shares.splice index, 1

        edit: (e, i) ->
            UIkit.toggle(i, {target: '#add-modal'});
#            UIkit.toggle('#add-modal')

        _indexOf: ->
            _.indexOf share.shares, @.link

### Vue instance ###

$(document).ready ->
#    UIkit.modal('#add-modal')[0].toggle()


share = new Vue(
    el: '#share'
    components:
        'modalNew': ModalNew
        'modalEdit': ModalEdit
        'publink': Link
    data:
        shares: []
        modal: null
        modaldata: null
        create:
            rw: false
            password: 'otto'
            expires: null
            recipient: null
            message: null
)