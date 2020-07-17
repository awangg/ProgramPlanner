<?php
  include_once '../config/database.php';
  include_once './utils.php';

  $user_id = $event_id = "";

  $request_body = json_decode(file_get_contents('php://input'));
  $user_id = $request_body->user;
  $event_id = $request_body->event;

  if(!check_element_exists($db_link, "events", "id = '$event_id'")) {
    echo json_encode(array(
      "error" => "Event not found"
    ));
    exit();
  }

  if(!check_element_exists($db_link, "users", "id = '$user_id'")) {
    echo json_encode(array(
      "error" => "User not found"
    ));
    exit();
  }

  if(!check_element_exists($db_link, "attendance", "user_id = '$user_id' AND event_id = '$event_id'")) {
    echo json_encode(array(
      "error" => "Attendance record not found"
    ));
    exit();
  }

  $delete_query = "DELETE FROM attendance WHERE user_id = '$user_id' AND event_id = '$event_id'";
  if(mysqli_query($db_link, $delete_query)) {
    http_response_code(201);
    echo json_encode(array(
      "user" => $user_id,
      "event" => $event_id
    ));
  }else {
    echo json_encode(array(
      "error" => "Could not DELETE from database"
    ));
    exit();
  }
?>