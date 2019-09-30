<?php
$headers = "MIME-Version: 1.0" . "\r\n";
$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";

$to      = 'contacto@justiciaparatodos.foundation';
$subject = 'Formulario WEB: Contacto';
$message = '<b>Este es el siguiente mensaje recibido desde la página web desde el formulario <i>Contacto</i></b><br>';
$message .= '<br><b>Nombre: </b>' . $_GET["name"];
$message .= '<br><b># telefónico / celular: </b>' . $_GET["tel"];
$message .= '<br><b>Correo: </b>' . $_GET["mail"];
$message .= '<br><b>Mensaje: </b>' . $_GET["message"];

$headers .= 'From: contacto@justiciaparatodos.foundation' . "\r\n" .
    'Reply-To: contacto@justiciaparatodos.foundation' . "\r\n" .
    'X-Mailer: PHP/' . phpversion();

if(mail($to, $subject, $message, $headers))echo "<h1>Mensaje enviado correctamente<br>Siendo redirigido...</h1>";
header("Location: http://justiciaparatodos.foundation");
die();

?> 