<?php
  include_once '../config/database.php';
  include_once './utils.php';

  $user_id = "";
  $registered = array();

  $request_body = json_decode(file_get_contents('php://input'));
  $user_id = $request_body->user;

  if(!check_element_exists($db_link, "users", "id = '$user_id'")) {
    echo json_encode(array(
      "error" => "User not found"
    ));
    exit();
  }

  $select_query = "SELECT event_id FROM attendance WHERE user_id = '$user_id'";
  $result = mysqli_query($db_link, $select_query);
  while($row = mysqli_fetch_assoc($result)) {
    array_push($registered, $row['event_id']);
  }

  http_response_code(200);
  echo json_encode($registered);
?>