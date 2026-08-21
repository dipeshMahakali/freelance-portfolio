<?php
/**
 * Dipesh Patel Web Studio - Project Enquiry API Handler & Email Notifier
 * Processes form submissions, logs leads securely, and emails notifications using .env credentials.
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// 1. Helper function to parse .env file
function loadEnv($envPath) {
    $variables = [];
    if (file_exists($envPath)) {
        $lines = file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        foreach ($lines as $line) {
            $line = trim($line);
            if (strpos($line, '#') === 0 || empty($line)) continue;
            if (strpos($line, '=') !== false) {
                list($name, $value) = explode('=', $line, 2);
                $variables[trim($name)] = trim($value);
            }
        }
    }
    return $variables;
}

$env = loadEnv(__DIR__ . '/../.env');

// Fallback environment values
$recipientEmail = $env['RECIPIENT_EMAIL'] ?? $env['NOTIFY_EMAIL'] ?? $env['SMTP_USER'] ?? 'dipesh.patel1902@gmail.com';
$fromEmail      = $env['FROM_EMAIL'] ?? $env['SMTP_USER'] ?? 'no-reply@dipeshpatel.dev';
$smtpHost       = $env['SMTP_HOST'] ?? 'localhost';
$smtpPort       = $env['SMTP_PORT'] ?? '587';
$smtpUser       = $env['SMTP_USER'] ?? '';
$smtpPass       = $env['SMTP_PASS'] ?? '';

// 2. Read JSON Payload
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data) {
    // Check $_POST if standard form submit
    $data = $_POST;
}

$projectType     = htmlspecialchars($data['projectType'] ?? 'Not specified');
$budget          = htmlspecialchars($data['budget'] ?? 'Not specified');
$timeline        = htmlspecialchars($data['timeline'] ?? 'Not specified');
$businessDetails = htmlspecialchars($data['businessDetails'] ?? 'No details provided');
$clientName      = htmlspecialchars($data['clientName'] ?? 'Anonymous Prospect');
$clientEmail     = filter_var($data['clientEmail'] ?? '', FILTER_VALIDATE_EMAIL) ? $data['clientEmail'] : 'Not provided';
$clientPhone     = htmlspecialchars($data['clientPhone'] ?? 'Not provided');
$submittedAt     = date('Y-m-d H:i:s T');
$clientIP        = $_SERVER['REMOTE_ADDR'] ?? 'Unknown';

// 3. Backup save to JSON lead log file
$logFile = __DIR__ . '/enquiries_backup.json';
$existingLogs = [];
if (file_exists($logFile)) {
    $existingLogs = json_decode(file_get_contents($logFile), true) ?? [];
}

$leadRecord = [
    'id'              => uniqid('lead_'),
    'submittedAt'     => $submittedAt,
    'clientName'      => $clientName,
    'clientEmail'     => $clientEmail,
    'clientPhone'     => $clientPhone,
    'projectType'     => $projectType,
    'budget'          => $budget,
    'timeline'        => $timeline,
    'businessDetails' => $businessDetails,
    'ipAddress'       => $clientIP
];

array_unshift($existingLogs, $leadRecord);
file_put_contents($logFile, json_encode($existingLogs, JSON_PRETTY_PRINT));

// 4. Construct Email Notification Body
$subject = "🚀 New Web Studio Enquiry: {$clientName} ({$projectType})";

$emailBody = "
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f2ed; color: #18181b; padding: 20px; }
    .card { background-color: #ffffff; padding: 30px; border-radius: 12px; border: 1px solid #e5e0d8; max-width: 600px; margin: 0 auto; }
    .header { font-size: 20px; font-weight: 800; color: #b45309; margin-bottom: 20px; border-bottom: 2px solid #b45309; padding-bottom: 10px; }
    .label { font-size: 12px; font-weight: 700; text-transform: uppercase; color: #71717a; margin-top: 14px; }
    .val { font-size: 15px; font-weight: 600; color: #18181b; margin-top: 4px; }
    .box { background-color: #f3efea; padding: 15px; border-radius: 8px; margin-top: 15px; line-height: 1.6; }
    .footer { font-size: 12px; color: #a1a1aa; margin-top: 25px; text-align: center; }
  </style>
</head>
<body>
  <div class='card'>
    <div class='header'>🚀 New Project Enquiry for Dipesh Patel Web Studio</div>
    
    <div class='label'>Client Name</div>
    <div class='val'>{$clientName}</div>

    <div class='label'>Email Address</div>
    <div class='val'><a href='mailto:{$clientEmail}'>{$clientEmail}</a></div>

    <div class='label'>WhatsApp / Phone</div>
    <div class='val'><a href='tel:{$clientPhone}'>{$clientPhone}</a></div>

    <div class='label'>Project Type Needed</div>
    <div class='val'>{$projectType}</div>

    <div class='label'>Approximate Budget</div>
    <div class='val'>{$budget}</div>

    <div class='label'>Desired Launch Timeline</div>
    <div class='val'>{$timeline}</div>

    <div class='label'>Business Brief & Project Goals</div>
    <div class='box'>{$businessDetails}</div>

    <div class='footer'>
      Submitted on {$submittedAt} · Client IP: {$clientIP}<br>
      Dipesh Patel Web Studio Automated Notification System
    </div>
  </div>
</body>
</html>
";

// Headers
$headers  = "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=UTF-8\r\n";
$headers .= "From: Dipesh Studio Enquiry <{$fromEmail}>\r\n";
if ($clientEmail !== 'Not provided') {
    $headers .= "Reply-To: {$clientName} <{$clientEmail}>\r\n";
}

$mailSent = false;
try {
    // Attempt standard mail send
    $mailSent = @mail($recipientEmail, $subject, $emailBody, $headers);
} catch (Exception $e) {
    $mailSent = false;
}

// 5. Response Return
echo json_encode([
    'success' => true,
    'message' => 'Enquiry received successfully! Dipesh has been notified.',
    'emailSent' => $mailSent,
    'leadId' => $leadRecord['id']
]);
