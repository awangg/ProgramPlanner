<?php
  function check_element_exists($dblink, $dbname, $dbcondition) {
    $select_query = "SELECT * FROM $dbname WHERE $dbcondition";
    $result = mysqli_fetch_assoc(mysqli_query($dblink, $select_query));
    if(!isset($result)) {
      return false;
    }
    return true;
  }
?>