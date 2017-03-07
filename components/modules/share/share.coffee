addUserShareModal =
    template: '#add-user-share-modal'
    props: ['user', 'name']
    data: ->
        tooltipShare: "Allow #{@.user} to share #{@.name} with others."
        fileRead: true
        fileWrite: false
        fileChange: false
        fileRemove: false
        shareWithOthers: true
        shareWithPublic: false

    methods:
        addShare: ->
#            @.addHistory "Created on #{moment(@.created).format "lll"}"

            share.users.push(
                created: Date.now()
                name: @.user
                perm:
                    file:
                        read   : @.fileRead
                        write  : @.fileWrite
                        change : @.fileChange
                        remove : @.fileRemove
                    share:
                        others : @.shareWithOthers
                        public : @.shareWithPublic
            )

            share.newUser = null

    watch:
        fileChange: ->
            @.fileRead = true if @.fileChange

        fileRemove: ->
            @.fileRead = true if @.fileRemove

addPublicLinkModal =
    template: '#add-public-link-modal'
    props : ['title']
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
            share.newLinkTitle = null

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
                title: @.title
                data:
                    password: @.password
                    expires: @.expires
                    rw: @.rw
                history: @.history
            )

            @.reset()

editPublicLinkModal =
    template : '#edit-public-link-modal'
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

publicLink =
    template : "#public-link"
    props : ['link']
    computed:
        linkUrl: ->
            "http://domain.com/#{@.link.hash}"

        order: ->
            "order:#{-@.link.created.toString().substr(7,3)}"

        name: ->
            return if @.link.title then @.link.title else @.link.hash

    methods:
        trash: (e) ->
            index = @._indexOf()
            share.shares.splice index, 1

        edit: (e, i) ->
            UIkit.toggle(i, {target: '#add-modal'});

        _indexOf: ->
            _.indexOf share.shares, @.link

userShare =
    template : '#user-share'
    props    : ['user']
    data: ->
        avatars: [
            'http://www.placecage.com/40/40'
            'http://www.stevensegallery.com/40/40'
            'http://www.fillmurray.com/40/40'
        ]
    computed :
        order: ->
            "order:#{-@.user.created.toString().substr(7,3)}"

        permissions: ->
            indices = []
            _.forEach(@.user.perm.file, (val, i) ->  indices.push i if val )
            _.forEach(@.user.perm.share, (val, i) ->  indices.push i if val )
            _.join(indices, ', ')

    methods:
        avatar: ->
            num = Math.floor Math.random() * @.avatars.length
            @.avatars[num]

### Vue instance ###

share = new Vue(
    el: '#share'
    components:
        'addPublicLink'  : addPublicLinkModal
        'editPublicLink' : editPublicLinkModal
        'addUserShare'   : addUserShareModal
        'userShare'      : userShare
        'publiclink'     : publicLink

    data:
        file:
            name: 'My Little Pony'
            size: 213
            cdate: moment().format "ll"
        newUser: null
        newLinkTitle: null
        users: []
        shares: []
        modal: null

    methods:
        startUserShare: ->
            if @.newUser
                UIkit.modal('#add-user-share').toggle()
                true
)