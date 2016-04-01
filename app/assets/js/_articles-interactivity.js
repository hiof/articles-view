(function(Hiof, undefined) {
  $(function(){
    let article = new ArticlesView();
    //console.log('stuff is running from the article module...');

    Handlebars.registerHelper('urlize', function(value) {
      return encodeURIComponent(value.replace(/\s+/g, '-').toLowerCase());
      //return value;
    });
    //Hiof.updateAnalytics = function() {
    //  //ga('set', 'page', document.location.href);
    //  //ga('send', 'pageview');
    //};



    // Path for categorized content
    Path.map("#/:categorytitle/kategori/:categoryid").enter(Hiof.updateAnalytics).to(function() {
      scrollDest = true;
      let thisDestination = '';
      if ($('.article-load').attr('data-destination')) {
        thisDestination = $('.article-load').attr('data-destination');
      }
      let options = {
        category: this.params.categoryid,
        destination: thisDestination
      };
      //Hiof.articleLoadData(options);
      article.renderArticle(options);
    });
    //
    // Path for specific article content
    Path.map("#/:articletitle/a/:articleid").to(function() {
      //console.log('("#/:articletitle/a/:articleid entered...');
      let identifier = 'div[data-pageid="' + this.params.articleid + '"]';
      //let thisDestinationView = $(identifier).attr('data-article-destination-view')
      Hiof.articleParams = this.params;
      //console.log(this.params);

      scrollDest = true;
      let thisDestination = '';
      if ($('.article-load').attr('data-destination')) {
        thisDestination = $('.article-load').attr('data-destination');
      }
      let options = {
        pageId: this.params.articleid,
        template: 'single',
        destination: thisDestination,
        url: article.defaults.url
      };
      //console.log('Article...');
      //console.log(article);
      if ($(identifier).attr('data-article-destination-view') === 'modal') {
        options.destinationView = 'modal';
      }
      //                   $('html').addClass('article-single-view');



      //                   $('#sidebar').addClass('navbar navbar-default');
      //                   $('#nav-page').addClass('navbar-collapse');
      //                   $('#nav-page > ul').removeClass('nav-pills nav-stacked').addClass('nav navbar-nav');
      //                   $('#nav-page ul ul').addClass('dropdown-menu').parent('li').addClass('dropdown');
      //                   //$('#nav-page li.dropdown a').addClass('dropdown-toggle').append('<span class="caret"></span>');
      //                   $('#nav-page li.dropdown > a').addClass('btn btn-default').wrap('<div class="btn-group navbar-btn"></div>');
      //                   //$('#nav-page li.dropdown > a');
      //                   $('#nav-page .btn-group').append('<a href="#" data-toggle="dropdown" class="btn btn-default dropdown-toggle"><span class="caret"></span></a>');
      //                   $('#nav-page .dropdown-menu').detach().appendTo('#nav-page .btn-group');
      //console.log('Options from /artikkel/tittel/id');
      //console.log(options);

      //Hiof.articleLoadData(options);
      article.renderArticle(options);

    });
    //
    //
    //
    //// Path for paged content
    //Path.map("#/artikkel/page/:page_id").enter(Hiof.updateAnalytics).to(function() {
    //  scrollDest = true;
    //  let thisDestination = '';
    //  if ($('.article-load').attr('data-destination')) {
    //    thisDestination = $('.article-load').attr('data-destination');
    //  }
    //
    //  let options = {
    //    page: this.params.page_id,
    //    destination: thisDestination
    //  };
    //
    //  Hiof.articleLoadData(options);
    //});
    // Standard path

    Path.map("#/aktuelt").to(function() {
      //scrollDest = false;
      $('.article-load').each(function() {
        article.renderArticle(article.setupOptions($(this)));
      });
    });
    Path.map("#/").to(function() {
      //scrollDest = false;
      $('.article-load').each(function() {
        //debug(this);
        //console.log('renderArticle executed from /');
        article.renderArticle();
        //Hiof.articleLoadData(null, this);
      });
    });


    // Old URLs
    Path.map("#/articles/:postid").to(function() {
      //console.log("Running #/articles");
      //location.hash = '#/aktuelt';
      //let paramId = this.params.postid;


      let options = article.setupOptions();
      options.pageId = this.params.postid;
      let that = this;


      this.view.getData(options, that).success(function(data){
          console.log(data.posts[0].articleTitle);

                let destAddress = '#/' + encodeURIComponent(data.posts[0].articleTitle.replace(/\s+/g, '-').toLowerCase()) + '/a/' + paramId;
                if(history.pushState) {
                  history.pushState(null, null, destAddress);
                }
                else {
                  location.hash = destAddress;
                }


      });

    });


    // Catch all, redirect to index
    Path.map("#/:all").to(function() {
      if(history.pushState) {
        history.pushState(null, null, '#/aktuelt');
      }
      else {
        location.hash = '#/aktuelt';
      }
    });

    initatePathArticle = function() {
      // Load root path if no path is active
      Path.root("#/aktuelt");
    };





    if ($('.article-load').length) {
      initatePathArticle();
      Path.listen();

    }

    //$('#content').on('click', '.article-more', function(e) {
    //  e.preventDefault();
    //  Hiof.articleLoadData();

    //});
    ////$('#content').on('click', '.study-catalogue-articles a', function(e) {
    ////  //e.preventDefault();
    ////  //createArticleModalView(body);
    ////  //onsole.log('Article should open in a modal');
    ////});

    //$(document).on('hidden.bs.modal', '#modal-article-display', function (e) {
    //  //console.log('article dismissed...');
    //  //Path.root("#/articles");
    //  window.location.hash = '#/artikkel';
    //});




  });

})(window.Hiof = window.Hiof || {});
