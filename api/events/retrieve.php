<?php
  include_once '../config/database.php';
  include_once '../auth/check.php';

  header("Access-Control-Allow-Methods: GET");

  $events = array();

  $select_query = "SELECT * FROM events";
  $result = mysqli_query($db_link, $select_query);

  while($row = mysqli_fetch_assoc($result)) {
    $event_id = $row['id'];
    $attendance_query = "SELECT * FROM attendance WHERE event_id = '$event_id'";
    $count = mysqli_num_rows(mysqli_query($db_link, $attendance_query));

    $event = array(
      "id" => $event_id,
      "date" => $row['date'],
      "title" => $row['title'],
      "description" => $row['description'],
      "attendance" => $count
    );
    array_push($events, $event);
  }

  http_response_code(200);
  echo json_encode($events);
?>