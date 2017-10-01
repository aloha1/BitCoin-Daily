<?php
/**
* ItemModal Version 1.1
**/
class ItemModel extends DB\SQL\Mapper{

    public $tablename;

	public function __construct(DB\SQL $db, $tablename) {
	    parent::__construct($db, $tablename);
        $this->tablename=$tablename;
	}
	
    
	public function all() {
	    $this->load();
	    return $this->query;
	}


    public function getById($f3, $id) {
        $this->load(array('id = ?',$id));
        return $this->cast();
    }


    public function deleteById(DB\SQL $db, $id) {
        if($id>=0){
            $db->begin();
            $db->exec('DELETE FROM '.$this->tablename.' WHERE id="'.$id.'"');
            $db->commit();
        }
    }

    public function getMultiple($filter, $option){
        $list = array_map(array($this,'cast'), $this->find($filter,$option));
        echo  json_encode($list);   
    }



    //read from POST to save to database-------------------------------------------------------------------

    /**
    * Load data from table only if id exists.
    **/
    public function loadIfIdAvailable($f3, $column){
        $id = $f3->get('POST.'.$column);
        if($id>=0){
            $this->load(array($column.' = ?',$id));
        }
    }


    /**
    * read a list of columns from POST to be stored in DB by save().
    **/
    // public function read($f3, ...$columns){
    //     foreach ( $columns as $column ) {
    //         $this->{$column} = $f3->get('POST.'.$column);
    //     }
    // }

     /**
    * read a list of columns from POST to be stored in DB by save().
    **/
    public function read($f3, $columns){
    	$counter = 0;
    	$arguments = func_get_args();
        foreach ( $arguments as $argument ) {
        	if($counter++ != 0)
            	$this->{$argument} = $f3->get('POST.'.$argument);
        }
    }


    /**
    * Read a JSON array from POST. $ignoreEndElements enables you to ignore items from the end of the array.
    **/
    public function readArray($f3, $column, $ignoreEndElements=0){
        $this->{$column} = json_encode(array_slice($f3->get('POST.'.$column), 0, count($f3->get('POST.'.$column))-$ignoreEndElements, true));
    }


    /**
    * Read an image from POST.
    * $resize - resize or not?
    * $width, $height - resize dimensions
    **/
    public function readImage($f3, $column, $resize=false, $width=100,$height=100){

        //upload image to server UPLOADS folder.
        $web = \Web::instance();
        $img_files = $web->receive(function($file,$formFieldName){
                // maybe you want to check the file size
                if($file['size'] > (4 * 1024 * 1024)) // if bigger than 4 MB
                    return false;

                return true;
            },
            true,//overwrite
            function($fileBaseName, $formFieldName){
                // build new file name from base name or input field name
                return time().$fileBaseName;
            }
        );

        //add to image name to database
        if(count($img_files)>0){
            $imageNames = array_keys($img_files);
            foreach($imageNames as $key => $imageName) {
                $imageNamebase[$key] = basename($imageName);

                //resize image
                if($resize){
                    $img = new \Image($imageName);
                    $img->resize( $width, $height, true, true );
                    $f3->write( $imageName, $img->dump() );
                }
            }
            $this->{$column} = json_encode(array_slice($imageNamebase, 0, count($imageNamebase), true));
        }

    }


    /**
    * Increment an integer column in database
    **/
    public function incrementById($f3, $column) {
        $id = $f3->get('PARAMS.id');
        $this->load(array('id=?',$id));
        $this->{$column}++;
        $this->update();
        echo "1";           
    }


}