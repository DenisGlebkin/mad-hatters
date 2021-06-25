<?php
$name 	 = $_POST["name"];
$contact = $_POST["email"];
$userMessage 	 = $_POST["message"];
$to	     = "dglebkin@gmail.com";
$subject = "Сообщение с сайта: gleb.fun/Prime-One";

$message = "Сообщение с сайта: <a href=\"http://gleb.fun/Prime-One/\">http://gleb.fun/Prime-One/</a>" . "<br><table border=\"1\" cellpadding=\"10\" width=\"100%\" cellspacing=\"0\">
    <tbody>
      <tr>
        <th bgcolor=\"#ccc\" width=\"10%\" align=\"left\">Имя:</th>
        <td colspan=\"2\">" .$name . "</td>
      </tr>
      <tr>
        <th bgcolor=\"#ccc\" width=\"10%\" align=\"left\">Email для связи:</th>
        <td>" . $contact ."</td>
      </tr>
      <tr>
        <td colspan=\"2\">
          Сообщение: <br>" . $userMessage ."</td>
      </tr>
    </tbody>
  </table>";

$headers = "MIME-Version: 1.0" . "\r\n";
$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
$headers .= "From: dglebkin@gmail.com" . "\r\n";


mail($to, $subject, $message ,$headers);
?>{"message" : "sendOk"}