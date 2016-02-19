(function(Hiof, undefined) {

  let scrollDest = false;
  Hiof.articleDisplayView = function(data = {}, options = {}) {

    if (options.destinationView === 'modal') {
      createArticleModalView(data, options);
    }else{

      let templateSource;

      if (options.template === 'single') {
        templateSource = Hiof.Templates['articles/post-single'];
      } else {
        templateSource = Hiof.Templates['articles/posts'];
      }

      let markup = templateSource(data);

      if (!!options.destination) {
        if (options.addType === 'append') {
          $(options.destination).append(markup);
        } else {
          $(options.destination).html(markup);
        }
        Hiof.articleScrollTo(options.destination);
        if ($('.study-catalogue-articles').length) {
          Hiof.EqualHeight($('.article'));
        }

      } else {
        $('#content').html(markup);
        let scrollDestEl = "#content";
        Hiof.articleScrollTo(scrollDestEl);
      }
      if (options.template === 'single') {
        let thisArticleImage = "http://hiof.no/neted/services/file/?hash=" + data.posts[0].articleImage;
        let meta = {
          "og:url": window.location.href,
          "og:title": data.posts[0].articleTitle,
          "og:description": data.posts[0].articleIntro,
          "og:type": "article",
          "og:image": thisArticleImage,
          "article:author": data.posts[0].authorName,
          "article:publisher": Hiof.options.meta.fbpublisher
        };
        Hiof.syncMetaInformation(meta);
      } else {
        Hiof.syncMetaInformation();
      }
    }
  };
  createArticleModalView = function(data, options){
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

  };

  Hiof.articleScrollTo = function(destination) {
    if (scrollDest) {
      $.scrollTo($(destination), 500, {
        axis: 'y',
        offset: {
          top: -80
        }
      });
    }
  };

  Hiof.articleSetupOptions = function(el) {
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
  };
  Hiof.articleLoadData = function(options, element) {
    // If options are not defined
    if (typeof options === 'undefined' || options === null) {
      // Get options from the initializer element
      //console.log("options is undefined");
      options = Hiof.articleSetupOptions(element);
    }
    //console.log(options);



    // Setup the query
    let settings = $.extend({
      // These are the defaults.
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
    }, options);


    let contentType = "application/x-www-form-urlencoded; charset=utf-8";

    if (window.XDomainRequest) { //for IE8,IE9
      contentType = "text/plain";
    }
    $.ajax({
      url: 'http://hiof.no/api/v1/articles/',
      method: 'GET',
      async: true,
      dataType: 'json',
      data: settings,
      contentType: contentType,
      success: function(data) {

        Hiof.articleDisplayView(data, settings);


        //console.log("Data:");
        //console.log(data);
        //alert("Data from Server: "+JSON.stringify(data));

      },
      error: function(jqXHR, textStatus, errorThrown) {
        //alert("You can not send Cross Domain AJAX requests: " + errorThrown);
      }

    });
  };

  Handlebars.registerHelper('urlize', function(value) {
    return encodeURIComponent(value.replace(/\s+/g, '-').toLowerCase());
    //return value;
  });
  //Hiof.updateAnalytics = function() {
  //  //ga('set', 'page', document.location.href);
  //  //ga('send', 'pageview');
  //};


  // Standard path

  Path.map("#/artikkel").to(function() {
    //scrollDest = false;
    $('.article-load').each(function() {
      //debug(this);
      Hiof.articleLoadData(null, this);
    });
  });
  // Path for categorized content
  Path.map("#/artikkel/kategori/:category_id").enter(Hiof.updateAnalytics).to(function() {
    scrollDest = true;
    let thisDestination = '';
    if ($('.article-load').attr('data-destination')) {
      thisDestination = $('.article-load').attr('data-destination');
    }
    let options = {
      category: this.params.category_id,
      destination: thisDestination
    };
    Hiof.articleLoadData(options);
  });

  // Path for specific article content
  Path.map("#/artikkel/:article_title/:article_id").enter(Hiof.updateAnalytics).to(function() {
    let identifier = 'div[data-pageid="' + this.params.article_id + '"]';
    //let thisDestinationView = $(identifier).attr('data-article-destination-view')



    scrollDest = true;
    let thisDestination = '';
    if ($('.article-load').attr('data-destination')) {
      thisDestination = $('.article-load').attr('data-destination');
    }
    let options = {
      pageId: this.params.article_id,
      template: 'single',
      destination: thisDestination
    };
    if ($(identifier).attr('data-article-destination-view') === 'modal') {
      options.destinationView = 'modal';
    }

    //console.log(options);

    Hiof.articleLoadData(options);


  });



  // Path for paged content
  Path.map("#/artikkel/page/:page_id").enter(Hiof.updateAnalytics).to(function() {
    scrollDest = true;
    let thisDestination = '';
    if ($('.article-load').attr('data-destination')) {
      thisDestination = $('.article-load').attr('data-destination');
    }

    let options = {
      page: this.params.page_id,
      destination: thisDestination
    };

    Hiof.articleLoadData(options);
  });


  initatePathArticle = function() {
    // Load root path if no path is active
    Path.root("#/artikkel");
  };



  // on document load
  $(function() {

    if ($('.article-load').length) {
      initatePathArticle();
      Path.listen();

    }

    $('#content').on('click', '.article-more', function(e) {
      e.preventDefault();
      Hiof.articleLoadData();

    });
    //$('#content').on('click', '.study-catalogue-articles a', function(e) {
    //  //e.preventDefault();
    //  //createArticleModalView(body);
    //  //onsole.log('Article should open in a modal');
    //});


    $(document).on('hidden.bs.modal', '#modal-article-display', function (e) {
      //console.log('article dismissed...');
      //Path.root("#/articles");
      window.location.hash = '#/artikkel';
    });




  });

})(window.Hiof = window.Hiof || {});
