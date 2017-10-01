<?php

class Categories extends DB\SQL\Mapper{

	public function __construct(DB\SQL $db) {
	    parent::__construct($db,'categories');
	}
	
	public function all() {
	    $this->load();
	    return $this->query;
	}
}