<?php
class MainController extends Controller{

	/**
	* Takes care of rendering of browser requests for admin page
	**/


	function render($f3) {
		$f3->set('content','dashboard.htm');
        $template=new Template;
        echo $template->render('template.htm');
	}


	function renderSettings($f3) {
		$preferences = new Preferences($this->db);
		$topduration = $preferences->getValue("topduration", "7");
		$showauthorname = $preferences->getValue("showauthorname", "1");
		$showfeatureimage = $preferences->getValue("showfeatureimage", "1");
		$f3->set('topduration',$topduration);
		$f3->set('showauthorname',$showauthorname);
		$f3->set('showfeatureimage',$showfeatureimage);
		$f3->set('content','settings.htm');
        $template=new Template;
        echo $template->render('template.htm');
	}


	function renderInfo($f3) {
        $preferences = new Preferences($this->db);
        $info = $preferences->getValue("info", "");
        $f3->set('default',$info);
		$f3->set('content','info.htm');
        $template=new Template;
        echo $template->render('template.htm');
	}


	function renderCategories($f3) {
		$f3->set('content','categories.htm');
        $template=new Template;
        echo $template->render('template.htm');
	}


	function renderUsers($f3) {
		$f3->set('content','users.htm');
        $template=new Template;
        echo $template->render('template.htm');
	}


	function renderPush($f3) {
		$preferences = new Preferences($this->db);
		$f3->set('content','push.htm');
        $template=new Template;
        echo $template->render('template.htm');
	}


	function renderNews($f3) {
		$f3->set('content','news.htm');
        $template=new Template;
        echo $template->render('template.htm');
	}
	
}