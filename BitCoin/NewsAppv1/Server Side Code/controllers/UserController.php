<?php
class UserController extends ItemController
{
    public $tablename = "users";
    public $filter_valid_columns  = array( 'id', 'public_name');
    /**
    * Render login page
    **/
    function render()
    {
        if (isset($_SESSION['user'])) {
            $this->f3->reroute('/');
            exit;
        }

        $template=new Template;
        echo $template->render('login.htm');
    }

    function beforeroute()
    {
    }

    /**
    * Set username and password
    **/
    function setUser($f3)
    {
        //check for demo
        if ($f3->get('DEMO')) {
            echo 'Changing of Credentials is not Available in demo mode';
            exit;
        }

        //get data from form
        $username = $_SESSION['user'];
        $public_name = $this->f3->get('POST.public_name');
        $newusername = $this->f3->get('POST.newusername');
        $newpassword = $this->f3->get('POST.newpassword');
        $confirmpassword = $this->f3->get('POST.confirmpassword');
        $password = $this->f3->get('POST.password');

        //check that confirm password is ok
        if ($newpassword != $confirmpassword) {
             $this->f3->reroute('/settings?error=wrong_confirm_pass');
        }

        //load user by username
        $user = new User($this->db);
        $user->getByName($username);
        if ($user->dry()) {
            $this->f3->reroute('/login');
        }

        //verify old password
        if (password_verify($password, $user->password)) {
            //change pasword and username
            $user->username = $newusername;
            $user->password = password_hash($newpassword, PASSWORD_DEFAULT);
            $user->public_name = $public_name;
            $user->save();
            $_SESSION['user']= $newusername;
            $this->f3->reroute('/settings');
        } else {
            $this->f3->reroute('/settings?error=wrong_pass');
        }
    }

    /**
    * New user
    **/
    function add($f3)
    {
        if ($f3->get('DEMO')) {
            exit;
        }

        //must be admin
        $this->auth(User::ADMIN);

        //get data from form
        $public_name = $this->f3->get('POST.public_name');
        $newusername = $this->f3->get('POST.username');
        $newpassword = $this->f3->get('POST.newpassword');
        $confirmpassword = $this->f3->get('POST.confirmpassword');
        $role = $this->f3->get('POST.role');
        $id = $f3->get('POST.id');
       

        //check that confirm password is ok
        if ($newpassword != $confirmpassword) {
             $this->f3->reroute('/settings?error=wrong_confirm_pass');
        }

        //check if username exists
        // $user = new User($this->db);
        // $user->getByName($username);
        // if(!$user->dry()) {
        //     $this->f3->reroute('/settings?error=username_exists');
        // }

        //create user
        $user = new User($this->db);
        if ($id>=0) {
            $user->load(array('id = ?',$id));
        }
        $user->username = $newusername;
        $user->public_name = $public_name;
        if (strlen($newpassword)>0) {
            $user->password = password_hash($newpassword, PASSWORD_DEFAULT);
        }
        $user->role = $role;
        $user->save();
    }


    /**
    * Authenticate password and username
    **/
    function authenticate()
    {
        //get username and password
        $username = $this->f3->get('POST.username');
        $password = $this->f3->get('POST.password');

        //get user by username
        $user = new User($this->db);
        $user->getByName($username);

        if ($user->dry()) {
            $this->f3->reroute('/login');
        }

        //user exists. Verify password
        if (password_verify($password, $user->password)) {
            $_SESSION['user']= $user->username;
            $_SESSION['role']= $user->role;
            $_SESSION['role_title']= User::ROLES[$user->role];
            $this->f3->reroute('/');
        } else {
            $this->f3->reroute('/login');
        }
    }


    /**
    * Logout from system
    **/
    function logout()
    {
        if (isset($_SESSION['user'])) {
            unset($_SESSION['user']);
        }
         $this->f3->reroute('/login');
    }


    function getById($f3)
    {
        $item = $this->getByIdFromParameters();
        echo json_encode($item);
    }


    function getMultiple($f3)
    {
        $this->auth(User::ADMIN);
        //get pagination parameters
        $limit = $f3->get('PARAMS.limit');
        $pos = $f3->get('PARAMS.pos');
        
        //default values for pos and limit
        if ($limit ==null) {
            $limit =100000;
        }
        if ($pos ==null) {
            $pos = 0;
        }

        //filter
        $filter = $this->getFilterFromParameters("username");
        //print_r( $filter);

        //pagination and order
        $option = array(
                'order' => 'id ASC',
                'limit' => $limit,
                'offset' => $pos
        );
    
        $item = new ItemModel($this->db, $this->tablename);
        $item->getMultiple($filter, $option);
    }


    function getMultipleByIds($f3)
    {
        //authenticate
        $this->auth(User::ADMIN);

        //get search field and ids
        $search = $f3->get('GET.search');
        $ids = json_decode($f3->get('POST.ids'));
        $idsStr = implode(',', $ids);

        //load items
        $item = new ItemModel($this->db);
        $filter2 = array('id in ('.$idsStr.')');
        $option = array(
                'order' => 'id ASC'
        );

        //return items
        $list = array_map(array($item,'cast'), $item->find($filter2, $option));
        echo  json_encode($list);
    }



    function delete($f3)
    {
        //authenticate
        $this->auth(User::ADMIN);
        if ($f3->get('DEMO')) {
            exit;
        }

        //delete item
        $item = new ItemModel($this->db, $this->tablename);
        $item->deleteById($this->db, $f3->get('PARAMS.id'));
    }
}
