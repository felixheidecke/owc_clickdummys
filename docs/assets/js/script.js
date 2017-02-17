(function() {


}).call(this);

(function() {


}).call(this);

(function() {
  var Link, ModalEdit, ModalNew, share;

  ModalNew = {
    template: '#modal-new',
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
        return this.mail.body = null;
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

  ModalEdit = {
    template: '#modal-edit',
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

  Link = {
    template: "#link",
    props: ['link'],
    components: {
      'modalEdit': ModalEdit
    },
    computed: {
      linkUrl: function() {
        return "http://domain.com/" + this.link.hash;
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


  /* Vue instance */

  $(document).ready(function() {});

  share = new Vue({
    el: '#share',
    components: {
      'modalNew': ModalNew,
      'modalEdit': ModalEdit,
      'publink': Link
    },
    data: {
      shares: [],
      modal: null,
      modaldata: null,
      create: {
        rw: false,
        password: 'otto',
        expires: null,
        recipient: null,
        message: null
      }
    }
  });

}).call(this);
