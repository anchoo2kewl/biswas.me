<?php

	require 'vendor/autoload.php';
	use Mailgun\Mailgun;

	# First, instantiate the SDK with your API credentials and define your domain. 

	$mg = Mailgun::create('key-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');
	$domain = "biswas.me";    	
	$sender = 'postmaster@biswas.me';
    	$receiver = 'anshuman@biswas.me';

	$google_recaptcha_v3_secret = 'reCAPTCHA_secret_key'

	$mysqli = @new mysqli('127.0.0.1', 'root_user', 'password', 'db');

	// Works as of PHP 5.2.9 and 5.3.0.
	if ($mysqli->connect_error) {
    	die('Connect Error, '. $mysqli->connect_errno . ': ' . $mysqli->connect_error);
	}

?>
