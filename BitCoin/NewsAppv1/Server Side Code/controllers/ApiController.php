<?php
class ApiController extends Controller
{

    function beforeroute()
    {
    }



    //PREFERENCE API-----------------------------------------------------------------------

    function apiSetPreference($f3)
    {

        $this->auth(User::ADMIN);
        if ($f3->get('DEMO')) {
            echo 'Changing of Preferences is not Available in demo mode';
            exit;
        }

        $name = $f3->get('PARAMS.name');
        $value = $f3->get('POST.value');
        //add or edit to db
        $preferences = new Preferences($this->db);
        $preferences->setValue($name, $value);
        $f3->reroute($_SERVER['HTTP_REFERER']);
    }


    function apiGetPreference($f3)
    {
        $name = $f3->get('PARAMS.name');

        $preferences = new Preferences($this->db);
        $pref = $preferences->getValue($name, "");
        echo $pref;
    }

  
    //PUSH NOTIFICATION API-----------------------------------------------------------------


    function apiSendPushNotification($f3)
    {

        $this->auth(User::AUTHOR);

        if ($f3->get('DEMO')) {
            echo ' Push Notifications Not Available in Demo Mode';
            exit;
        }

        $title = $f3->get('POST.title');
        $body = $f3->get('POST.body');

        $resultObj = $this->sendPushNotification($f3, $title, $body);

        if (isset($resultObj->message_id)) {
            $this->f3->reroute('/push?result=success');
        } else {
            echo $result;
        }
    }

    function sendPushNotification($f3, $title, $body, $topic='news')
    {

        $this->auth(User::AUTHOR);

        if ($f3->get('DEMO')) {
            echo ' Push Notifications Not Available in Demo Mode';
            exit;
        }

        // API access key from Google API's Console
        $API_ACCESS_KEY =  $f3->get('API_ACCESS_KEY');

        // prep the bundle
        $msg = array
        (
            'body'  => $body,
            'title'  => $title,
            'vibrate' => true,
            'sound'    => 'default'
        );
        $fields = array
        (
            'to'    =>  "/topics/".$topic,
            'notification'          => $msg
        );
         
        $headers = array
        (
            'Authorization: key=' . $API_ACCESS_KEY,
            'Content-Type: application/json'
        );
         
        $ch = curl_init();
        curl_setopt( $ch, CURLOPT_URL, 'https://android.googleapis.com/gcm/send' );
        curl_setopt( $ch, CURLOPT_POST, true );
        curl_setopt( $ch, CURLOPT_HTTPHEADER, $headers );
        curl_setopt( $ch, CURLOPT_RETURNTRANSFER, true );
        curl_setopt( $ch, CURLOPT_SSL_VERIFYPEER, false );
        curl_setopt( $ch, CURLOPT_POSTFIELDS, json_encode( $fields ) );
        $result = curl_exec($ch );
        curl_close( $ch );

        return json_decode($result);
    }
}
