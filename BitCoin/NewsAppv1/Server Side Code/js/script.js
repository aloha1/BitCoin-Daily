'use strict';
$(document).ready(function() {
    // get page name
    var PAGE_NAME = window.location.pathname.split("/").pop();

    // --------------------------------------------------------dashboard page-------------------------------------------------------
     if (PAGE_NAME === 'dashboard' || PAGE_NAME === '') {

        /*
        * Top Viewed News Table
        */
        $('#top-viewed-table').DataTable( {
            "paging" : true,
            "lengthChange" : false,
            "searching" : false,
            "ordering" : false,
            "info" : false,
            "autoWidth" : false,
            'dom' : 'rtip',
            "processing" : true,
            ajax: {
                url: './api/news/top/viewed/0/50',
                dataSrc: ''
            },
            columns: [{ data: 'name' },
                    {
                    data : "viewed",
                    width : "20px"
                    }]
        } );


        /*
        * Top Shared News Table
        */
        $('#top-shared-table').DataTable( {
            "paging" : true,
            "lengthChange" : false,
            "searching" : false,
            "ordering" : false,
            "info" : false,
            "autoWidth" : false,
            'dom' : 'rtip',
            "processing" : true,
            ajax: {
                url: './api/news/top/shared/0/50',
                dataSrc: ''
            },
            columns: [{ data: 'name' },
                    {
                    data : "shared",
                    width : "20px"
                    }]
        } );


        /*
        * Top Favored News Table
        */
        $('#top-favorited-table').DataTable( {
            "paging" : true,
            "lengthChange" : false,
            "searching" : false,
            "ordering" : false,
            "info" : false,
            "autoWidth" : false,
            'dom' : 'rtip',
            "processing" : true,
            ajax: {
                url: './api/news/top/favorited/0/50',
                dataSrc: ''
            },
            columns: [{ data: 'name' },
                    {
                    data : "favorited",
                    width : "170px"
                    }]
        } );

        
    // --------------------------------------------------------News Articles page-------------------------------------------------------
    } else if (PAGE_NAME === 'news' || PAGE_NAME === '') {

        var current = 0;
        var loadMore = true;

        /*
        * Initially load 10 items
        */
        loadMoreContent(0, 9, $('#search-news').val());


        /*
        * load 10 more on scroll
        */
        $(window).scroll(function(){
            if ($(window).scrollTop() + $(window).height() >= $(document).height() - 300){
               if(loadMore)
                    loadMoreContent(current, 10, $('#search-news').val());
            }
        });


        /*
        * load more items
        */
        function loadMoreContent(pos, limit, search) {

            loadMore=false;
            console.log("loading content");
                  $.ajax({
                  url : "./api/news/"+pos+"/"+limit+"?search="+search,
                  type : "GET",
                  processData: false,
                  contentType: false,
                  success : function(data, status) {
                    //add new items to page
                    var json = $.parseJSON(data);
                    for (var row in json) {
                        var firstImage ="./images/loading.png";
                        try
                        {
                            var image = jQuery.parseJSON( json[row].image );
                            firstImage = './uploads/'+image[0];
                        }catch(err){
                        }
                        var item = '<div data-id="'+json[row].id+'" class="open-modal item">'+// col-sm-12 col-md-6 col-lg-4
                        '<div class="inner"><img src="'+firstImage+'">'+
                        '<div class="overlay"></div>'+
                        '<div class="card-content">'+
                        '<h2>'+moment(json[row].submission_date).format("Do MMM YYYY, h:mma")+'</h2>'+
                        '<h4>'+json[row].name+'</h4>'+
                        '<h4> <span class="label label-danger">'+((json[row].scheduled)?'Scheduled':'')+'</span> <span class="label label-primary">'+((json[row].is_breaking)?'Breaking':'')+'</span> <span class="label label-info">'+((json[row].has_video)?'<span class="glyphicon glyphicon-facetime-video" aria-hidden="true"></span>':'')+'</span> <span class="label label-warning">'+((json[row].is_headline)?'Headline':'')+'</span></h4>'+
                        '</div></div></div>';
                         $('#news-container').append(item).fadeIn(999);
                         console.log(pos);
                    }
                    if(json.length>0)
                        loadMore=true;
                    current += limit;

                    if ( $(document).height()-300 > $('#news-container').height()){
                        if(loadMore)
                            loadMoreContent(current, 10, search);
                    }
                  },
                  error : function(jqXHR) {
                     console.log(jqXHR);
                  }
              });
        }


        /*
        * Something typed in search box
        */
        $('#search-news').keyup(function() {
            $('#news-container').html("");
             loadMore=true;
            loadMoreContent(0, 50, $(this).val());
        });

        /*
        * Get news and create modal to edit news
        */
        getCatagories(function(catagories){
                ModalMaker.init( {
                    title : "Edit News",
                    name : "news-modal_name",
                    serverUrl: "./api/new"
                });

                ModalMaker.addTextInput("name", "News Title*", "Enter your news title");
                ModalMaker.addTextHtmlEditor("text", "News Content", "");

                ModalMaker.startGroup("Details");
                ModalMaker.addSwitchInput("is_breaking", "Breaking News", 0).addClasses("col-xs-12 col-md-4");
                ModalMaker.addSwitchInput("has_video", "Show Video Icon", 0).addClasses("col-xs-12 col-md-4");
                ModalMaker.addSwitchInput("is_headline", "Headline", 0).addClasses("col-xs-12 col-md-4");
                ModalMaker.addSwitchInput("allow_comments", "Enable Comments", 0).addClasses("col-xs-12 col-md-4");
                ModalMaker.addDateInput("submission_date", "Submission Date", "t", moment().format('YYYY-MM-DD HH-mm-ss')).addClasses("col-xs-12 col-md-12");
                ModalMaker.endGroup();


                ModalMaker.startGroup("Media");
                ModalMaker.addImageInput("image", "Featured Images (600*300)", 1);
                ModalMaker.endGroup();

                ModalMaker.startGroup("Category");
                ModalMaker.addSelect("category", "(Ctrl-click to deselect item)",catagories ,true, 2);
                ModalMaker.endGroup();
                

                ModalMaker.renderContent($("#modal-placeholder"), '<label class="checkbox-inline pull-left"><input name="pushnotification" type="checkbox" value="yes">Send Push Notification</label>');
                ModalMaker.setOpener(".open-modal");
                       
        });

    // --------------------------------------------------------catagories page-------------------------------------------------------
    } else if (PAGE_NAME === 'categories' || PAGE_NAME === '') {

        /*
        * Categories table
        */
        $('#categories-table').DataTable( {
            "paging" : true,
            "lengthChange" : true,
            "searching" : true,
            "ordering" : true,
            "info" : false,
            "autoWidth" : false,
            'dom' : 'rtip',
            "processing" : true,
            ajax: {
                url: './api/categories',
                dataSrc: ''
            },
            columns: [{
                    data : "id",
                    width : "20px"
                },
                {
                    data: "image",
                    render: function(data, type, row) {
                        var firstImage ="./images/loading.png";
                        try{
                            firstImage = './uploads/'+jQuery.parseJSON( data )[0];
                        }catch(err){
                        }
                        return '<img width="120px" height="60px" src="'+firstImage+'" />';
                    },
                    width : "130px"
                },
                {
                    data: "icon",
                    render: function(data, type, row) {
                        return '<i class="fa '+data+'"></i>';
                    }
                },
                { data: 'name' },
                { data: 'description' }
            ],
            createdRow: function (row, data, index) {
                    $(row).addClass('open-modal');
                    $(row).attr("data-id", data['id']);
            }
        } );


        /*
        * search Categories table
        */
        $('#search-catagories').keyup(function() {
            $('#categories-table').DataTable().search($(this).val()).draw();
        });

        // length of users table changed
        $('#length-catagories-table').change(function() {
            $('#categories-table').DataTable().page.len($(this).val()).draw();
        });


        /*
        * Create modal to edit categories
        */
        ModalMaker.init( {
            title : "Edit Category",
            name : "category-modal_name",
            serverUrl: "./api/category"
        });
        ModalMaker.addTextInput("name", "Category Name", "eg: Tech");
        ModalMaker.addImageInput("image", "Category Image");
        ModalMaker.addIconInput("icon", "Category Icon");
        ModalMaker.addTextAreaInput("description", "Category Description", "");
        ModalMaker.renderContent($("#modal-placeholder"));
        ModalMaker.setOpener(".open-modal");


    // --------------------------------------------------------users page-------------------------------------------------------
    } else if (PAGE_NAME === 'users' || PAGE_NAME === '') {
        var tag=".users"

        /*
        * Users table
        */
        $(tag).find('.table').DataTable( {
            "paging" : true,
            "lengthChange" : true,
            "searching" : true,
            "ordering" : true,
            "info" : false,
            "autoWidth" : false,
            'dom' : 'rtip',
            "processing" : true,
            ajax: {
                url: './api/users',
                dataSrc: ''
            },
            columns: [{
                    data : "id",
                    width : "20px"
                },
                { data: 'username' },
                { data: 'public_name' },
                {
                    data: "role",
                    render: function(data, type, row) {
                        var Roles = ["Admin", "Author"];
                        return Roles[data];
                    }
                },
            ],
            createdRow: function (row, data, index) {
                    $(row).addClass('open-modal');
                    $(row).attr("data-id", data['id']);
            }
        } );


        /*
        * search user table
        */
        $(tag).find('.search').keyup(function() {
            $(tag).find('.table').DataTable().search($(this).val()).draw();
        });

        // length of users table changed
        $(tag).find('.length').change(function() {
            $(tag).find('.table').DataTable().page.len($(this).val()).draw();
        });


        /*
        * Create modal to edit user
        */
        ModalMaker.init( {
            title : "Edit User",
            name : "users-modal_name",
            serverUrl: "./api/user"
        });
        ModalMaker.addTextInput("username", "UserName", "eg: JohnDoe");
        ModalMaker.addTextInput("public_name", "Public Author Name", "eg: John Doe");
        ModalMaker.addTextInput("newpassword", "Password", "password");
        ModalMaker.addTextInput("confirmpassword", "Confirm Password", "password");
        //ModalMaker.addNumericInput("role", "Role", 0, 1, 1, 1);
        ModalMaker.addSelect("role", "Role", [{id:0, name:"Admin (Can Edit Users)"}, {id:1, name:"Author"}] ,false, 0);
        ModalMaker.renderContent($("#modal-placeholder"));
        ModalMaker.setOpener(".open-modal");

        
    // --------------------------------------------------------info page-------------------------------------------------------
    } else if (PAGE_NAME === 'info' || PAGE_NAME === '') {

        /*
        * set summernote HTML Editor
        */
        $(".summernote").summernote({
          callbacks: {
            onChange: function(contents, $editable) {
                $(this).parent().find('textarea').val(contents);
            }
          },
          height: "40em"
        });
    }else{
    // --------------------------------------------------------others page-------------------------------------------------------
        ShareModal.init( {
            title : "Share Article",
            name : "item-modal-share",
            url:"wdwd",
            modalPlaceholder: $("#sharemodal-placeholder")
        });
        ShareModal.setOpener(".open-share-modal");
    }


    /*
    * Toggle side navigation menu
    */
    $('[data-toggle=collapse]').click(function() {
        $('.row-offcanvas').toggleClass('active-navigation');
    });


    /*
    * Get Categories
    */
    function getCatagories(callback){
           $.ajax({
              url : "./api/categories",
              type : "GET",
              processData: false,
              contentType: false,
              success : function(data, status) {
                  var catagories = $.parseJSON(data);
                  callback(catagories);
              },
              error : function(jqXHR) {
                 console.log(jqXHR);
              }
          });
    }

});