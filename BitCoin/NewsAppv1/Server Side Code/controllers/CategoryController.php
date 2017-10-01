<?php
class CategoryController extends ItemController{
	public $tablename = "categories";
	public $filter_valid_columns  = array( 'id','name');

	//make Available for everyone, not just admin
	function beforeroute(){
    }


	function getById($f3) {
		$item = $this->getByIdFromParameters();
        echo json_encode($item); 
	}


	function getMultiple($f3) {
		//get pagination parameters
		$limit = $f3->get('PARAMS.limit');
		$pos = $f3->get('PARAMS.pos');
		
		if($limit ==null)
			$limit =100000;
		if($pos ==null)
			$pos = 0;

		//filter
		$filter = $this->getFilterFromParameters("name");
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


    function getMultipleByIds($f3) {
		$search = $f3->get('GET.search');
		$ids = json_decode($f3->get('POST.ids'));
		$idsStr = implode(',', $ids);

        $item = new ItemModel($this->db);
        $filter2 = array('id in ('.$idsStr.')');
	    $option = array(
	            'order' => 'id ASC'
	    );
        $list = array_map(array($item,'cast'), $item->find($filter2,$option));
	 	echo  json_encode($list);      
    }


	function add($f3){
		$this->auth(User::ADMIN);   
    	if($f3->get('DEMO'))
			exit;
		$item = new ItemModel($this->db, $this->tablename);
		$item->loadIfIdAvailable($f3, "id");
        $item->read($f3, 'name', 'description', 'icon');
        $item->readImage($f3, "image", true, 600, 300);
        $item->save();
	}


	function delete($f3){
		$this->auth(User::ADMIN);   
		if($f3->get('DEMO'))
			exit;
		$item = new ItemModel($this->db, $this->tablename);
		$item->deleteById($this->db,  $f3->get('PARAMS.id'));
	}
}