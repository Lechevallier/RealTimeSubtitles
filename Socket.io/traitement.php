<?php
// On démarre la session AVANT d'écrire du code HTML
session_start();

// On s'amuse à créer quelques variables de session dans $_SESSION
$_SESSION['prenom'] = htmlspecialchars($_POST['prenom']);
$_SESSION['nom'] = htmlspecialchars($_POST['nom']);

?>

<!DOCTYPE html>
<meta charset="utf-8">
<html>
<head>
	<title>Traitement</title>
</head>
<body>

</body>
</html>