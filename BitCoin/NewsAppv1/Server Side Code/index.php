<?php

$f3 = require('lib/base.php');

$f3->config('config.ini');
$f3->config('routes.ini');

$f3->set('cut',
     function($str, $len){
		if (strlen($str) > $len) {
		 	echo substr($str, 0, $len)."..";
		} else {
		 	echo $str;
		}
	 }
	);

//new Session();
session_save_path('./tmp');
session_start();

$f3->run();