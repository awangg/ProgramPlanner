<?php
  include_once '../config/database.php';

  header("Content-Type: application/json; charset=UTF-8");
  header("Access-Control-Allow-Methods: POST");
  header("Access-Control-Max-Age: 3600");
  header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

  $username = $password = $confirm_password = "";

  $request_body = json_decode(file_get_contents("php://input"));
  $username = $request_body->username;
  $password = $request_body->password;

  $unique_query = "SELECT * FROM users WHERE username = '$username'";
  $users = mysqli_query($db_link, $unique_query);

  // If there already exist users with the requested username
  if(mysqli_fetch_assoc($users)) {
    echo json_encode(array(
      "error" => "Username already exists"
    ));
  // Otherwise try inserting a new user into the database
  } else {
    $hashword = password_hash($password, PASSWORD_DEFAULT);
    $insert_query = "INSERT INTO users (username, password) VALUES ('$username', '$hashword')";

    if(mysqli_query($db_link, $insert_query)) {
      http_response_code(201);
      echo json_encode(array(
        "username" => $username,
        "password" => $password
      ));
    // Unexpected DB error
    }else {
      echo json_encode(array(
        "error" => "Failed to INSERT into database"
      ));
    }
  }
?>