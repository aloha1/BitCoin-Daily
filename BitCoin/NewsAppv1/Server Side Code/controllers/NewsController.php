<?php
class NewsController extends ItemController
{
    public $tablename = "news";
    public $filter_valid_columns  = array( 'id','accepted','name','text','submission_date','author_id','is_breaking', 'has_video', 'is_headline');

    //make Available for everyone, not just admin
    function beforeroute()
    {
    }


    function getById($f3)
    {
        $item = $this->getByIdFromParameters();
        $item['category'] = json_encode($this->getRelationTableFromDb("news_categories", "news_id", "category_id", $item['id']));
        
        if ($item['author_id']>0) {
            $user = new User($this->db);
            $user->getById( $item['author_id']);
            $item['author'] = $user->public_name;
        } else {
            $item['author'] ="";
        }

        echo json_encode($item);
    }


    function getMultipleNews($f3, $top, $local_filter = array())
    {
        //get pagination parameters
        $limit = $f3->get('PARAMS.limit');
        $pos = $f3->get('PARAMS.pos');
        $category_id = $f3->get('GET.category');
        $accepted = $f3->get('GET.accepted');

        $hasAuth=$this->hasAuth(User::AUTHOR);

        //accepted or not accepted
        if ($accepted=="") {
            $accepted="1";
        }
        if ($accepted==null) {
            $accepted="1";
        }
        
        $local_filter['accepted'] = $accepted;

        //dont load scheduled if not logged in
        $now = new DateTime();
        if (!$hasAuth) {
            $local_filter["maximum_submission_date"] =$now->format('Y-m-d H:i:s');
        }


        //categories
        if (isset( $_GET[ 'category' ] )) {
            $ids = $this->getRelationTableFromDb("news_categories", "category_id", "news_id", $category_id);
            $local_filter['id'] = $ids;
        }

        //filter
        $filter = $this->getFilterFromParameters("name", $local_filter);
        //print_r( $filter);

        //pagination and order
        $option = array(
                'order' => $top.' DESC',
                'limit' => $limit,
                'offset' => $pos
        );
    
        $item = new ItemModel($this->db, $this->tablename);
        $list = array_map(array($item,'cast'), $item->find($filter, $option));

        //get users
        $user = new User($this->db);
        $user->all();
        $users=array_map(array($user,'cast'), $user->find(null, null));
        $usersList=array();
        for ($i = count($users)-1; $i >= 0; $i--) {
            $usersList[""+$users[$i]['id']]=$users[$i]['public_name'];
        }

        //mark posts as scheduled if in admin panel
        for ($i = count($list)-1; $i >= 0; $i--) {
            $submission_date = new DateTime($list[$i]["submission_date"]);
            
            //add author name
            $list[$i]["author"]=$usersList[$list[$i]["author_id"]];

            //add scheduled
            if ($submission_date > $now) {
                //future
                $list[$i]["scheduled"] = 1;
            } else {
                $list[$i]["scheduled"] = 0;
            }
        }

        //return list
        //print_r( $list);
        echo  json_encode($list);
    }

    function getMultiple($f3)
    {
          $this->getMultipleNews($f3, "submission_date");
    }

    function getTop($f3)
    {
        $top = $f3->get('PARAMS.top');

        $preferences = new Preferences($this->db);
        $topduration = $preferences->getValue("topduration", "7");
        $now = new DateTime();
        $lastweek = $now->sub(new DateInterval('P'.$topduration.'D'));
        $local_filter = array('minimum_submission_date' => $lastweek->format('Y-m-d H:i:s'));

        $this->getMultipleNews($f3, $top, $local_filter);
    }


    function add($f3)
    {
        //authenticate
        $this->auth(User::AUTHOR);
        if ($f3->get('DEMO')) {
            exit;
        }

        //check if accepted
        $accepted=$this->hasAuth(User::AUTHOR);
        if ($f3->get('POST.accepted')=="0") {
             $accepted=0;
             exit;
        }

        //get author id
        $user = new User($this->db);
        $user->getByName($_SESSION['user']);

        //add item
        $item = new ItemModel($this->db, $this->tablename);
        $item->loadIfIdAvailable($f3, "id");
        $item->accepted = $accepted;
        $item->read($f3, 'name', 'text', 'submission_date', 'author_id', 'is_breaking', 'has_video', 'is_headline', 'allow_comments');
        $item->readImage($f3, "image", true, 600, 300);
        $item->author_id = $user->id;
        $item->save();
        $this->getRelationTableFromPost("category", "news_categories", "news_id", "category_id", $item->id);

        //send push notification if enabled
        if (!(empty($f3->get('POST.pushnotification')))) {
            $apiController = new ApiController();
            if ($item->is_breaking==1) {
                $apiController->sendPushNotification($f3, "Breaking News", $f3->get('POST.name'), 'breaking');
            } else {
                 $apiController->sendPushNotification($f3, "News", $f3->get('POST.name'));
            }
        }
    }


    function delete($f3)
    {
        //authenticate
        $this->auth(User::AUTHOR);
        if ($f3->get('DEMO')) {
            exit;
        }

        //delete item by id
        $item = new ItemModel($this->db, $this->tablename);
        $item->deleteById($this->db, $f3->get('PARAMS.id'));
    }


    function viewed($f3)
    {
        //increment viewed
        $item = new ItemModel($this->db, $this->tablename);
        $item->incrementById($f3, 'viewed');
        echo "1";
    }


    function shared($f3)
    {
        //increment shared
        $item = new ItemModel($this->db, $this->tablename);
        $item->incrementById($f3, 'shared');
        echo "1";
    }
    

    function favorited($f3)
    {
        //increment favorited
        $item = new ItemModel($this->db, $this->tablename);
        $item->incrementById($f3, 'favorited');
        echo "1";
    }
}
