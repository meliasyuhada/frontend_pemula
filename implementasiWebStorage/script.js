// Di dalam elemen <script>, sudah terdapat beberapa kode antara lain:

// Variabel-variabel yang bisa kita gunakan untuk berinteraksi dengan DOM.
// Sebuah fungsi getAnswer() yang berfungsi untuk menghasilkan kombinasi dari angka "1", "2", dan "3". Kombinasi tersebut akan menjadi jawaban untuk permainan tebak angka.
// Variabel-variabel yang menampung key untuk session storage maupun local storage.

//inisialiasi variabel untuk menampung elemen dokumen
const localTotalVictoryField = document.getElementById("local-total-victory-field");
const localMaximumAttemptField = document.getElementById("local-maximum-attempt-field");
const destroyDataButton = document.getElementById("destroy-data-button");
const playButton = document.getElementById("play-button");
const beforeGameDisplay = document.getElementById("before-game-display");
const duringGameDisplay = document.getElementById("during-game-display");
const afterGameDisplay = document.getElementById("after-game-display");
const answerButton1 = document.getElementById("answer-1-button");
const answerButton2 = document.getElementById("answer-2-button");
const answerButton3 = document.getElementById("answer-3-button");
const sessionUserAnswerField = document.getElementById("session-user-answer-field");
const sessionUserWrongAnswerField = document.getElementById("session-user-wrong-answer-field");
const sessionTrueAnswerField = document.getElementById("session-true-answer-field");
const sessionUserAttemptsField = document.getElementById("session-user-attempts-amount-field");

//inisialisasi fungsi untuk menghasilkan jawaban permainan
function getAnswer() {
  let answer = "123".split("");
  for (let i = 0; i < answer.length; i++) {
    let j = Math.floor(Math.random() * (i + 1));
    let tmp = answer[i];
    answer[i] = answer[j];
    answer[j] = tmp;
  }
  return answer.join("");
}

//inisialiasi key untuk session storage
const sessionAnswerKey = "SESSION_ANSWER";
const sessionUserAttemptsKey = "SESSION_USER_ATTEMPTS";
const sessionUserIsPlayingKey = "SESSION_USER_IS_PLAYING";

//inisialisasi key untuk local storage
const localTotalVictoryKey = "LOCAL_TOTAL_VICTORIES_PLAYED";
const localMaximumAttemptsKey = "LOCAL_MAXIMUM_ATTEMPTS";

window.addEventListener("load", function () {
  if (typeof Storage !== "undefined") {
    // inisialisasi semua item web storage yang kita akan gunakan jika belum ada
    if (sessionStorage.getItem(sessionAnswerKey) === null) {
      sessionStorage.setItem(sessionAnswerKey, "");
    }
    if (sessionStorage.getItem(sessionUserAttemptsKey) === null) {
      sessionStorage.setItem(sessionUserAttemptsKey, 0);
    }
    if (sessionStorage.getItem(sessionUserIsPlayingKey) === null) {
      sessionStorage.setItem(sessionUserIsPlayingKey, false);
    }
    if (localStorage.getItem(localTotalVictoryKey) === null) {
      localStorage.setItem(localTotalVictoryKey, 0);
    }
    if (localStorage.getItem(localMaximumAttemptsKey) === null) {
      localStorage.setItem(localMaximumAttemptsKey, 0);
    }
  } else {
    alert("Browser yang Anda gunakan tidak mendukung Web Storage");
  }
  //inisialisasi semua nilai field pada dokumen yang menggunakan nilai dari web storage
  sessionUserAttemptsField.innerText = sessionStorage.getItem(sessionUserAttemptsKey);
  localTotalVictoryField.innerText = localStorage.getItem(localTotalVictoryKey);
  localMaximumAttemptField.innerText = localStorage.getItem(localMaximumAttemptsKey);
});

playButton.addEventListener("click", function () {
  sessionStorage.setItem(sessionAnswerKey, getAnswer());
  sessionStorage.setItem(sessionUserIsPlayingKey, true);
  // Tombol ini memiliki dua fungsionalitas yakni menghasilkan angka yang harus ditebak melalui
  // fungsi getAnswer() dan menyimpannya pada session storage dengan key sessionAnswerKey.
  // Fungsionalitas kedua adalah mengubah layout pada kumpulan elemen "Game Board".
  beforeGameDisplay.setAttribute("hidden", true);
  duringGameDisplay.removeAttribute("hidden");
  // Elemen ini sebenarnya mengandung 3 layout berbeda, di mana hanya 1 saja yang ditampilkan berdasarkan
  //skenario tertentu. Layout-layout disembunyikan melalui atribut hidden. Jika ingin dimunculkan,
  //atribut tersebut perlu dihilangkan dengan method removeAttribute(), sementara layout sebelumnya
  //disembunyikan dengan method setAttribute(). Sehingga, jika tombol "Bermain" ditekan, maka layout pada
  //elemen "Game Board" akan berubah.
});

// Setelah layout dari elemen "Game Board" berubah, muncul layout baru di mana salah satu konten paling
//mencolok adalah 3 tombol masing-masing berisi angka "1", "2", dan "3". Masing-masing tombol tersebut akan
//kita berikan sebuah event listener untuk event "click".
answerButton1.addEventListener("click", function () {
  sessionUserAnswerField.innerText += "1";
  if (sessionUserAnswerField.innerText.length == 3) {
    checkAnswer(sessionUserAnswerField.innerText);
  }
});
// Pada setiap event listener tombol-tombol di atas, kita bisa melihat bahwa jika input tebakan dari user sudah
//sepanjangan 3 karakter, sebuah fungsi yang bernama checkAnswer() akan dipanggil. Karakter tebakan dari
//user akan dimasukkan ke fungsi tersebut sebagai parameter.

answerButton2.addEventListener("click", function () {
  sessionUserAnswerField.innerText += "2";
  if (sessionUserAnswerField.innerText.length == 3) {
    checkAnswer(sessionUserAnswerField.innerText);
  }
});

answerButton3.addEventListener("click", function () {
  sessionUserAnswerField.innerText += "3";
  if (sessionUserAnswerField.innerText.length == 3) {
    checkAnswer(sessionUserAnswerField.innerText);
  }
});
// Setiap event listener dari ketiga tombol tersebut kurang lebih memiliki fungsionalitas yang sama, yakni
//menambahkan angka ke dalam kombinasi tebakan user berdasarkan tombol yang ditekan.

function checkAnswer(userGuess) {
  // Fungsi checkAnswer akan menjalankan kode yang berbeda berdasarkan kondisi apakah user
  //berhasil menebak angka yang tepat sesuai di session storage sebelumnya.
  const answer = sessionStorage.getItem(sessionAnswerKey);
  if (userGuess == answer) {
    duringGameDisplay.setAttribute("hidden", true);
    afterGameDisplay.removeAttribute("hidden");
    sessionTrueAnswerField.innerText = answer;
    updateScore();
    //   Jika user salah menebak, stats pada Game Session Stats akan menghitung jumlah masukan tebakan
    // yang salah. Kemudian halaman web akan menampilkan informasi tebakan kita salah.
  } else {
    const previousAttemptAmount = parseInt(sessionStorage.getItem(sessionUserAttemptsKey));
    sessionStorage.setItem(sessionUserAttemptsKey, previousAttemptAmount + 1);
    sessionUserAttemptsField.innerText = sessionStorage.getItem(sessionUserAttemptsKey);
    sessionUserAnswerField.innerText = "";
    sessionUserWrongAnswerField.innerText = userGuess;
  }
  //   Namun, jika tebakan user sudah sama dengan jawaban yang dihasilkan pada sistem yang tersimpan
  //pada session storage, tampilan elemen Game Board akan berubah. Tampilan elemen gameboard akan
  //memberitahu user bahwa ia telah menebak dengan tepat. Selain itu, stats pada local stats akan juga
  //ikut diperbarui.
}

function updateScore() {
  // Fungsi updateScore() berguna untuk memperbarui stats user pada elemen Local Stats.
  const sessionAttemptsValue = parseInt(sessionStorage.getItem(sessionUserAttemptsKey));
  //   Kalau kita telaah kode di dalam fungsi updateScore(), hasil dari pengambilan data dari session
  //storage dan local storage akan dimasukkan ke fungsi parseInt() terlebih dahulu sebelum dimasukkan ke
  //sebuah variabel.
  const localAttemptsValue = parseInt(localStorage.getItem(localMaximumAttemptsKey));
  //   Mengapa hasil pengambilan data dari session storage dan local storage harus terlebih dahulu
  //dimasukkan ke fungsi parseInt()? Alasannya adalah kita ingin melakukan operasi matematis pada datanya.
  //Sama halnya seperti "Jumlah kombinasi yang berhasil di tebak" ingin kita tambah 1 ketika user berhasil
  //menebak kombinasi angka yang tepat.

  if (sessionAttemptsValue > localAttemptsValue) {
    localStorage.setItem(localMaximumAttemptsKey, sessionAttemptsValue);
    localMaximumAttemptField.innerText = sessionAttemptsValue;
    // Ketika user berhasil menebak angka, dua stats akan diperbarui, yakni "Jumlah kombinasi yang berhasil
    // di tebak" dan "Jumlah tebakan salah terbanyak sekali main".
  }
  const previousTotalVictoryAmount = parseInt(localStorage.getItem(localTotalVictoryKey));
  localStorage.setItem(localTotalVictoryKey, previousTotalVictoryAmount + 1);
  localTotalVictoryField.innerText = localStorage.getItem(localTotalVictoryKey);
  //   Jika dalam sebuah permainan jumlah tebakan salah kita lebih banyak dari "Jumlah tebakan salah
  //terbanyak sekali main", maka stats "Jumlah tebakan salah terbanyak sekali main" akan diperbarui.
  //Stats untuk "Jumlah kombinasi yang berhasil di tebak" juga akan bertambah.
}

window.addEventListener("beforeunload", function () {
  sessionUserAnswerField.innerText = "";
  sessionUserWrongAnswerField.innerText = "";
  sessionStorage.setItem(sessionUserAttemptsKey, 0);
  sessionUserAttemptsField.innerText = sessionStorage.getItem(sessionUserAttemptsKey);
});
// Dengan menambahkan event listener untuk event "beforeunload", browser kita akan menghapus dan
//mengonfigurasi semua nilai dari item-item session storage kembali ke nilai awal. Sehingga,
//jika user melakukan proses refresh/reload halaman, permainan yang belum selesai akan dihapus.
//Jika user ingin bermain lagi, ia harus menekan tombol "Bermain".

destroyDataButton.addEventListener("click", function () {
  sessionStorage.removeItem(sessionAnswerKey);
  sessionStorage.removeItem(sessionUserAttemptsKey);
  sessionStorage.removeItem(sessionUserIsPlayingKey);
  localStorage.removeItem(localTotalVictoryKey);
  localStorage.removeItem(localMaximumAttemptsKey);
  alert("Mohon me-refresh halaman ini kembali");
});
// Pada kode di atas, kita menambahkan event listener ke dalam tombol yang memiliki tulisan
//"Hapus semua data". Jika tombol tersebut ditekan, semua item storage yang terdapat pada session
// storage dan local storage akan terhapus.
