<?php

# Include the Autoloader (see "Libraries" for install instructions)
require 'vendor/autoload.php';
use Mailgun\Mailgun;

# Instantiate the client.
$mg = Mailgun::create('key-9947f2280396b13914a79559ceae4a7f');
$domain = "biswas.me";

# Make the call to the client.
$result = $mg->messages()->send($domain, array(
    'from'    => 'postmaster@biswas.me',
    'to'      => 'Baz <anchoo2kewl@gmail.com>',
    'subject' => 'Hello',
    'text'    => 'Testing some Mailgun awesomness!'
));
