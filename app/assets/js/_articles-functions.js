
class ArticlesView {
  constructor() {
    this.view = new View();
    this.postsTemplate = Hiof.Templates['articles/posts'];
    this.postSingleTemplate = Hiof.Templates['articles/post-single'];
    this.scrollDest = false;
    this.defaults = {
      // These are the defaults.
      url: '//hiof.no/api/v1/articles/',
      pageId: null,
      page: 1,
      pageSize: 20,
      template: 'posts',
      authorId: '',
      category: '',
      destination: '',
      articleLoClass: "lo-half",
      addType: '',
      destinationAddress: null
    };


  }
  //getData(options = {}){
  //  // Setup the query
  //  let settings = Object.assign(
  //    {},
  //    this.defaults,
  //    options
  //  );
  //  let contentType = "application/x-www-form-urlencoded; charset=utf-8";
  //  if (window.XDomainRequest) { //for IE8,IE9
  //    contentType = "text/plain";
  //  }
  //  return $.ajax({
  //    url: settings.url,
  //    method: 'GET',
  //    async: true,
  //    dataType: 'json',
  //    data: settings,
  //    contentType: contentType,
  //    context: this,
  //    success: function(data) {
  //      return data;
  //    },
  //    error: function(jqXHR, textStatus, errorThrown) {
  //    }
  //  });
  //}

  renderArticle(options = {}){

    //Connect this context to the View class as that
    let that = this;
    // getData() Ajax for content, function takes the object options with all the settings.
    // See the class constructor for mor information regarding the options.
    this.view.getData(options, that).success(function(data){
      if (options.destinationView === 'modal') {
        this.renderArticleModal(data, options);
      }else{
        //let templateSource;
        if (options.template === 'single') {
          $('#content > header').remove();
          templateSource = that.postSingleTemplate;
        } else {
          templateSource = that.postsTemplate;
        }
        let markup = templateSource(data);
        if (!!options.destination) {
          if (options.addType === 'append') {
            $(options.destination).append(markup);
          } else {
            $(options.destination).html(markup);
          }
          //that.view.scrollTo(options.destination);
          //Hiof.articleScrollTo(options.destination);
          if ($('.study-catalogue-articles').length) {
            Hiof.EqualHeight($('.article'));
          }
        } else {
          $('#content').html(markup);
          let scrollDestEl = "#content";
          that.view.scrollTo(scrollDestEl);
        }
        if (options.template === 'single') {
          let thisArticleImage = "//hiof.no/neted/services/file/?hash=" + data.posts[0].articleImage;
          let meta = {
            "og:url": window.location.href,
            "og:title": data.posts[0].articleTitle,
            "og:description": data.posts[0].articleIntro,
            "og:type": "article",
            "og:image": thisArticleImage,
            "article:author": data.posts[0].authorName,
            "article:publisher": "https://facebook.com/hiofnorge"
          };
          that.view.syncHeadMeta(meta);
        } else {
          //this.syncHeadMeta();
        }
      }
    });
  }
  renderArticleModal(data = {}, options = {}){
    data.articleTitle = data.posts[0].articleTitle;
    data.posts[0].articleTitle = undefined;
    data.posts[0].category = undefined;
    data.posts[0].relatedArticles = undefined;
    data.posts[0].relatedArticlesCategoryId = undefined;
    //let defaults = {
    //
    //};
    //
    //let settings = Object.assign(
    //  {},
    //  defaults,
    //  options
    //);
    let settings = $.extend({
      // These are the defaults.
    }, options);

    let templateSource = Hiof.Templates['articles/post-single'];
    //console.log(data);
    let markup = templateSource(data);


    let thisData = {
      modalId: 'article-display',
      title: data.articleTitle,
      body: markup,
      footer: '<button type="button" class="btn btn-default" data-dismiss="modal">Steng vindu</button>'
    }
    let modalSource = Hiof.Templates['modal/generic'],
    modalMarkup = modalSource(thisData);
    if ($('#modal-article-display').length) {
      $('#modal-article-display').remove();
    }
    $('body').append(modalMarkup);
    $('#modal-article-display').modal('show');

  }

  setupOptions(el){

    let thisLoader;
    if (typeof el === 'undefined') {
      thisLoader = $('.article-load');
    } else {
      thisLoader = $(el);
    }


    let thisPageId = null,
    thisPage = 1,
    thisPageSize = 20,
    thisTemplate = 'posts',
    thisAuthorId = '',
    thisCategory = '',
    thisDestination = '',
    thisArticleLoClass = 'lo-half',
    thisAddType = '',
    thisDestinationAddress = null;
    thisDestinationView = 'standard';
    if (thisLoader.attr('data-pageId')) {
      thisPageId = thisLoader.attr('data-pageId');
    }
    if (thisLoader.attr('data-page')) {
      thisPage = thisLoader.attr('data-page');
    }
    if (thisLoader.attr('data-pageSize')) {
      thisPageSize = thisLoader.attr('data-pageSize');
    }
    if (thisLoader.attr('data-template')) {
      thisTemplate = thisLoader.attr('data-template');
    }
    if (thisLoader.attr('data-authorId')) {
      thisAuthorId = thisLoader.attr('data-authorId');
    }
    if (thisLoader.attr('data-category')) {
      thisCategory = thisLoader.attr('data-category');
    }
    if (thisLoader.attr('data-destination')) {
      thisDestination = thisLoader.attr('data-destination');
    }
    if (thisLoader.attr('data-article-lo-class')) {
      thisArticleLoClass = thisLoader.attr('data-article-lo-class');
    }
    if (thisLoader.attr('data-article-add-type')) {
      thisAddType = thisLoader.attr('data-article-add-type');
    }
    if (thisLoader.attr('data-article-destination-address')) {
      thisDestinationAddress = thisLoader.attr('data-article-destination-address');
    }
    //console.log(thisDestination);

    options = {
      pageId: thisPageId,
      page: thisPage,
      pageSize: thisPageSize,
      template: thisTemplate,
      authorId: thisAuthorId,
      category: thisCategory,
      destination: thisDestination,
      articleLoClass: thisArticleLoClass,
      addType: thisAddType,
      destinationAddress: thisDestinationAddress,
      destinationView: thisDestinationView,
      url: this.defaults.url
    };
    //console.log(options);
    return options;
  }


}
