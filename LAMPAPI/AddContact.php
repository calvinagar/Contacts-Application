<?php

	include 'Connect.php';

	$inData = getRequestInfo();

	$FirstName = $inData["FirstName"];
	$LastName = $inData["LastName"];
	$Email = $inData["Email"];
	$PhoneNumber = $inData["PhoneNumber"];
	$UserID = $inData["UserID"];

	$conn = connection();
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$stmt = $conn->prepare("INSERT INTO Contacts (FirstName, LastName, PhoneNumber, Email, UserID) VALUES (?,?,?,?,?)");
		$stmt->bind_param("sssss", $FirstName, $LastName, $PhoneNumber, $Email, $UserID);
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