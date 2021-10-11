<?php

	require 'vendor/autoload.php';
	use Mailgun\Mailgun;

	# First, instantiate the SDK with your API credentials and define your domain. 

	$mg = Mailgun::create('key-c0638fcbc332e62691b4e0ace75e81a8');
	$domain = "biswas.me";    	
	$sender = 'postmaster@biswas.me';
    	$receiver = 'anshuman@biswas.me';

	$mysqli = @new mysqli('127.0.0.1', 'root', 'wallaroot', 'biswas');

	// Works as of PHP 5.2.9 and 5.3.0.
	if ($mysqli->connect_error) {
    	die('Connect Error, '. $mysqli->connect_errno . ': ' . $mysqli->connect_error);
	}

?>
