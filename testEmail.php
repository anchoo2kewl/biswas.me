<?php


	require 'vendor/autoload.php';
	use Mailgun\Mailgun;

	echo "works";

	# First, instantiate the SDK with your API credentials and define your domain. 
	$mg = new Mailgun("key-55a183786ca6703fffccfe9ffe1ab261");
	$domain = "sandbox15470f65a0e04686a586f890357b418a.mailgun.org";
	$sender = 'postmaster@sandbox15470f65a0e04686a586f890357b418a.mailgun.org';
	$email = 'anchoo2kewl@gmail.com';

	$mg->sendMessage($domain, array('from'    => $sender, 
                                'to'      => $email, 
                                'subject' => 'Thank you for reaching out', 
                                'text'    => 'Your mail does not support HTML'));