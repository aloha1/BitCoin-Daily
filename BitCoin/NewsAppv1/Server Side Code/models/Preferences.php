<?php

class Preferences extends DB\SQL\Mapper{

	public function __construct(DB\SQL $db) {
	    parent::__construct($db,'preferences');
	}

	public function all() {
	    $this->load();
	    return $this->query;
	}

	public function setValue($name, $value){
		//add or edit to db
		$this->load(array('name = ?',$name));
		$this->name = $name;
		$this->value = $value;
		$this->save();
		
	}

	public function getValue($name, $default) {
		$this->load(array('name = ?',$name));
		if ($this->dry())
			return $default;
		else	
	    	return $this->value;
	}
}