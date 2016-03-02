
class ArticlesView {
  constructor() {
    this.postsTemplate = Hiof.Templates['articles/posts'];
    this.postSingleTemplate = Hiof.Templates['articles/post-single'];
    this.scrollDest = false;
    //this.elOptions = this.setupOptions();
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
  getData(options = {}){
    //console.log("getData executed");
    // If options are not defined

    //console.log(options);
    // Setup the query
    //console.log('Options from getData...');
    //console.log(options);
    let settings = Object.assign(
      {},
      this.defaults,
      options
    );
    //console.log('Settings from GetData');
    //console.log(settings);

    let contentType = "application/x-www-form-urlencoded; charset=utf-8";
    if (window.XDomainRequest) { //for IE8,IE9
      contentType = "text/plain";
    }
    //console.log('Settings from getData:');
    //console.log(settings);
    return $.ajax({
      url: settings.url,
      method: 'GET',
      async: true,
      dataType: 'json',
      data: settings,
      contentType: contentType,
      context: this,
      success: function(data) {
        //console.log('Data from getData success....');
        //console.log(data);
        //data.settings = settings;
        return data;
      },
      error: function(jqXHR, textStatus, errorThrown) {
        //console.log("You can not send Cross Domain AJAX requests: " + errorThrown);
      }

    });
  }
  // getData() comes from View
  renderArticle(options = {}){
    //console.log("running renderArticle");
    //options.server = 'www';
    //options.url = 'http://staging.hiof.no/api/v1/articles';
    //console.log(this.getData());
    this.getData(options).success(function(data){
      //console.log(data);
      //console.log('renderArticle options....');
      //console.log(options);
      //console.log('renderArticle data....');
      //console.log(data);
      if (options.destinationView === 'modal') {
        this.renderArticleModal(data, options);
      }else{
        let templateSource;
        if (options.template === 'single') {
          //console.log('Single post template used....');
          $('#content > header').remove();
          templateSource = this.postSingleTemplate;
        } else {
          templateSource = this.postsTemplate;
        }
        let markup = templateSource(data);
        if (!!options.destination) {
          if (options.addType === 'append') {
            $(options.destination).append(markup);
          } else {
            $(options.destination).html(markup);
          }
          //Hiof.articleScrollTo(options.destination);
          if ($('.study-catalogue-articles').length) {
            Hiof.EqualHeight($('.article'));
          }
        } else {
          $('#content').html(markup);
          let scrollDestEl = "#content";
          //super.scrollTo(scrollDestEl);
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
            "article:publisher": Hiof.options.meta.fbpublisher
          };
          this.syncHeadMeta(meta);
        } else {
          this.syncHeadMeta();
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

  setupOptions(el = {}){
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
      destinationView: thisDestinationView
    };
    return options;
  }

  syncHeadMeta(meta = {}){
    // Setup the settings
    var settings = $.extend({
      // These are the defaults.
      "site_name": Hiof.options.meta.site_name,
      "og:url": Hiof.options.meta["og:url"],
      "og:title": Hiof.options.meta["og:title"],
      "og:description": Hiof.options.meta["og:description"],
      "og:type": Hiof.options.meta["og:type"],
      "og:image": Hiof.options.meta["og:image"],
      "fb:app_id": Hiof.options.meta.fbid,
      "article:author": Hiof.options.meta.author
    }, options);

    // Updated / create meta-tags
    $.each(settings, function(key, value) {
      if (key === "og:title") {
        // If the string contains pipe, remove it and everything after the pipe
        if (value.indexOf('|')) {
          value = value.substring(0, value.indexOf('|'));
        }

        if ($('meta[property="' + key + '"]').length) {
          $('head title').text(value + ' | ' + settings.site_name);
          $('meta[property="' + key + '"]').attr('content', value);

        } else {
          createAndApplyMetaElement(key, value);
        }
      } else if (key === "article:author") {
        if ($('meta[property="' + key + '"]').length) {
          $('meta[property="' + key + '"]').attr('content', value);
          $('meta[name="Author"]').attr('content', value);
        } else {
          createAndApplyMetaElement(key, value);
        }

      } else if (key === "og:description") {
        if ($('meta[property="' + key + '"]').length) {
          $('meta[property="' + key + '"]').attr('content', value);
          $('meta[name="Description"]').attr('content', value);
        } else {
          createAndApplyMetaElement(key, value);
        }
      } else if ($('meta[property="' + key + '"]').length) {
        $('meta[property="' + key + '"]').attr('content', value);
      } else {
        createAndApplyMetaElement(key, value);
      }
    });
  }

}
