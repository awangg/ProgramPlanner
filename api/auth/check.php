<?php
  include_once '../config/constants.php';
  require '../../vendor/autoload.php';
  use \Firebase\JWT\JWT;

  header("Content-Type: application/json; charset=UTF-8");
  header("Access-Control-Max-Age: 3600");
  header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

  $request_headers = apache_request_headers();
  $auth_header = "";
  if(isset($request_headers['Authorization'])) {
    $auth_header = $request_headers['Authorization'];
  } else {
      echo json_encode(array(
        "error" => "No token found"
      ));
      exit();
  }
  $jwt = explode(' ', $auth_header)[1];
  $authenticated = false;

  if($jwt) {
    try {
      $decoded = JWT::decode($jwt, JWT_SECRET_KEY, array('HS256'));
      $authenticated = true;
    } catch (Exception $e) {
      echo json_encode(array(
        "error" => "Invalid token"
      ));
      exit();
    }
  }
?>