(function() {
  var addPublicLinkModal, addUserShareModal, editPublicLinkModal, publicLink, share, userShare;

  addUserShareModal = {
    template: '#add-user-share-modal',
    props: ['user', 'name'],
    data: function() {
      return {
        tooltipShare: "Allow " + this.user + " to share " + this.name + " with others.",
        permissions: "r+w",
        fileRemove: false,
        shareWithOthers: true,
        shareWithPublic: false,
        sendNotification: true,
        expirationDate: "2017-11-01"
      };
    },
    methods: {
      addShare: function() {
        share.users.push({
          created: Date.now(),
          name: this.user,
          expires: this.expirationDate,
          perm: {
            permissions: this.permissions,
            share: {
              others: this.shareWithOthers,
              "public": this.shareWithPublic
            }
          }
        });
        this.reset();
        if (this.sendNotification) {
          return UIkit.notification(this.user + " was notified.", {
            status: 'success',
            pos: 'top-center'
          });
        }
      },
      reset: function() {
        this.permissions = "r+w";
        this.fileRemove = false;
        this.shareWithOthers = true;
        this.shareWithPublic = false;
        this.sendNotification = true;
        return share.newUser = null;
      }
    },
    watch: {
      fileChange: function() {
        if (this.fileChange) {
          return this.fileRead = true;
        }
      },
      fileRemove: function() {
        if (this.fileRemove) {
          return this.fileRead = true;
        }
      }
    }
  };

  addPublicLinkModal = {
    template: '#add-public-link-modal',
    props: ['title'],
    data: function() {
      return {
        rw: false,
        password: null,
        expires: null,
        history: [],
        mail: {
          recipients: null,
          body: null
        }
      };
    },
    methods: {
      addHistory: function(event) {
        this.history.push(event);
        return true;
      },
      reset: function() {
        this.rw = false;
        this.password = null;
        this.expires = null;
        this.history = [];
        this.mail.recipients = null;
        this.mail.body = null;
        return share.newLinkTitle = null;
      },
      addLink: function() {
        var self;
        this.addHistory("Created on " + (moment(this.created).format("lll")));
        if (this.mail.recipients) {
          self = this;
          _.forEach(this.mail.recipients.split(' '), function(mail) {
            return self.addHistory("Send to " + mail);
          });
        }
        share.shares.push({
          hash: Math.random().toString(32).substring(2, 15),
          created: Date.now(),
          title: this.title,
          data: {
            password: this.password,
            expires: this.expires,
            rw: this.rw
          },
          history: this.history
        });
        return this.reset();
      }
    }
  };

  editPublicLinkModal = {
    template: '#edit-public-link-modal',
    props: ['link'],
    methods: {
      addHistory: function(event) {
        this.history.push(event);
        return true;
      },
      addLink: function() {
        var self;
        this.addHistory("Created on " + (moment(this.created).format("lll")));
        if (this.mail.recipients) {
          self = this;
          _.forEach(this.mail.recipients.split(' '), function(mail) {
            return self.addHistory("Send to " + mail);
          });
        }
        share.shares.push({
          hash: Math.random().toString(32).substring(2, 15),
          created: Date.now(),
          data: {
            password: this.password,
            expires: this.expires,
            rw: this.rw
          },
          history: this.history
        });
        return this.reset();
      }
    }
  };

  publicLink = {
    template: "#public-link",
    props: ['link'],
    computed: {
      linkUrl: function() {
        return "http://domain.com/" + this.link.hash;
      },
      order: function() {
        return "order:" + (-this.link.created.toString().substr(7, 3));
      },
      name: function() {
        if (this.link.title) {
          return this.link.title;
        } else {
          return this.link.hash;
        }
      }
    },
    methods: {
      trash: function(e) {
        var index;
        index = this._indexOf();
        return share.shares.splice(index, 1);
      },
      edit: function(e, i) {
        return UIkit.toggle(i, {
          target: '#add-modal'
        });
      },
      _indexOf: function() {
        return _.indexOf(share.shares, this.link);
      }
    }
  };

  userShare = {
    template: '#user-share',
    props: ['user'],
    data: function() {
      return {
        avatars: ['http://www.placecage.com/40/40', 'http://www.stevensegallery.com/40/40', 'http://www.fillmurray.com/40/40']
      };
    },
    computed: {
      order: function() {
        return "order:" + (-this.user.created.toString().substr(7, 3));
      },
      permissions: function() {
        var indices;
        indices = [this.user.perm.permissions.toUpperCase()];
        indices.push(this.user.expires);
        _.forEach(this.user.perm.share, function(val, i) {
          if (val) {
            return indices.push(i);
          }
        });
        return _.join(indices, ', ');
      }
    },
    methods: {
      avatar: function() {
        var num;
        num = Math.floor(Math.random() * this.avatars.length);
        return this.avatars[num];
      }
    }
  };


  /* Vue instance */

  share = new Vue({
    el: '#share',
    components: {
      'addPublicLink': addPublicLinkModal,
      'editPublicLink': editPublicLinkModal,
      'addUserShare': addUserShareModal,
      'userShare': userShare,
      'publiclink': publicLink
    },
    data: {
      file: {
        name: 'My Folder',
        size: 213,
        cdate: moment().format("ll")
      },
      newUser: null,
      newLinkTitle: null,
      users: [],
      shares: [],
      modal: null
    },
    methods: {
      startUserShare: function() {
        if (this.newUser) {
          UIkit.modal('#add-user-share').toggle();
          return true;
        }
      }
    }
  });

}).call(this);
