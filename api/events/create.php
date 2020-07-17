<?php
  include_once '../config/database.php';
  include_once '../auth/check.php';

  $event_date = $event_title = $event_description = "";

  $request_body = json_decode(file_get_contents('php://input'));
  $event_date = $request_body->date;
  $event_title = $request_body->title;
  $event_description = $request_body->description;

  $insert_query = "INSERT INTO events (date, title, description) VALUES ('$event_date', '$event_title', '$event_description')";
  if(mysqli_query($db_link, $insert_query)) {
    http_response_code(201);
    echo json_encode(array(
      "date" => $event_date,
      "title" => $event_title,
      "description" => $event_description
    ));
  }else {
    http_response_code(500);
    echo json_encode(array(
      "error" => "Failed to INSERT into database"
    ));
  }
?>