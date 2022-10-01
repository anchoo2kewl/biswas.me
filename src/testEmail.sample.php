<?php

# Include the Autoloader (see "Libraries" for install instructions)
require 'vendor/autoload.php';
use Mailgun\Mailgun;

# Instantiate the client.
$mg = Mailgun::create('key-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXx');
$domain = "biswas.me";

# Make the call to the client.
$result = $mg->messages()->send($domain, array(
    'from'    => 'abc@biswas.me',
    'to'      => 'Baz <abc@gmail.com>',
    'subject' => 'Hello',
    'text'    => 'Testing some Mailgun awesomness!'
));
