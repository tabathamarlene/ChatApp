<?php
require("start.php");

// Überprüfen, ob der Nutzer angemeldet ist
if (!isset($_SESSION['user'])) {
    header("Location: login.php");
    exit();
}

// Chat-Partner überprüfen
if (!isset($_GET['friend']) || empty($_GET['friend'])) {
    die("No chat partner specified.");
}

$chatPartner = htmlspecialchars($_GET['friend']);
$messages = [];

try {
    // Nachrichten laden
    $messages = $service->loadMessages($chatPartner);
} catch (Exception $e) {
    die("Error loading messages: " . $e->getMessage());
}

// Nachricht senden
if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST['message'])) {
    $messageContent = trim($_POST['message']);
    if (!empty($messageContent)) {
        $service->sendMessage((object)[
            "msg" => $messageContent,
            "to" => $chatPartner
        ]);
        // Seite neu laden, um die gesendete Nachricht anzuzeigen
        header("Location: chat.php?friend=" . urlencode($chatPartner));
        exit();
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chat with <?= $chatPartner ?></title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="content">
        <h1 class="center">Chat with <?= htmlspecialchars($chatPartner) ?></h1>
        <a href="friends.php">&lt; Back to Friends</a>
        <hr>
        <!-- Nachrichten anzeigen -->
        <ul class="message-list">
            <?php if (!empty($messages)): ?>
                <?php foreach ($messages as $message): ?>
                    <li>
                        <strong><?= htmlspecialchars($message->from) ?>:</strong>
                        <?= htmlspecialchars($message->msg) ?>
                    </li>
                <?php endforeach; ?>
            <?php else: ?>
                <p>No messages yet.</p>
            <?php endif; ?>
        </ul>
        <hr>
        <!-- Nachricht senden -->
        <form method="POST" action="">
            <textarea name="message" placeholder="Type your message here..." required></textarea>
            <button type="submit" class="bluebutton">Send</button>
        </form>
    </div>
</body>
</html>