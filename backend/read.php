<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset-UTF-8");

require_once 'db.php';

$query = "SELECT id, nama, nim, created_at FROM mahasiswa ORDER BY id DESC";
$result = mysqli_query($koneksi, $query);

if (!$result) {
    http_response_code(500);
    echo json_encode([
        "success" => false, 
        "message" => "Query Error: " . mysqli_error($koneksi)
    ]);
    exit;
}

$data = [];
while ($row = mysqli_fetch_assoc($result)) {
    $data[] = $row;
}

echo json_encode([
    "success" => true, 
    "data" => $data
]);

mysqli_free_result($result);
mysqli_close($koneksi);
?>