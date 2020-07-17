<?php
  include_once '../config/database.php';
  include_once '../auth/check.php';
  include_once './utils.php';

  $event_id = $new_date = $new_title = $new_description = "";

  $request_body = json_decode(file_get_contents('php://input'));
  $event_id = $request_body->id;
  $new_date = $request_body->date;
  $new_title = $request_body->title;
  $new_description = $request_body->description;

  if(!check_element_exists($db_link, "events", "id = '$event_id'")) {
    echo json_encode(array(
      "error" => "Event not found"
    ));
    exit();
  }

  $update_query = "UPDATE events SET date = '$new_date', title = '$new_title', description = '$new_description' WHERE id = '$event_id'";
  if(mysqli_query($db_link, $update_query)) {
    http_response_code(200);
    echo json_encode(array(
      "id" => $event_id,
      "date" => $new_date,
      "title" => $new_title,
      "description" => $new_description
    ));
  } else {
    echo json_encode(array(
      "error" => "Could not UPDATE in database"
    ));
  }
?>