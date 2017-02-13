(function() {


}).call(this);

(function() {


}).call(this);

(function() {
  var share;

  share = new Vue({
    el: '#share',
    data: {
      shares: []
    },
    methods: {
      addLink: function() {
        var self;
        self = this;
        _.forEach(this.shares, function(value, key) {
          self.shares[key].expanded = false;
          return true;
        });
        this.shares.push({
          hash: Math.random().toString(32).substring(2, 15),
          data: {
            password: null,
            expires: null,
            rw: false
          },
          created: Date.now(),
          expanded: true,
          history: []
        });
        return true;
      }
    }
  });

  Vue.component("publink", {
    template: "#publink",
    props: ['link'],
    data: function() {
      return {
        modified: false,
        mailedTo: null
      };
    },
    computed: {
      linkUrl: function() {
        return "http://domain.com/" + this.link.hash;
      }
    },
    methods: {
      notify: function(e) {
        this.modified = true;
        return UIkit.notification(e + "!", 'warning');
      },
      close: function(e) {
        this.collapse();
        return e.preventDefault();
      },
      trash: function(e) {
        var index;
        index = this._indexOf();
        return share.shares.splice(index, 1);
      },
      expand: function() {
        return this.link.expanded = true;
      },
      collapse: function() {
        return this.link.expanded = false;
      },
      addHistory: function(event) {
        return this.link.history.push(event);
      },
      undo: function(e) {
        UIkit.notification("Changes undone!", 'danger');
        this.modified = false;
        this.link.data.password = null;
        this.link.data.expires = null;
        this.link.data.rw = false;
        return e.preventDefault();
      },
      _indexOf: function() {
        return _.indexOf(share.shares, this.link);
      }
    },
    mounted: function() {
      return this.addHistory("Created on " + moment(this.created).format("lll"));
    }
  });

}).call(this);
