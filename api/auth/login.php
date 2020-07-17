<?php
  include_once '../config/database.php';
  include_once '../config/constants.php';
  require "../../vendor/autoload.php";
  use \Firebase\JWT\JWT;

  header("Access-Control-Allow-Origin: *");
  header("Content-Type: application/json; charset=UTF-8");
  header("Access-Control-Allow-Methods: POST");
  header("Access-Control-Max-Age: 3600");
  header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

  $username = $password = "";

  $request_body = json_decode(file_get_contents("php://input"));
  $username = $request_body->username;
  $password = $request_body->password;

  $select_query = "SELECT id, password FROM users WHERE username = '$username'";
  $user = mysqli_query($db_link, $select_query);

  if($row = mysqli_fetch_assoc($user)) {
    $id = $row['id'];
    $stored_password = $row['password'];
    if(password_verify($password, $stored_password)) {
      $jwt_start = time();
      $jwt_expire = $jwt_start + JWT_DURATION;
      $token = array(
        "iss" => "programplanner",
        "nbf" => $jwt_start,
        "exp" => $jwt_expire,
        "data" => array(
          "id" => $id,
          "username" => $username,
          "password" => $password
        )
      );

      $jwt = JWT::encode($token, JWT_SECRET_KEY);
      
      http_response_code(200);
      echo json_encode(array(
        "token" => $jwt,
        "username" => $username,
        "expireAt" => $jwt_expire
      ));
    }else {
      http_response_code(401);
      echo json_encode(array(
        "error" => "Incorrect password"
      ));
    }
  }

?>