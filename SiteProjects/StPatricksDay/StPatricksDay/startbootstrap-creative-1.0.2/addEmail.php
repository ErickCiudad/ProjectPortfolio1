<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>St Patrick's Raffle Entry</title>
    <link rel="stylesheet" type="text/css" href="style.css" />
</head>
<body>

<?php

$dbh = new PDO('mysql:host=localhost;dbname=st_patrick_raffle', 'root', 'root');



$first_name = $_POST['firstname'];
$last_name = $_POST['lastname'];
$email = $_POST['email'];
$symbol = $_POST['symbol'];

//if ($first_name or $last_name or $email === '')
if (empty($first_name) || empty($last_name) || empty($email) || empty($symbol))
{
    echo 'Please fill out all of the form';
    return;
}

else {
    $query = "INSERT INTO entry_list (first_name, last_name, email, symbol)  VALUES ('$first_name', '$last_name', '$email', '$symbol' )";
    $stmt = $dbh->prepare($query);
    $result = $stmt->execute(
        array(
            'first_name' => $first_name,
            'last_name' => $last_name,
            'email' => $email,
            'symbol' => $symbol


        )

    );

    echo 'Raffle entered.';
}
?>

</body>
</html>
