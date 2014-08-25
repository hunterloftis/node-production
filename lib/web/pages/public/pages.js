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
  this.url = ko.observable('');

  this.addPage = function() {
    console.log("URL:", this.url());
    $.post('/pages.json', { url: this.url() }, function(data) {
      console.log('result:', data);
    });
  }.bind(this);
}

PageListVM.prototype.bootstrap = function() {
  $.getJSON('/pages.json', function(pages) {
    this.pages(pages.map(function(page) {
      return new PageVM(page);
    }));
  }.bind(this));
};

var vm = new PageListVM();
ko.applyBindings(vm);
vm.bootstrap();
