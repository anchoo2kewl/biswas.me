<?php 


include '../config.php';

$html  = file_get_contents('email.html'); // this will retrieve the html document

// Check if this is a request from the React app
$is_react_request = false;

// Get the origin header from the request
$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';

// Define allowed origins
$react_origins = array("http://localhost:3002", "http://localhost:3001");

// Set CORS headers for React app if the origin is in our allowed list
if (in_array($origin, $react_origins)) {
    $is_react_request = true;
    header("Access-Control-Allow-Origin: $origin");
    header("Access-Control-Allow-Methods: POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type");
    header("Access-Control-Allow-Credentials: true");
}

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    if ($is_react_request) {
        http_response_code(405);
        echo json_encode(["status" => "error", "error_message" => "Method not allowed"]);
    } else {
        header("Location: /errorsubmit.html");
    }
    exit();
}

//values to be inserted in database table
$name = '"'.$mysqli->real_escape_string($_POST['name']).'"';
$email = '"'.$mysqli->real_escape_string($_POST['email']).'"';
$message = '"'.$mysqli->real_escape_string($_POST['message']).'"';
$date = '"'.date ("Y-m-d H:i:s").'"';

//IP Address handling
if (!empty($_SERVER['HTTP_CLIENT_IP'])){
  $ip=$_SERVER['HTTP_CLIENT_IP'];
} elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])){
  $ip=$_SERVER['HTTP_X_FORWARDED_FOR'];
} else{
  $ip=$_SERVER['REMOTE_ADDR'];
}
$ip = ip2long($ip);

// Google reCAPTCHA verification
$recaptcha_url = "https://www.google.com/recaptcha/api/siteverify";
$recaptcha_response = $_POST['g-recaptcha-response'];
$recaptcha = file_get_contents($recaptcha_url . '?secret=' . $google_recaptcha_v3_secret . '&response=' . $recaptcha_response);
$result_json = json_decode($recaptcha, true); 

if ($result_json['success'] == 1 AND $result_json['score'] >= 0.5 AND $result_json['action'] == "submit") {	
	//MySqli Insert Query
	$insert_row = $mysqli->query("INSERT INTO email (name, email, message, date, ip) VALUES ($name, $email, $message, $date, $ip)");

	if($insert_row){
		// Handle email sending
		try {
			$mg->messages()->send($domain, array(
				'from'    => $sender, 
				'to'      => $_POST['email'], 
				'subject' => 'Thank you for reaching out', 
				'text'    => 'Thank you for taking the time to contact me. I will respond to you as soon as I can.',
				'html'    => $html
			));

			$mg->messages()->send($domain, array(
				'from'    => $sender, 
				'to'      => $receiver, 
				'subject' => 'A message from Biswas.me', 
				'text'    => 'From: '.$_POST['name'].", ".$_POST['email']." ,".$_POST['message'],
				'html'    => 'From: '.$_POST['name']."<br />Message: ".$_POST['message']."<br />Email: ".$_POST['email']
			));

			// Successful operation
			if ($is_react_request) {
				// For React app, just return JSON
				header('Content-Type: application/json');
				echo json_encode(array('status' => 'success', 'message' => 'Form submitted successfully!'));
			} else {
				// For regular form submission, redirect
				header("Location: /thankyou.html");
			}
		} catch (Exception $e) {
			// Email sending error
			if ($is_react_request) {
				header('Content-Type: application/json');
				echo json_encode(array('status' => 'error', 'error_message' => 'Email sending failed: ' . $e->getMessage()));
			} else {
				header("Location: /errorsubmit.html");
			}
		}
	} else {
		// Database error
		if ($is_react_request) {
			header('Content-Type: application/json');
			echo json_encode(array('status' => 'error', 'error_message' => 'Database error: ' . $mysqli->error));
		} else {
			header("Location: /errorsubmit.html");
		}
	}
} else {
	// reCAPTCHA verification failed
	if ($is_react_request) {
		header('Content-Type: application/json');
		echo json_encode(array('status' => 'error', 'error_message' => 'Google reCAPTCHA verification failed. Please try again.'));
	} else {
		header("Location: /errorsubmit.html");
	}
}

// Make sure script ends here
exit();
