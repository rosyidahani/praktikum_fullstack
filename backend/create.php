<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset-UTF-8");
header("Access-Control-Allow-Methods: POST");

require_once 'db.php';

$input = json_decode(file_get_contents('php://input'), true);

if (!$input || !isset($input['nama']) || !isset($input['nim'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Data tidak lengkap"]);
    exit;
}

$nama = trim($input['nama']);
$nim = trim($input['nim']);

if ($nama === "" || $nim === "") {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Nama & NIM wajib diisi"]);
    exit;
}

$query = "INSERT INTO mahasiswa (nama, nim) VALUES (?, ?)";
$stmt = mysqli_prepare($koneksi, $query);

if ($stmt) {
    mysqli_stmt_bind_param($stmt, "ss", $nama, $nim);
    if (mysqli_stmt_execute($stmt)) {
        echo json_encode(["success" => true, "message" => "Data disimpan"]);
    } else {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Gagal simpan: " . mysqli_stmt_error($stmt)]);
    }
    mysqli_stmt_close($stmt);
} else {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Query Error: " . mysqli_error($koneksi)]);
}

mysqli_close($koneksi);
?>