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

//MySqli Insert Query
$insert_row = $mysqli->query("INSERT INTO messages (name, email, message, date, ip) VALUES($name, $email, $message, $date, $ip)");

if($insert_row){
	$result_json = array('status' => 'success', 'domain' => $domain);
	# Now, compose and send your message.
	$mailgun->sendMessage($domain, array('from'=> $sender, 
                                'to'      => $_POST['email'], 
                                'subject' => 'Thank you for reaching out', 
                                'text'    => 'Thank you for taking the time to contact me. I will respond to you as soon as I can.',
                                'html'    => $html));

  $mailgun->sendMessage($domain, array('from'=> $sender, 
                                'to'      => $receiver, 
                                'subject' => 'A message from Biswas.me', 
                                'text'    => 'From: '.$_POST['name'].", ".$_POST['email']." ,".$_POST['message'],
                                'html'    => 'From: '.$_POST['name']."<br />Message: ".$_POST['message']."<br />Email: ".$_POST['email']));

}else{
    $result_json = array('status' => 'error', 'error_code' => $mysqli->errno, 'error_message' => $mysqli->error);
}
echo json_encode($result_json);

