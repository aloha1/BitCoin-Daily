var ShareModal = (function(options) {

  var options = {
    title : "title",
    name : "name",
    url:"",
    modalPlaceholder:null
  };

  var init = function(option){
    options = option;
  }

  /**
  * Set the element that opens the modal
  **/
  var setOpener = function(element){
    //when the opener element is clicked
    $( document ).on( 'click', element, function() {
      options.url = $(this).attr('data-url');
      renderContent(options.modalPlaceholder);
      //show modal
      $('#'+options.name).modal('show');  
    });
  }



  var renderContent = function(element){
    var modal = modalTemplate();
    element.html(modal);

  }



  /*
  * Modal Template
  */
  var modalTemplate = function(){

      return '<div class="modal fade" id="'+options.name+'" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">'+
      '  <div class="modal-dialog">'+
      '    <div class="modal-content">'+
      '      <div class="modal-header">'+
      '        <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">×</span><span class="sr-only">Close</span></button>'+
      '        <h4 class="modal-title" id="myModalLabel">'+options.title+'</h4>'+
      '      </div>'+
      '      <div class="modal-body">'+
      '        <p><a title="Facebook" href="https://www.facebook.com/sharer/sharer.php?u='+options.url+'"><span class="fa-stack fa-lg"><i class="fa fa-square-o fa-stack-2x"></i><i class="fa fa-facebook fa-stack-1x"></i></span></a> '+
      '           <a title="Twitter" href="https://twitter.com/home?status='+options.url+'"><span class="fa-stack fa-lg"><i class="fa fa-square-o fa-stack-2x"></i><i class="fa fa-twitter fa-stack-1x"></i></span></a> '+
      '           <a title="Google+" href="https://plus.google.com/share?url='+options.url+'"><span class="fa-stack fa-lg"><i class="fa fa-square-o fa-stack-2x"></i><i class="fa fa-google-plus fa-stack-1x"></i></span></a> '+
      '           <a title="Reddit" href="'+options.url+'"><span class="fa-stack fa-lg"><i class="fa fa-square-o fa-stack-2x"></i><i class="fa fa-reddit fa-stack-1x"></i></span></a> '+
      '           <a title="Stumbleupon" href="http://www.stumbleupon.com/submit?url='+options.url+'"><span class="fa-stack fa-lg"><i class="fa fa-square-o fa-stack-2x"></i><i class="fa fa-stumbleupon fa-stack-1x"></i></span></a>'+
      '        '+
      '                <p>or Copy and Paste to share.</p>'+
                   '   <div class="input-group input-group-lg">'+
'                        <span class="input-group-addon" id="sizing-addon1"><i class="fa fa-share"></i></span>'+
'                        <input type="text" value="'+options.url+'" readonly class="form-control"  aria-describedby="sizing-addon1">'+
'                      </div>'+
      '      </div>'+
      '      <div class="modal-footer">'+
      '        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>'+
      '      </div>'+
      '    </div>'+
      '  </div>'+
      '</div>';
  }

  return {
    //initialise modal
    init: init,

    //render modal
    renderContent:renderContent,

    //set modal opener element (open button)
    setOpener:setOpener
  };

})();
