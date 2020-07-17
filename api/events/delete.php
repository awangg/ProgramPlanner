<?php
  include_once '../config/database.php';
  include_once '../auth/check.php';
  include_once './utils.php';

  $event_id = "";

  $request_body = json_decode(file_get_contents('php://input'));
  $event_id = $request_body->id;

  if(!check_element_exists($db_link, "events", "id = '$event_id'")) {
    echo json_encode(array(
      "error" => "Event not found"
    ));
    exit();
  }

  $delete_query = "DELETE FROM events WHERE id = '$event_id'";
  $delete_attendance = "DELETE FROM attendance WHERE event_id = '$event_id'";
  if(mysqli_query($db_link, $delete_query) && mysqli_query($db_link, $delete_attendance)) {
    http_response_code(200);
    echo json_encode(array(
      "id" => $event_id
    ));
  }else {
    echo json_encode(array(
      "error" => "Could not DELETE from database"
    ));
  }

?>