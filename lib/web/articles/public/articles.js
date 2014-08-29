function ArticleVM(data) {
  this.url = data.url;
  this.title = data.title;
  this.topicList = data.topics.join(', ');
  this.image = data.image;
  this.minutes = data.minutes;
  this.style = data.difficulty > 0.8 ? 'scholarly' : 'relaxed';
  if (data.sentiment < 0.02) this.sentiment = 'negative';
  else if (data.sentiment < 0.04) this.sentiment = 'neutral';
  else this.sentiment = 'positive';
}

function ArticleListVM() {
  this.articles = ko.observableArray();
  this.url = ko.observable();
  this.pending = ko.observable();
  this.error = ko.observable(null);
  this.pollInterval = null;
  this.polls = 0;

  this.addArticle = function() {
    $.post('/articles.json', { url: this.url() }, onCreate.bind(this));
  }.bind(this);

  this.isPending = ko.computed(function() {
    return !!this.pending();
  }, this);

  this.isPending.subscribe(function(pending) {
    clearInterval(this.pollInterval);
    if (pending) {
      this.polls = 0;
      this.pollInterval = setInterval(poll.bind(this), 2000);
    }
  }, this);

  function onCreate(created) {
    this.pending(created.link);
  }

  function poll() {
    if (this.polls++ > 2) {
      this.pending(null);
      this.error('Unable to fetch that url');
      return;
    }

    $.ajax({
      dataType: 'json',
      url: this.pending(),
      success: onSuccess.bind(this),
      error: onError.bind(this)
    });

    function onSuccess(data) {
      if (!data) return;
      this.pending(null)
      this.error(null);
      this.fetch();
      this.url('');
    }

    function onError(xhr, status, err) {
      this.pending(null)
      this.error('Unable to fetch that url');
    }
  }
}

ArticleListVM.prototype.fetch = function() {
  $.getJSON('/articles.json', function(articles) {
    this.articles(articles.map(function(article) {
      return new ArticleVM(article);
    }));
  }.bind(this));
};

var vm = new ArticleListVM();
ko.applyBindings(vm);
vm.fetch();