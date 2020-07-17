<?php
  include_once '../config/database.php';
  include_once './utils.php';

  $user_id = $event_id = "";

  $request_body = json_decode(file_get_contents('php://input'));
  $user_id = $request_body->user;
  $event_id = $request_body->event;

  if(!check_element_exists($db_link, "events", "id = '$event_id'")) {
    http_response_code(404);
    echo json_encode(array(
      "error" => "Event not found"
    ));
    exit();
  }

  if(!check_element_exists($db_link, "users", "id = '$user_id'")) {
    http_response_code(404);
    echo json_encode(array(
      "error" => "User not found"
    ));
    exit();
  }

  if(check_element_exists($db_link, "attendance", "user_id = '$user_id' AND event_id = '$event_id'")) {
    http_response_code(400);
    echo json_encode(array(
      "error" => "User already signed up for the specified event"
    ));
    exit();
  }

  $insert_query = "INSERT INTO attendance (user_id, event_id) VALUES ('$user_id', '$event_id')";
  if(mysqli_query($db_link, $insert_query)) {
    http_response_code(201);
    echo json_encode(array(
      "user" => $user_id,
      "event" => $event_id
    ));
  }else {
    http_response_code(500);
    echo json_encode(array(
      "error" => "Could not INSERT into database"
    ));
    exit();
  }
?>