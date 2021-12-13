<?php 


include '../config.php';

$html  = file_get_contents('email.html'); // this will retrieve the html document


//values to be inserted in database table
$name = '"'.$mysqli->real_escape_string($_POST['name']).'"';
$email = '"'.$mysqli->real_escape_string($_POST['email']).'"';
$message = '"'.$mysqli->real_escape_string($_POST['message']).'"';
$date = '"'.date ("Y-m-d H:i:s").'"';

//Test if it is a shared client
if (!empty($_SERVER['HTTP_CLIENT_IP'])){
  $ip=$_SERVER['HTTP_CLIENT_IP'];
//Is it a proxy address
}elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])){
  $ip=$_SERVER['HTTP_X_FORWARDED_FOR'];
}else{
  $ip=$_SERVER['REMOTE_ADDR'];
}
//The value of $ip at this point would look something like: "192.0.34.166"
$ip = ip2long($ip);

$recaptcha_url = "https://www.google.com/recaptcha/api/siteverify";
$recaptcha_response = $_POST['g-recaptcha-response'];

$recaptcha = file_get_contents($recaptcha_url . '?secret=' . $google_recaptcha_v3_secret . '&response=' . $recaptcha_response);

$result_json = json_decode($recaptcha, true); 

if ($result_json['success'] == 1 AND $result_json['score'] >= 0.5 AND $result_json['action'] == "submit") {	
	//MySqli Insert Query
	$insert_row = $mysqli->query("INSERT INTO email (name, email, message, date, ip) VALUES ($name, $email, $message, $date, $ip)");

	if($insert_row){
		$result_json = array('status' => 'success', 'domain' => $domain);
		# Now, compose and send your message.
	/*	$mg->messages()->send($domain, array('from'=> $sender, 
                                'to'      => $_POST['email'], 
                                'subject' => 'Thank you for reaching out', 
                                'text'    => 'Thank you for taking the time to contact me. I will respond to you as soon as I can.',
                                'html'    => $html));

  		$mg->messages()->send($domain, array('from'=> $sender, 
                                'to'      => $receiver, 
                                'subject' => 'A message from Biswas.me', 
                                'text'    => 'From: '.$_POST['name'].", ".$_POST['email']." ,".$_POST['message'],
                                'html'    => 'From: '.$_POST['name']."<br />Message: ".$_POST['message']."<br />Email: ".$_POST['email']));
	*/
	header("Location: /thankyou.html");
	die();
	} else {
    		$result_json = array('status' => 'error', 'error_code' => $mysqli->errno, 'error_message' => $mysqli->error);
	}
} else {
	$result_json = array('status' => 'error', 'error_code' => 429, 'error_message' => 'Google Recaptcha has determined that this response was made by a non-human. If you feel this is an error, and you are indeed a human, please submit the form again!');
}
echo json_encode($result_json);
header("Location: /errorsubmit.html");
die();
