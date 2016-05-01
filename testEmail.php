<?php

# Include the Autoloader (see "Libraries" for install instructions)
require 'vendor/autoload.php';
use Mailgun\Mailgun;

# Instantiate the client.
$mgClient = new Mailgun('key-5a068089b7efeac263a876c54552f37d');
$domain = "sandbox15470f65a0e04686a586f890357b418a.mailgun.org";

$client = new \Http\Adapter\Guzzle6\Client(); 
$mailgun = new \Mailgun\Mailgun('key-5a068089b7efeac263a876c54552f37d', $client);

# Make the call to the client.
$result = $mailgun->sendMessage($domain, array(
    'from'    => 'Excited User <anchoo2kewl@gmail.com>',
    'to'      => 'Baz <anchoo2kewl@gmail.com>',
    'subject' => 'Hello',
    'text'    => 'Testing some Mailgun awesomness!'
));
