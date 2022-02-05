<?php

	include 'Connect.php';

	$inData = getRequestInfo();

	$FirstName = $inData["FirstName"];
	$LastName = $inData["LastName"];
	$PhoneNumber = $inData["PhoneNumber"];
    $Email = $inData["Email"];
	$UserID = $inData["UserID"];
    $ID = $inData["ID"];

	$conn = connection();
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$stmt = $conn->prepare("UPDATE Contacts SET FirstName = ?, LastName = ?, PhoneNumber = ?, Email = ?, UserID = ? WHERE ID = ?");
		$stmt->bind_param("ssssss", $FirstName, $LastName, $PhoneNumber, $Email, $UserID, $ID);
		$stmt->execute();
		
		$stmt->close();
		$conn->close();
		returnWithError("");
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
?>