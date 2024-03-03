const storageKey = "STORAGE_KEY";
const submitAction = document.getElementById("form-data-user");

// Fungsionalitas pertama adalah memeriksa apakah fitur web storage didukung oleh browser
//yang kita gunakan melalui sebuah fungsi bernama checkForStorage().
function checkForStorage() {
  return typeof Storage !== "undefined";
}
// Fungsi di atas akan mengembalikan nilai true jika fitur web storage didukung oleh browser
// dan false jika tidak.

function putUserList(data) {
  // putUserList(). Fungsi ini berguna untuk membuat item storage, membuat nilai awalnya serta untuk memodifikasi
  // nilai pada item storage-nya juga.
  if (checkForStorage()) {
    // Fungsi di atas akan memeriksa apakah fitur web storage sudah didukung melalui
    // fungsi checkForStorage(). Jika iya, kita akan membuat sebuah variabel bernama
    //userData yang akan menampung semua data pada item storage. Jika item storage yang digunakan
    //belum dibuat, kita akan memberikan nilai array kosong ke variabel userData. Jika tidak, kita akan
    //mengambil data yang disimpan dan memasukkannya ke fungsi JSON.parse().
    let userData = [];
    if (localStorage.getItem(storageKey) !== null) {
      userData = JSON.parse(localStorage.getItem(storageKey));
      //   JSON.parse() = Fungsi tersebut berguna untuk mengonversi sebuah JSON yang ditulis dalam bentuk
      // string ke bentuk JSON "asli".
    }
    userData.unshift(data);
    // Kode userData.unshift(data) akan memasukkan nilai yang disimpan di parameter data ke elemen paling
    // depan array yang tersimpan di variabel userData. Kode di dalam kondisi
    // if terakhir (userData.length > 5) berfungsi untuk menghilangkan data pada elemen paling terakhir
    // jika panjang userData melebihi 5.
    if (userData.length > 5) {
      userData.pop();
    }
    localStorage.setItem(storageKey, JSON.stringify(userData));
    // Hal ini dilakukan untuk memunculkan 5 data dari user yang paling baru agar tampilan halaman web
    // tetap rapi. Baris terakhir adalah menyimpan data tersebut ke dalam local storage melalui method
    // setItem(). Sebelum disimpan, kita harus mengubah array yang berisi data-data JSON ke dalam bentuk
    //string terlebih dahulu. Hal ini bisa kita capai melalui fungsi JSON.stringify().
  }
}

function getUserList() {
  // getUserList() yang berguna untuk mendapatkan semua data pada item storage yang berisi data user
  // yang sudah di-input.
  if (checkForStorage()) {
    return JSON.parse(localStorage.getItem(storageKey)) || [];
  } else {
    return [];
  }
  // Fungsi ini mengembalikan nilai array dari localStorage ketika sudah memiliki nilai sebelumnya
  // melalui JSON.parse(). Namun, jika item storage yang kita ambil masih kosong, fungsi ini akan
  // mengembalikan nilai array kosong.
}

function renderUserList() {
  const userData = getUserList();
  const userList = document.querySelector("#user-list-detail");
  userList.innerHTML = "";
  for (let user of userData) {
    let row = document.createElement("tr");
    row.innerHTML = "<td>" + user.nama + "</td>";
    row.innerHTML += "<td>" + user.umur + "</td>";
    row.innerHTML += "<td>" + user.domisili + "</td>";
    userList.appendChild(row);
  }
  // Kemudian kita akan menambahkan event listener ke tombol submit untuk mengambil semua data yang sudah
  // di-input ke semua field di form. Lalu kita akan menyimpannya pada item storage melalui
  // fungsi putUserList(). Selanjutnya daftar user yang baru saja kita masukkan akan langsung ditampilkan
  //melalui fungsi renderUserList().
}

submitAction.addEventListener("submit", function (event) {
  const inputNama = document.getElementById("nama").value;
  const inputUmur = document.getElementById("umur").value;
  const inputDomisili = document.getElementById("domisili").value;
  const newUserData = {
    nama: inputNama,
    umur: inputUmur,
    domisili: inputDomisili,
  };
  putUserList(newUserData);
  renderUserList();
  //   Terakhir, kita akan menambahkan event listener ke objek window untuk event "load". Event handler-nya
  // akan berisi perintah untuk menampilkan semua data yang sudah kita input ke dalam item storage.
});

window.addEventListener("load", function () {
  if (checkForStorage) {
    if (localStorage.getItem(storageKey) !== null) {
      renderUserList();
    }
  } else {
    alert("Browser yang Anda gunakan tidak mendukung Web Storage");
  }
});
