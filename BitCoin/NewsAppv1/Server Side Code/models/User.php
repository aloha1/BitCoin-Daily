<?php

class User extends DB\SQL\Mapper{

	const ADMIN = 0;
	const AUTHOR = 1;
	const ROLES  = [ 'Admin','Author'];
    
    public function __construct(DB\SQL $db) {
        parent::__construct($db,'users');
    }

    public function all() {
        $this->load();
        return $this->query;
    }

    public function getById($id) {
        $this->load(array('id=?',$id));
        return $this->query;
    }

    public function getByName($name) {
        $this->load(array('username=?', $name));
    }

    public function delete($id) {
        $this->load(array('id=?',$id));
        $this->erase();
    }
}