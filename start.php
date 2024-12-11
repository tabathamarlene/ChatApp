<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Skript der bei nicht bekannten Klassen
// automatisch versucht die Klasse nach den angegebenen
// regeln zu laden
spl_autoload_register(function($class) {
    include str_replace('\\', '/', $class) . '.php';
});

session_start();



define('CHAT_SERVER_URL', 'https://online-lectures-cs.thi.de/chat/');
define('CHAT_SERVER_ID', "ba1ad2f8-7e88-4ce4-92c2-6399ab16f647"); # Ihre Collection ID


$service = new Utils\BackendService(CHAT_SERVER_URL, CHAT_SERVER_ID);
?>