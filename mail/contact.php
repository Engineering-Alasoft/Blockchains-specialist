<?php
header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
  exit;
}

$name = trim($_POST['name'] ?? '');
$email = trim($_POST['email'] ?? '');
$m_subject = trim($_POST['subject'] ?? '');
$message = trim($_POST['message'] ?? '');

if ($name === '' || $m_subject === '' || $message === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
  http_response_code(400);
  echo json_encode(['ok' => false, 'error' => 'Missing or invalid fields']);
  exit;
}

$name = strip_tags($name);
$email = filter_var($email, FILTER_SANITIZE_EMAIL);
$m_subject = strip_tags($m_subject);
$message = strip_tags($message);

$to = 'support@blockchainsspecialist.com';
$from = 'support@blockchainsspecialist.com';
$subject = $m_subject . ': ' . $name;
$body = "You have received a new message from your website.\n\n"
  . "Name: $name\n"
  . "Email: $email\n"
  . "Subject: $m_subject\n\n"
  . "Message:\n$message\n";

$headers = "From: Blockchains Specialist <$from>\r\n";
$headers .= "Reply-To: $name <$email>\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

$sent = @mail($to, $subject, $body, $headers, "-f$from");

if (!$sent) {
  http_response_code(500);
  echo json_encode(['ok' => false, 'error' => 'Mail server rejected the message']);
  exit;
}

echo json_encode(['ok' => true]);
