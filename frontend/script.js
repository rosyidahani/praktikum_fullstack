const API_URL = 'http://localhost/praktikum_fullstack/backend/';

document.addEventListener('DOMContentLoaded', () => {
    loadData();

    document.getElementById('formTambah').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const nama = document.getElementById('nama').value;
        const nim = document.getElementById('nim').value;

        try {
            const response = await fetch(`${API_URL}create.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nama: nama, nim: nim })
            });
            
            const result = await response.json();
            
            if (result.success) {
                showAlert('Berhasil!', result.message, 'success');
                document.getElementById('formTambah').reset();
                loadData();
            } else {
                showAlert('Gagal!', result.message, 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showAlert('Error!', 'Terjadi kesalahan koneksi', 'error');
        }
    });

    document.getElementById('formEdit').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const id = document.getElementById('editId').value;
        const nama = document.getElementById('editNama').value;
        const nim = document.getElementById('editNim').value;
        
        // Tutup modal dulu
        const modalEl = document.getElementById('modalEdit');
        const modalInstance = bootstrap.Modal.getInstance(modalEl);
        modalInstance.hide();

        try {
            const response = await fetch(`${API_URL}update.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: id, nama: nama, nim: nim })
            });
            
            const result = await response.json();
            
            if (result.success) {
                showAlert('Berhasil!', result.message, 'success');
                loadData();
            } else {
                showAlert('Gagal!', result.message, 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showAlert('Error!', 'Terjadi kesalahan koneksi', 'error');
        }
    });
});

async function loadData() {
    const tableBody = document.getElementById('tabelData');
    const loading = document.getElementById('loading');
    
    loading.classList.remove('d-none');
    tableBody.innerHTML = '';

    try {
        const response = await fetch(`${API_URL}read.php`);
        const result = await response.json();

        loading.classList.add('d-none');

        if (result.success) {
            if (result.data.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="4" class="text-center text-muted">Belum ada data mahasiswa</td></tr>';
                return;
            }

            let no = 1;
            let html = '';
            result.data.forEach(mhs => {
                html += `
                    <tr>
                        <td>${no++}</td>
                        <td class="fw-semibold text-white">${mhs.nama}</td>
                        <td><span class="badge bg-secondary">${mhs.nim}</span></td>
                        <td class="text-center">
                            <button class="btn btn-sm btn-outline-info me-1" onclick="openEditModal(${mhs.id}, '${mhs.nama}', '${mhs.nim}')">
                                <i class="fa-solid fa-pen-to-square"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-danger" onclick="deleteData(${mhs.id})">
                                <i class="fa-solid fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                `;
            });
            tableBody.innerHTML = html;
        } else {
            tableBody.innerHTML = `<tr><td colspan="4" class="text-center text-danger">${result.message}</td></tr>`;
        }
    } catch (error) {
        loading.classList.add('d-none');
        console.error(error);
        tableBody.innerHTML = `<tr><td colspan="4" class="text-center text-danger">Gagal memuat data (Cek Console)</td></tr>`;
    }
}

async function deleteData(id) {
    const result = await Swal.fire({
        title: 'Hapus Data?',
        text: "Data yang dihapus tidak bisa dikembalikan!",
        icon: 'warning',
        background: '#1e1e1e',
        color: '#fff',
        showCancelButton: true,
        confirmButtonColor: '#b71c1c',
        cancelButtonColor: '#555',
        confirmButtonText: 'Ya, Hapus!',
        cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
        try {
            const response = await fetch(`${API_URL}delete.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: id })
            });

            const resJson = await response.json();
            
            if (resJson.success) {
                showAlert('Terhapus!', resJson.message, 'success');
                loadData();
            } else {
                showAlert('Gagal!', resJson.message, 'error');
            }
        } catch (error) {
            showAlert('Error!', 'Terjadi kesalahan sistem', 'error');
        }
    }
}

function openEditModal(id, nama, nim) {
    document.getElementById('editId').value = id;
    document.getElementById('editNama').value = nama;
    document.getElementById('editNim').value = nim;
    
    const myModal = new bootstrap.Modal(document.getElementById('modalEdit'));
    myModal.show();
}

function showAlert(title, text, icon) {
    Swal.fire({
        title: title,
        text: text,
        icon: icon,
        background: '#1e1e1e',
        color: '#fff',
        confirmButtonColor: '#b71c1c'
    });
}