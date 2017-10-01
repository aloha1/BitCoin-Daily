<?php
/**
* ModalMaker Version 1.1
**/
class ItemController extends Controller
{
    public $filter_valid_columns;
    public $tablename;
    public $search_keyword = "search";
    public $id_column = "id";


    /**
    * Get Item by id. The id is obtained from the REST url parameters
    **/
    public function getByIdFromParameters()
    {
        $itemModel = new ItemModel($this->db, $this->tablename);
        $id = $this->f3->get('PARAMS.id');
        return $itemModel->getById($this->f3, $id);
    }

    /**
    * Get filter from parameters.
    * $search_column - The table column used to perform search (?search="keyword")
    * $local_filter - Create filter from local parameters rather than from GET parameters
    **/
    public function getFilterFromParameters($search_column = null, $local_filter = null)
    {

        //get filter query
        $query = array();
        $query_variables = array();
        foreach ($this->filter_valid_columns as $column) {
            if ($local_filter!=null) {
                if (array_key_exists($column, $local_filter)) {
                    if ($column==$this->id_column) {
                        //id will be in this format: [12,14]
                        $ids=$local_filter[ $column ];
                        if (count($ids)>0) {
                            $idsStr = implode(',', $ids);
                            $query[] = $column .' in ('.$idsStr.')';
                            continue;
                        } else {
                            //load none
                            $query[] = $column .' in (0)';
                            continue;
                        }
                    } else {
                        // add it to the search array.
                        $query[] = $column . ' = ? ';
                        $query_variables[] = $local_filter[ $column ];
                        continue;
                    }
                } elseif (array_key_exists(  "maximum_".$column, $local_filter )||  array_key_exists( "minimum_".$column, $local_filter )) {
                //maximum
                    if (array_key_exists(  "maximum_".$column, $local_filter )) {
                          // add it to the search array.
                        $query[] = $column . ' <= ? ';
                        $query_variables[] = $local_filter[ "maximum_".$column ];
                    }
                //minimum
                    if (array_key_exists( "minimum_".$column, $local_filter )) {
                          // add it to the search array.
                        $query[] = $column . ' >= ? ';
                        $query_variables[] = $local_filter[ "minimum_".$column ];
                    }
                }
            }
            //get from get parameters
            if (isset( $_GET[ $column ] )) {
                if ($column==$this->id_column) {
                    //id will be in this format: [12,14]
                    $ids=json_decode($_GET[ $column ]);
                    if (count($ids)>0) {
                        $idsStr = implode(',', $ids);
                        $query[] = $column .' in ('.$idsStr.')';
                    }
                } else {
                  // add it to the search array.
                    $query[] = $column . ' = ? ';
                    $query_variables[] = $_GET[ $column ];
                }
            } //max min
            elseif (isset( $_GET[ "maximum_".$column ] )||  isset( $_GET[ "minimum_".$column ])) {
                //maximum
                if (isset( $_GET[ "maximum_".$column ] )) {
                  // add it to the search array.
                    $query[] = $column . ' <= ? ';
                    $query_variables[] = $_GET[ "maximum_".$column ];
                }
                //minimum
                if (isset( $_GET[ "minimum_".$column ] )) {
                  // add it to the search array.
                    $query[] = $column . ' >= ? ';
                    $query_variables[] = $_GET[ "minimum_".$column ];
                }
            }
        }

        //get search
        if ($search_column !=null) {
            if (isset( $_GET[ $this->search_keyword ] )) {
                // add it to the search array.
                $query[] = $search_column . ' LIKE ? ';
                $query_variables[] = "%".$_GET[ $this->search_keyword ]."%";
            }
        }

        //create filter array
        $filter=null;
        if (count($query)>0) {
            $filter = array(implode( ' AND ', $query ));
            $filter = array_merge($filter, $query_variables);
        }

        return $filter;
    }


    /**
    * This is used when a table is related to another table by a relation table (eg: properties_categories).
    * eg: $this->getRelationTableFromPost("category","properties_categories", "property_id", "category_id", $item->id);
    **/
    public function getRelationTableFromPost($post_key, $table, $item_id_column, $other_id_column, $item_id)
    {
        if ($item_id>=0) {
            $array = $this->f3->get('POST.'.$post_key);
            if (count($array)>0) {
                //prepare insert query
                $insert_sql = 'INSERT INTO '.$table.' ('.$item_id_column.', '.$other_id_column.') VALUES ';
                $prefix='';
                foreach ($array as $item) {
                    $insert_sql.=$prefix."('".$item_id."', '".$item."')";
                    $prefix=',';
                }
                $insert_sql.=';';
            }

            //delete past references and add new
            $this->db->begin();
            $this->db->exec('DELETE FROM '.$table.' WHERE '.$item_id_column.'="'.$item_id.'";');
            if (count($array)>0) {
                $this->db->exec($insert_sql);
            }
            $this->db->commit();
        }
    }

    /**
    * Get a list of ids of the related table items.
    * eg: $ids = $this->getRelationTableFromDb("properties_categories", "category_id", "property_id", $category_id);
    **/
    public function getRelationTableFromDb($table, $item_id_column, $other_id_column, $item_id)
    {
        $joinTable = new DB\SQL\Mapper($this->db, $table);
        $joinTable->load(array($item_id_column.' = ?', $item_id));
        $list = array();
        while (!$joinTable->dry()) {
            array_push($list, $joinTable->{$other_id_column});
            $joinTable->next();
        }
        return $list;
    }
}
