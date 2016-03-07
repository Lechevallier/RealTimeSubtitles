<?php
// On démarre la session AVANT d'écrire du code HTML
session_start();
// On s'amuse à créer quelques variables de session dans $_SESSION
$_SESSION['prenom'] = htmlspecialchars($_POST['prenom']);
$_SESSION['nom'] = htmlspecialchars($_POST['nom']);

?>

<?php

	if (isset $_SESSION['prenom'] && isset $_SESSION['nom']) {
	  header('localhost:3000/client.html');
	  exit();
	}
	else { ?>
	
		<!DOCTYPE html>
			<meta charset="utf-8">
			<html>
			<head>
				<title>Connexion</title>
				<!-- La feuille de styles "base.css" doit être appelée en premier. -->
				<link rel="stylesheet" type="text/css" href="Gabarits/styles/base.css" media="all" />
				<link rel="stylesheet" type="text/css" href="Gabarits/styles/modele05.css" media="screen" />

			</head>
			<body>

				<h1> Connexion </h1>
				
				<form method="post" action="connexion.php">
					<p>
						<label for="nom">Votre nom</label> : <input type="text" name="nom" id="nom" />
					</p>
					<p>
						<label for="prenom">Votre prénom</label> : <input type="text" name="prenom" id="prenom" />
					</p>
					<p>
						<input type="submit" value="Connexion" ></code>
					</p>
			</form>

			</body>
			</html>
	<?php			
				}
	?>
