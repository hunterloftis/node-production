function PageVM(data) {
  this.title = data.title;
  this.topicList = data.topics.join(', ');
  this.image = data.image;
  this.minutes = data.minutes;
  this.style = data.difficulty > 0.8 ? 'scholarly' : 'relaxed';
  if (data.sentiment < 0.01) this.sentiment = 'negative';
  else if (data.sentiment < 0.04) this.sentiment = 'neutral';
  else this.sentiment = 'positive';
}

function PageListVM() {
  this.pages = ko.observableArray();
  this.url = ko.observable();
  this.pending = ko.observable();
  this.pollInterval = null;

  this.addPage = function() {
    console.log("URL:", this.url());
    $.post('/pages.json', { url: this.url() }, onCreate.bind(this));
  }.bind(this);

  this.isPending = ko.computed(function() {
    return !!this.pending();
  }, this);

  this.isPending.subscribe(function(pending) {
    clearInterval(this.pollInterval);
    if (pending) this.pollInterval = setInterval(poll.bind(this), 2000);
  }, this);

  function onCreate(created) {
    this.pending(created.link);
  }

  function poll() {
    $.getJSON(this.pending(), function(data) {
      this.pending(null);
      if (data) this.fetch();
    }.bind(this));
  }
}

PageListVM.prototype.fetch = function() {
  $.getJSON('/pages.json', function(pages) {
    this.pages(pages.map(function(page) {
      return new PageVM(page);
    }));
  }.bind(this));
};

var vm = new PageListVM();
ko.applyBindings(vm);
vm.fetch();