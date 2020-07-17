<?php
  include_once '../config/database.php';
  include_once './utils.php';

  $event_id = "";

  $request_body = json_decode(file_get_contents('php://input'));
  $event_id = $request_body->event;

  if(!check_element_exists($db_link, "events", "id = '$event_id'")) {
    echo json_encode(array(
      "error" => "Event not found"
    ));
    exit();
  }

  $select_query = "SELECT * FROM events WHERE id = '$event_id'";
  $result = mysqli_query($db_link, $select_query);
  if($row = mysqli_fetch_assoc($result)) {
    http_response_code(200);
    echo json_encode(array(
      "id" => $row['id'],
      "title" => $row['title'],
      "description" => $row['description'],
      "date" => $row['date'],
    ));
  }
?>