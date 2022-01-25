<?php

	include 'Connect.php';

	$inData = getRequestInfo();

	$firstName = $inData["FirstName"];
	$lastName = $inData["LastName"];
	$email = $inData["Email"];
	$phoneNum = $inData["PhoneNumber"];
	$userId = $inData["UserID"];

	$conn = connection();
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$stmt = $conn->prepare("INSERT into Contacts (FirstName, LastName, PhoneNumber, Email, UserID) VALUES(?,?,?,?,?)");
		$stmt->bind_param("sssss", $firstName, $lastName, $phoneNum, $email, $userId);
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