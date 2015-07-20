<?php

	require 'vendor/autoload.php';
	use Mailgun\Mailgun;

	# First, instantiate the SDK with your API credentials and define your domain. 
	$mg = new Mailgun("key-55a183786ca6703fffccfe9ffe1ab261");
	$domain = "biswas.me";
        $sender = 'postmaster@biswas.me';

	$mysqli = @new mysqli('127.0.0.1', 'biswas', 'qweasd', 'biswas');

	// Works as of PHP 5.2.9 and 5.3.0.
	if ($mysqli->connect_error) {
    	die('Connect Error, '. $mysqli->connect_errno . ': ' . $mysqli->connect_error);
	}

?>
