<?php
class PublicController extends Controller{

    function beforeroute(){
    }

    /*
    * Render a single article page
    */
    function renderSingleItem($f3) {
        //get item by id from database
        $itemModel = new ItemModel($this->db, "news");
        $id =$f3->get('PARAMS.id');
        $item = $itemModel->getById($f3, $id);

        if(!$itemModel->dry()){
            //get item first image
            $images = json_decode($item["image"]);
            if(count($images)>0 ){
                $item["firstimage"]  =$images[0];
            }else{
                $item["firstimage"] ="";
            }

            //add item to template
            $f3->set('item',$item);
            $f3->set('content','singleitem.htm');
            $f3->set('meta','metatags.htm');

            //return template
            $template=new Template;
            echo $template->render('publictemplate.htm');
        }else{
            //nothing found
            $f3->set('textcontent','Nothing Here :p');
            $template=new Template;
            echo $template->render('404.htm');
        }
    }
}