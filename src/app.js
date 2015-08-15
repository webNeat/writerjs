/* Useful functions */
$.fn.hasOverflow = function() {
  var $this = $(this);
  var $children = $this.find('*');
  var len = $children.length;

  if (len) {
    var maxWidth = 0;
    var maxHeight = 0
    $children.map(function(){
      maxWidth = Math.max(maxWidth, $(this).outerWidth(true));
      maxHeight = Math.max(maxHeight, $(this).outerHeight(true));
    });
    return maxWidth > $this.width() || maxHeight > $this.height();
  }
  return false;
};

/* Document handeling */

var app = angular.module('writer', [])
  .run(function($rootScope){
  $rootScope.abbrs = [];
  $rootScope.abbrNames = [];
  $rootScope.contents = [];
  $rootScope.figures = [];
});

// Page
app.directive('page', function($compile, $rootScope){
  return {
    restrict: 'E',
    link: function(scope, element, attrs){
      element.wrapInner('<div class="page-content"></div>');
      var $content = element.find('.page-content');
      $content.before('<div class="page-header"></div>')
        .after('<div class="page-footer center"> Page ' + attrs.pageNumber + '</div>');
      if($content.get(0).offsetHeight < $content.get(0).scrollHeight){
        $content.attr('style', 'background: red');
      //   var $childs = $content.children(),
      //     $page = $('<page></page>'),
      //     i = $childs.length - 1;
      //   while( i > 0 && $content.get(0).offsetHeight < $content.get(0).scrollHeight){
      //     $page.append($childs.get(i));
      //     i --;
      //   }

      //   element.after($page);
      //   if($content.get(0).offsetHeight < $content.get(0).scrollHeight)
      //     $content.attr('style', 'background: red');
      }
    }
  };
});

// Abbreviations
app.directive('abbr', function($rootScope){
  return {
    restrict: 'E',
    link: function(scope, element, attrs){
      var text = element.text().trim().split(':');
      var name = text[0].trim();
      var value = text[1].trim();
      element.html(name);
      if($rootScope.abbrNames.indexOf(name) == -1){
        $rootScope.abbrs.push({
          name: name,
          value: value
        });
        $rootScope.abbrNames.push(name);
        console.log($rootScope.abbrs);
      }
    }
  };
});
app.directive('abbreviationsTable', function($rootScope){
  return {
    restrict: 'E',
    templateUrl: 'parts/abbreviations-table.html',
    link: function(scope, element, attrs){

    }
  };
});

// Contents Table
app.directive('contentsTable', function($rootScope){
  return {
    restrict: 'E',
    templateUrl: 'parts/contents-table.html',
    scope: {},
    link: function(scope, element, attrs){
      var start = 0;
      if(attrs.start !== undefined)
        start = parseInt(attrs.start);
      var end = $rootScope.contents.length - 1;
      if(attrs.end !== undefined)
        end = Math.min(end, parseInt(attrs.end));
      console.log('start: ' + start + ' & end:' + end);
      scope.getContents = function(){
        var list = [];
        for(var i = start; i <= end; i ++)
          list.push($rootScope.contents[i]);
        console.log('Contents from ' + start + ' to ' + end + ' are: ', list);
        return list;
      }
    }
  };
});

// Figures Table
app.directive('figuresTable', function($rootScope){
  return {
    restrict: 'E',
    templateUrl: 'parts/figures-table.html',
    scope: {},
    link: function(scope, element, attrs){
      var start = 0;
      if(attrs.start !== undefined)
        start = parseInt(attrs.start);
      var end = $rootScope.figures.length - 1;
      if(attrs.end !== undefined)
        end = Math.min(end, parseInt(attrs.end));
      scope.getFigures = function(){
        var list = [];
        for(var i = start; i <= end; i ++)
          list.push($rootScope.figures[i]);
        return list;
      }
    }
  };
});

app.run(function($rootScope, $document, $timeout){
  // Numbering pages
  var romanNumbers = ['', 'i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x']
    currentRomanNumber = 0,
    currentPageNumber = 0;

  $('page').each(function(){
    var $section = $(this).parent('section'),
      pageNumber = '';
    if($section.hasClass('without-page-numbers')){
      pageNumber = '';
    } else if($section.hasClass('roman-page-numbers')){
      currentRomanNumber ++;
      pageNumber = romanNumbers[currentRomanNumber];
    } else {
      currentPageNumber ++;
      pageNumber = currentPageNumber;
    }
    $(this).attr('data-page-number', pageNumber);
    $(this).find('.page-footer')
      .html('Page ' + pageNumber)
      .addClass('center');
  });

  var numbers = [0, 0, 0, 0, 0, 0, 0];
  $(':header').each(function(){
    var text = $(this).text(),
      $page = $(this).parent('page');
      level = parseInt($(this).prop("tagName").substring(1)),
      i = 0;
    // Adding number to title
    if(! $(this).hasClass('no-number')){
      var number = '';
      numbers[level - 1] ++;
      for(i = level; i < 6; i++)
        numbers[i] = 0;
      for(i = 0; i < level; i++){
        number += numbers[i] + '.';
      }
      text = number + ' ' + text;
      $(this).html(text);
    }
    // Adding title to contents table
    $rootScope.contents.push({
      title: text,
      page: $page.attr('data-page-number'),
      level: level
    });
  });

  $('img').each(function(){
    $(this).attr('src', '../user/imgs/' + $(this).attr('src'));
  });

  var figureNumber = 1;
  $('.figure-title').each(function(){
    var name = 'Figure ' + figureNumber + ': ' + $(this).text();
    $(this).html(name);
    var fig = {
      name: name,
      page: $(this).parents('page').attr('data-page-number')
    };
    console.log(fig);
    $rootScope.figures.push(fig);
    figureNumber ++;
  });
  
});
