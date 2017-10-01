/**
* ModalMaker Version 1.2
**/

var ModalMaker = (function (options) {

  var options = {
    title: "title",
    name: "name",
    serverUrl: ""
  };

  var saveButtonText = "Save changes";
  var setSaveButtonText = function (text) {
    saveButtonText = text;
  }

  // var options = $.extend({
  //           title : "title",
  //           name : "name",
  //           serverUrl: ""
  //       }, options);

  //types of fieslds
  var fields = [];
  const TYPE_TEXT = 0, TYPE_TEXTAREA = 1, TYPE_IMAGE = 2, TYPE_NUMBER = 3, TYPE_HIDDEN = 4, TYPE_SELECT = 5, TYPE_HTML_EDITOR = 6, TYPE_MULTIPLE_TEXT = 7, TYPE_NUMERIC = 8, TYPE_LOCATION_MAP = 9, TYPE_GROUP_START = 10, TYPE_GROUP_END = 11, TYPE_LINE_START = 12, TYPE_LINE_END = 13, TYPE_ICON = 14, TYPE_SWITCH = 15, TYPE_DATE = 16;

  // global "map" variable
  var map = null;
  var marker = null;

  var init = function (option) {
    options = option;
  }

  /**
 * Add numeric input to modal
 **/
  var addNumericInput = function (id, label, min = 0, max = 100, step = 1, def = "") {
    fields.push({ "type": TYPE_NUMERIC, "id": id, "label": label, "min": min, "max": max, "step": step, "default": def, "classes": "" });
    return this;
  }

  /**
  * Add text input to modal
  **/
  var addTextInput = function (id, label, placeholder, def = "", inputType = "text") {
    fields.push({ "type": TYPE_TEXT, "id": id, "label": label, "placeholder": placeholder, "default": def, "inputtype": inputType, "classes": "" });
    return this;
  }

  /**
  * Add date input to modal
  **/
  var addDateInput = function (id, label, placeholder, def = "") {
    fields.push({ "type": TYPE_DATE, "id": id, "label": label, "placeholder": placeholder, "default": def, "classes": "" });
    return this;
  }

  /**
  * Add text area input to modal
  **/
  var addTextAreaInput = function (id, label, placeholder, def = "") {
    fields.push({ "type": TYPE_TEXTAREA, "id": id, "label": label, "placeholder": placeholder, "default": def, "classes": "" });
    return this;
  }

  /**
  * Add Image uploader to modal
  **/
  var addImageInput = function (id, label, isMultiple = 0) {
    fields.push({ "type": TYPE_IMAGE, "id": id, "label": label, "isMultiple": isMultiple, "classes": "" });
    return this;
  }

  /**
  * Add Fontawsome icon chooser to modal
  **/
  var addIconInput = function (id, label, def = "fa-cab") {
    fields.push({ "type": TYPE_ICON, "id": id, "label": label, "default": def });
  }

  /**
  * Add hidden element to modal
  **/
  var addHidden = function (id, value) {
    fields.push({ "type": TYPE_HIDDEN, "id": id, "value": value, "classes": "" });
    return this;
  }

  /**
  *@items needs to include items[i].name and items[i].id
  **/
  var addSelect = function (id, label, items, isMultiple = 0, def = "") {
    fields.push({ "type": TYPE_SELECT, "id": id, "label": label, "items": items, "default": def, "isMultiple": isMultiple, "classes": "" });
    return this;
  }

  /**
  * Add summernote html editor to modal
  **/
  var addTextHtmlEditor = function (id, label, placeholder, def = "") {
    fields.push({ "type": TYPE_HTML_EDITOR, "id": id, "label": label, "placeholder": placeholder, "default": def, "classes": "" });
    return this;
  }

  /**
  * Add multiple field text input with +/- to modal
  **/
  var addMultipleText = function (id, label, placeholder, def = "") {
    fields.push({ "type": TYPE_MULTIPLE_TEXT, "id": id, "label": label, "placeholder": placeholder, "default": def, "classes": "" });
    return this;
  }

  /**
  * Add location fiels with map
  **/
  var addLocationMap = function (latid, lngid, label, latplaceholder, lngplaceholder, pinimageurl, latdef = "", lngdef = "") {
    fields.push({ "type": TYPE_LOCATION_MAP, "latid": latid, "lngid": lngid, "label": label, "latplaceholder": latplaceholder, "lngplaceholder": lngplaceholder, "pinimageurl": pinimageurl, "latdef": latdef, "lngdef": lngdef, "classes": "" });
    return this;
  }

  /**
  * Add switch input to modal
  **/
  var addSwitchInput = function (id, label, def = "") {
    fields.push({ "type": TYPE_SWITCH, "id": id, "label": label, "default": def, "classes": "" });
    return this;
  }


  /**
  * Add Group Start
  **/
  var startGroup = function (label) {
    fields.push({ "type": TYPE_GROUP_START, "label": label, "classes": "" });
    return this;
  }

  /**
  * Add Group end
  **/
  var endGroup = function () {
    fields.push({ "type": TYPE_GROUP_END, "classes": "" });
    return this;
  }

  /**
  * Add Line Start
  **/
  var startLine = function () {
    fields.push({ "type": TYPE_LINE_START, "classes": "" });
    return this;
  }

  /**
  * Add Line end
  **/
  var endLine = function () {
    fields.push({ "type": TYPE_LINE_END, "classes": "" });
    return this;
  }


  var addClasses = function (classes) {
    var lastItem = fields.pop();
    lastItem.classes = classes;
    fields.push(lastItem);
  }

  /**
  * Render modal
  **/
  var renderContent = function (element, footerContent = "") {

    var content = "";
    for (let field of fields) {
      if (field["type"] == TYPE_NUMERIC) {
        content += numericTemplate(field);
      } else if (field["type"] == TYPE_TEXT) {
        content += textTemplate(field);
      } else if (field["type"] == TYPE_TEXTAREA) {
        content += textAreaTemplate(field);
      } else if (field["type"] == TYPE_IMAGE) {
        content += imageTemplate(field);
      } else if (field["type"] == TYPE_ICON) {
        content += iconTemplate(field);
      } else if (field["type"] == TYPE_HIDDEN) {
        content += hiddenTemplate(field);
      } else if (field["type"] == TYPE_SELECT) {
        content += selectTemplate(field);
      } else if (field["type"] == TYPE_HTML_EDITOR) {
        content += htmlEditorTemplate(field);
      } else if (field["type"] == TYPE_MULTIPLE_TEXT) {
        content += multipleTextTemplate(field);
      } else if (field["type"] == TYPE_LOCATION_MAP) {
        content += locationMapTemplate(field);
      } else if (field["type"] == TYPE_GROUP_START) {
        content += startGroupTemplate(field);
      } else if (field["type"] == TYPE_GROUP_END) {
        content += endGroupTemplate(field);
      } else if (field["type"] == TYPE_LINE_START) {
        content += startLineTemplate(field);
      } else if (field["type"] == TYPE_LINE_END) {
        content += endLineTemplate(field);
      } else if (field["type"] == TYPE_SWITCH) {
        content += switchTemplate(field);
      } else if (field["type"] == TYPE_DATE) {
        content += dateTemplate(field);
      }
    }
    var modal = modalTemplate(content, footerContent);
    element.html(modal);

    onRender();
    initHandlers();
  }



  /**
  * Set the element that opens the modal
  **/
  var setOpener = function (element) {

    //when the opener element is clicked
    $(document).on('click', element, function () {

      //get id of data
      var id = $(this).attr('data-id');

      onModalOpened(id);

      if (id >= 0) {
        //load current data from server
        $.ajax({
          url: options.serverUrl + "/" + id,
          type: "GET",
          processData: false,
          contentType: false,
          success: function (data, status) {

            //data loaded
            var data = $.parseJSON(data);

            //loop through all data and fill in the fields
            for (var key in data) {
              if (data.hasOwnProperty(key)) {

                //check if modal includes elements that need an array (multipletext)
                var first = $("#" + options.name + "form").find('[name="' + key + '\\[\\]"]').first();
                if (first.length) {
                  setArrayField(first, key, data[key], data);
                } else {

                  //normal fields (not array)
                  $("#" + options.name + "form").find('[name="' + key + '"]').each(function () {
                    var field = $(this);
                    setField(field, key, data[key], data);
                  });
                }
              }
            }

            //show modal
            $('#' + options.name).modal('show');

          },
          error: function (jqXHR) {
            console.log(jqXHR);
          }
        });
      } else {
        $("#" + options.name + "form").trigger("reset");
        $("#" + options.name + "form").find('[name="id"]').val(-1).end();
        $('#' + options.name).modal('show');
      }

    });
  }



  //-------------------------------internal-----------------------------------

  /*
  * Called when the modal is rendered to screen
  */
  var onRender = function () {

    for (let field of fields) {
      if (field["type"] == TYPE_LOCATION_MAP) {
        initializeMap(field);

      }
    }

  }

  /*
  * Called when the modal is opened
  */
  var onModalOpened = function (id) {
    if (id >= 0) {
      //a current item

    } else {
      //a new item
    }


    //new and current items
    //clear modal images
    $(".images-preview").html("");
    $('.image-preview-clear').hide();

    //initialise iconpicker
    $('.iconpicker').iconpicker().iconpicker('setSearch', false);
  }


  /*
  * Called when a field is loaded from server and matched to name in form
  */
  var setArrayField = function (field, id, data, allData) {
    console.log("id: " + id + " data: " + data);

    //check if current data[id] is an array that fills up the multipletext field
    if (field.attr('id') == 'multipletext' + id) {
      var controlForm = field.parent().parent();
      var currentEntry = field.parent();
      //empty
      controlForm.find('.entry:not(:first)').remove();
      controlForm.find('.entry:first .btn')
        .removeClass('btn-remove').addClass('btn-add')
        .removeClass('btn-danger').addClass('btn-success')
        .html('<span class="glyphicon glyphicon-plus"></span>');
      controlForm.find('.entry:first').find('input').val('');
      try {
        var items = jQuery.parseJSON(data);
        for (var i in items) {
          var newEntry = $(currentEntry.clone()).appendTo(controlForm);
          newEntry.find('input').val(items[i]);
        }

        $(currentEntry.clone()).appendTo(controlForm);
        currentEntry.remove();
        controlForm.find('.entry:not(:last) .btn-add')
          .removeClass('btn-add').addClass('btn-remove')
          .removeClass('btn-success').addClass('btn-danger')
          .html('<span class="glyphicon glyphicon-minus"></span>');
      } catch (e) { }
    } else if (field.attr('id') == 'select' + id) {
      var selected = jQuery.parseJSON(data);
      field.val(selected);
    }
  }


  /*
  * Called when a field is loaded from server and matched to name in form
  */
  var setField = function (field, id, data, allData) {
    console.log("id: " + id + " data: " + data);
    //of type summernote
    if (field.attr('id') == 'summernote' + id)
      field.summernote('code', data);

    //of type map
    else if (field.attr('id') == 'map' + id) {
      field.val(data).end();

      //of type checkbox
    } else if (field.attr('id') == 'checkbox' + id) {
      if (data == 0)
        field.prop('checked', false);
      else
        field.prop('checked', data);

      //of type checkbox empty. Place holder of '0' for when checkbox is unchecked
    } else if (field.attr('id') == 'checkbox_empty' + id) {
      field.val('0').end();

      //all other types
    } else if (field.attr('id') == 'images' + id) {
      try {
        var images = jQuery.parseJSON(data);

        $.each(images, function (i, item) {
          $(".image-preview-input-title").text("Change");
          $(".image-preview-clear").show();
          // var numericFields ;
          // numericFields = {"type" : TYPE_NUMERIC, "id" : "singleslideduration[]", "label" : "Slide Duration", "min" : 0, "max" : 1000, "step": 1, "default" : item.duration};
          //$(".images-preview").append("<div class='form-inline'><img class='thumbnail'  width='150' height='100' src='./uploads/"+item.url + "'/><div class='form-group'>"+numericTemplate(numericFields)+"</div></div>");
          $(".images-preview").append("<img class='thumbnail'  width='150' height='100' src='./uploads/" + item + "'/>");

        });
      } catch (err) { }
      field.val(data).end();

    } else
      field.val(data).end();
  }



  //ELEMENT FUNCTIONS------------------------------------------------------------------------------------------------------------------------------------------

  var initHandlers = function () {

    //save button
    $(document).on('click', "#" + options.name + "save", function () {
      var data = new FormData($("#" + options.name + "form")[0]);

      // LOG
      for (var pair of data.entries()) {
        console.log(pair[0] + '-->' + pair[1]);
      }

      //send
      $.ajax({
        url: options.serverUrl,
        type: "POST",
        data: data,
        processData: false,
        contentType: false,
        success: function (data, status) {
          location.reload();
        },
        error: function (jqXHR) {
          console.log(jqXHR);
        }
      });
    });


    //delete button
    $(document).on('click', "#" + options.name + "delete", function () {
      var id = $("#" + options.name + "form").find('[name="id"]').val();
      $.ajax({
        url: options.serverUrl + '/' + id,
        type: "DELETE",
        processData: false,
        contentType: false,
        success: function (data, status) {
          location.reload();
        },
        error: function (jqXHR) {
          console.log(jqXHR);
        }
      });
    });


    //summernote html edditor
    $(".summernote").summernote({
      callbacks: {
        onChange: function (contents, $editable) {
          $(this).parent().find('textarea').val(contents);
        }
      },
      height: "10em",
      dialogsInBody: true
    });


    //date picker
    $('.datetimepicker').datetimepicker({
      format: "YYYY-MM-DD HH:mm:ss"
    });


    //multiple text fields
    $(document).on('click', '.btn-add', function (e) {
      e.preventDefault();

      var controlForm = $('.controls'),
        currentEntry = $(this).parents('.entry:first'),
        newEntry = $(currentEntry.clone()).appendTo(controlForm);

      newEntry.find('input').val('');
      controlForm.find('.entry:not(:last) .btn-add')
        .removeClass('btn-add').addClass('btn-remove')
        .removeClass('btn-success').addClass('btn-danger')
        .html('<span class="glyphicon glyphicon-minus"></span>');
    }).on('click', '.btn-remove', function (e) {
      $(this).parents('.entry:first').remove();

      e.preventDefault();
      return false;
    });


    //image upload
    $(document).on('click', '#close-preview', function () {
      $('.image-preview').popover('hide');
      // Hover before close the preview
      $('.image-preview').hover(
        function () {
          $('.image-preview').popover('show');
        },
        function () {
          $('.image-preview').popover('hide');
        }
      );
    });


    // Create the close button
    var closebtn = $('<button/>', {
      type: "button",
      text: 'x',
      id: 'close-preview',
      style: 'font-size: initial;',
    });
    closebtn.attr("class", "close pull-right");


    // Set the popover default content
    $('.image-preview').popover({
      trigger: 'manual',
      html: true,
      title: "<strong>Preview</strong>" + $(closebtn)[0].outerHTML,
      content: "There's no image",
      placement: 'bottom'
    });


    // Clear event
    $('.image-preview-clear').click(function () {
      $('.image-preview').attr("data-content", "").popover('hide');
      $('.image-preview-filename').val("");
      $('.image-preview-clear').hide();
      $('.image-preview-input input:file').val("");
      $(".image-preview-input-title").text("Browse");
      $(".images-preview").html("");
    });


    // Create the preview image
    $(".image-preview-input input:file").change(function () {
      $(".images-preview").html("");
      var files = event.target.files; //FileList object
      var names = "";
      for (var i = 0; i < files.length; i++) {
        var file = files[i];

        //Only pics
        if (!file.type.match('image'))
          continue;
        names += file.name + ", ";
        var reader = new FileReader();

        // Set preview image into the popover data-content
        reader.onload = function (e) {
          $(".image-preview-input-title").text("Change");
          $(".image-preview-clear").show();
          //img.attr('src', e.target.result);
          $(".images-preview").append("<img class='thumbnail'  width='150' height='100' src='" + e.target.result + "'/>");
          //$(".image-preview").attr("data-content",$(img)[0].outerHTML).popover("show");
        }
        reader.readAsDataURL(file);
      }
      console.log(names);
      $(".image-preview-filename").val(names);


    });


  }

  //initialise google maps
  var initializeMap = function (field) {

    $("#" + options.name).on("shown.bs.modal", function () {
      google.maps.event.trigger(map, "resize");


      //call function to create marker
      if (marker) {
        var iconUrl = marker.getIcon();
        marker.setMap(null);
        marker = null;
      }

      formlat = document.getElementById("map" + field.latid).value;
      formlng = document.getElementById("map" + field.lngid).value;
      var myLatlng = new google.maps.LatLng(formlat, formlng);
      map.setCenter(myLatlng);
      marker = new google.maps.Marker({
        position: new google.maps.LatLng(formlat, formlng),
        map: map,
        icon: iconUrl,
        title: field.label
      });
    });

    // the location of the initial pin
    var myLatlng = new google.maps.LatLng(33.926315, -118.312805);

    // create the map
    var myOptions = {
      zoom: 19,
      center: myLatlng,
      mapTypeControl: true,
      mapTypeControlOptions: { style: google.maps.MapTypeControlStyle.DROPDOWN_MENU },
      navigationControl: true,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }

    map = new google.maps.Map(document.getElementById("map_canvas" + field.latid), myOptions);

    // establish the initial marker/pin
    marker = new google.maps.Marker({
      position: myLatlng,
      map: map,
      icon: field.pinimageurl,
      title: field.label
    });

    // establish the initial div form fields
    formlat = document.getElementById("map" + field.latid).value = myLatlng.lat();
    formlng = document.getElementById("map" + field.lngid).value = myLatlng.lng();

    // close popup window
    //google.maps.event.addListener(map, 'click', function() {
    //infowindow.close();
    // });

    // removing old markers/pins
    google.maps.event.addListener(map, 'click', function (event) {
      google.maps.event.trigger(map, 'resize');
      //call function to create marker
      if (marker) {
        var iconUrl = marker.getIcon();
        marker.setMap(null);
        marker = null;
      }


      // Information for popup window if you so chose to have one
      /*
       marker = createMarker(event.latLng, "name", "<b>Location</b><br>"+event.latLng);
      */
      var myLatLng = event.latLng;
      /*  
      var marker = new google.maps.Marker({
          by removing the 'var' subsquent pin placement removes the old pin icon
      */
      marker = new google.maps.Marker({
        position: myLatLng,
        map: map,
        icon: iconUrl,
        title: field.label
      });

      // populate the form fields with lat & lng 
      formlat = document.getElementById("map" + field.latid).value = event.latLng.lat();
      formlng = document.getElementById("map" + field.lngid).value = event.latLng.lng();

    });
  }





  //TEMPLATES------------------------------------------------------------------------------------------------------------------------------------------



  /*
  * Modal Template
  */

  var modalTemplate = function (content, footerContent) {

    return '<div class="modal fade" id="' + options.name + '" tabindex="-1" role="dialog">' +
      ' <form  enctype="multipart/form-data" role="form" id="' + options.name + 'form">' +
      '  <div class="modal-dialog" role="document">' +
      '    <div class="modal-content">' +
      '      <div class="modal-header">' +
      '        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
      '        <h4 class="modal-title" id="myModalLabel">' + options.title + '</h4>' +
      '      </div>' +
      '      <div class="modal-body">' +
      '          <input type="hidden" name="id" value="-1">' +
      content +
      '      </div>' +
      '      <div class="modal-footer">' +
      footerContent +
      '        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>' +
      '         <button type="button" id="' + options.name + 'delete" class="btn btn-danger">Delete</button>' +
      '        <button type="button" id="' + options.name + 'save" class="btn btn-primary">' + saveButtonText + '</button>' +
      '      </div>' +
      '    </div>' +
      '  </div>' +
      ' </form>' +
      '</div>';
  }






  /*
  * Templates for all field types
  */

  var dateTemplate = function (field) {

    return '<div class="form-group ' + field.classes + '">' +
      '<label for="' + field.id + '">' + field.label + '</label>' +
      '<div  data-date-format="YYYY-MM-DD HH:mm:ss" class="input-group date datetimepicker">' +
      '<input  type="text"  class="form-control" aria-describedby="basic-addon-' + field.id + '" name="' + field.id + '" id="' + field.id + '" placeholder="' + field.placeholder + '" value="' + field.default + '"></input>' +
      '<span class="input-group-addon " id="basic-addon-' + field.id + '">' +
      '<span class="glyphicon glyphicon-th"></span></span>' +
      '</span>' +
      '</div>' +
      '</div>';
  }

  var switchTemplate = function (field) {

    return '<div class="form-group ' + field.classes + '">' +
      '<label for="' + field.id + '">' + field.label + '</label>' +
      '<input type="hidden" name="' + field.id + '" id="checkbox_empty' + field.id + '" value="0" />' +
      '<div><label class="label-switch switch-success">' +
      '<input type="checkbox" class="switch switch-bootstrap status" name="' + field.id + '" id="checkbox' + field.id + '"  value="1"  ' + ((field.default) ? "checked" : "") + '>' +
      '<span class="lable"></span>' +
      '</label></div>' +
      '</div>';
  }

  var numericTemplate = function (field) {

    return '<div class="form-group ' + field.classes + '">' +
      '<label for="' + field.id + '">' + field.label + '</label>' +
      '<input type="number" name="' + field.id + '" class="form-control" id="' + field.id + '" min="' + field.min + '" max="' + field.max + '" step="' + field.step + '" value="' + field.default + '">' +
      '</div>';
  }

  var textTemplate = function (field) {

    return '<div class="form-group ' + field.classes + '">' +
      '<label for="' + field.id + '">' + field.label + '</label>' +
      '<input type="' + field.inputtype + '" name="' + field.id + '" class="form-control" id="' + field.id + '" placeholder="' + field.placeholder + '" value="' + field.default + '"></input>' +
      '</div>';
  }

  var textAreaTemplate = function (field) {

    return '<div class="form-group">' +
      '    <label for="' + field.id + '">' + field.label + '</label>' +
      '    <textarea rows="5" name="' + field.id + '" class="form-control" id="' + field.id + '" placeholder="' + field.placeholder + '">' + field.default + '</textarea>' +
      ' </div>';
  }

  var imageTemplate = function (field) {

    return '<div class="form-group ' + field.classes + '">' +
      '    <label for="' + field.id + '">' + field.label + '</label>' +
      '    <div class="input-group images-preview"></div>' +
      '    <div class="input-group image-preview">' +
      '        <input type="text" id="images' + field.id + '"  name="' + field.id + '" class="form-control image-preview-filename" disabled="disabled">' +
      '        <span class="input-group-btn">' +
      '            <!-- image-preview-clear button -->' +
      '            <button type="button" class="btn btn-default image-preview-clear" style="display:none;"><span class="glyphicon glyphicon-remove"></span> Clear</button>' +
      '            <!-- image-preview-input -->' +
      '            <div class="btn btn-default image-preview-input">' +
      '                <span class="glyphicon glyphicon-folder-open"></span>' +
      '                <span class="image-preview-input-title">Browse</span>' +
      '                <input type="file" accept="image/png, image/jpeg, image/gif" name="' + field.id + 'file[]" ' + (field.isMultiple ? 'multiple' : '') + '/>' +
      '            </div>' +
      '        </span>' +
      '    </div>' +
      '</div>';

  }

  var iconTemplate = function (field) {
    return '<div class="form-group">' +
      '<label for="iconpicker' + field.id + '">' + field.label + '</label>' +
      '<button  id="iconpicker' + field.id + '" class="form-control btn iconpicker btn-default" name="' + field.id + '" data-iconset="fontawesome" data-icon="' + field.default + '"></button>' +
      '</div>';
  }

  var hiddenTemplate = function (field) {

    return '<input class=' + field.classes + '"" type="hidden" name="' + field.id + '" value="' + field.value + '">';
  }

  var selectTemplate = function (field) {
    var content = "";

    content += '<div class="form-group ' + field.classes + '">' +
      '  <label for="' + field.id + '">' + field.label + '</label>' +
      '  <select name="' + field.id + (field.isMultiple ? '[]' : '') + '" class="form-control" id="select' + field.id + '" ' + (field.isMultiple ? 'multiple="multiple"' : '') + '>';

    for (let item of field.items) {
      if (field.default == item.id) {
        content += '<option value="' + item.id + '" selected>' + item.name + '</option>';
      } else {
        content += '<option value="' + item.id + '" >' + item.name + '</option>';
      }
    }

    content += '  </select>' +
      ' </div>';

    return content;
  }

  var htmlEditorTemplate = function (field) {

    return '<div class="form-group ' + field.classes + '">' +
      '<label for="' + field.id + '">' + field.label + '</label>' +
      '<div id="summernote' + field.id + '" name="' + field.id + '" class="form-control summernote">' + field.default + '</div>' +
      '<textarea hidden name="' + field.id + '" id="' + field.id + '">' + field.default + '</textarea>' +
      '</div>';

  }

  var multipleTextTemplate = function (field) {

    return '<div class="form-group ' + field.classes + '" id="fields">' +
      '    <label class="control-label" for="field1">' + field.label + '</label>' +
      '    <div class="controls" autocomplete="off" > ' +
      '            <div class="entry input-group">' +
      '                <input class="form-control" id="multipletext' + field.id + '" name="' + field.id + '[]" type="text" placeholder="' + field.placeholder + '" />' +
      '              <span class="input-group-btn">' +
      '                    <button class="btn btn-success btn-add" type="button">' +
      '                        <span class="glyphicon glyphicon-plus"></span>' +
      '                    </button>' +
      '                </span>' +
      '            </div>' +
      '    </div>' +
      '</div>';
  }

  var locationMapTemplate = function (field) {

    return '<label class="control-label ' + field.classes + '" for="map_canvas' + field.latid + '">' + field.label + '</label>' +
      '<div class="row">' +
      '<div id="map_canvas' + field.latid + '" class="col-xs-8" style="height:300px; width:300px"></div>' +
      '<div id="latlong" class="col-xs-4 form-group">' +
      '<p>Latitude: <input class="form-control"  size="20" type="text" id="map' + field.latid + '" name="gpslat" ></p>' +
      '<p>Longitude: <input class="form-control"  size="20" type="text" id="map' + field.lngid + '" name="gpslng" ></p>' +
      '</div>' +
      '</div>';
  }



  var startGroupTemplate = function (field) {
    return '<div class="panel panel-default ' + field.classes + '">' +
      '<div class="panel-heading">' + field.label + '</div>' +
      '<div class="panel-body">';
  }

  var endGroupTemplate = function (field) {

    return '</div></div>';
  }

  var startLineTemplate = function (field) {
    return '<div class="form-inline ' + field.classes + '">';
  }

  var endLineTemplate = function (field) {

    return '</div>';
  }

  return {
    //initialise modal
    init: init,

    //save button
    setSaveButtonText: setSaveButtonText,

    //add fields to modal
    addNumericInput: addNumericInput,
    addTextInput: addTextInput,
    addTextAreaInput: addTextAreaInput,
    addImageInput: addImageInput,
    addIconInput: addIconInput,
    addHidden: addHidden,
    addSelect: addSelect,
    addTextHtmlEditor: addTextHtmlEditor,
    addMultipleText: addMultipleText,
    addLocationMap: addLocationMap,
    startGroup: startGroup,
    endGroup: endGroup,
    startLine: startLine,
    endLine: endLine,
    addClasses: addClasses,
    addSwitchInput: addSwitchInput,
    addDateInput: addDateInput,

    //render modal
    renderContent: renderContent,

    //set modal opener element (open button)
    setOpener: setOpener
  };

})();
