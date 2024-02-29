const todos = [];
const RENDER_EVENT = "render-todo";

document.addEventListener("DOMContentLoaded", function () {
  // Kode di atas adalah sebuah listener yang akan menjalankan kode yang ada didalamnya ketika event DOMContentLoaded dibangkitkan alias ketika semua elemen HTML sudah dimuat menjadi DOM dengan baik.
  const submitForm = document.getElementById("form");
  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addTodo();
    // Ketika semua elemen sudah dimuat dengan baik, maka kita perlu mempersiapkan elemen form untuk menangani event submit, di mana aksi tersebut dibungkus dan dijalankan oleh fungsi addTodo(), untuk menambahkan todo baru.
    // kita perlu memanggil method preventDefault() yang didapatkan dari object event. Dengan demikian, data yang disimpan dalam memory akan terjaga dengan baik.
  });
});

function addTodo() {
  const textTodo = document.getElementById("title").value;
  // Kode document.getElementById("title").value berfungsi untuk mengambil elemen pada html. Dalam kasus tersebut, kita menangkap element <input> dengan id title dan memanggil properti value untuk mendapatkan nilai yang diinputkan oleh user. Logika yang sama juga dilakukan pada input date.
  const timestamp = document.getElementById("date").value;

  // Setelah nilai input user disimpan dalam variabel textTodo dan timestamp, kita akan membuat sebuah object dari todo dengan memanggil helper generateTodoObject() untuk membuat object baru. Kemudian, object tersebut disimpan pada array todos menggunakan metode push().
  const generatedID = generateId();
  const todoObject = generateTodoObject(generatedID, textTodo, timestamp, false);
  todos.push(todoObject);

  // Setelah disimpan pada array, kita panggil sebuah custom event RENDER_EVENT menggunakan method dispatchEvent(). Custom event ini akan kita terapkan untuk me-render data yang telah disimpan pada array todos.
  document.dispatchEvent(new Event(RENDER_EVENT));
}

// Fungsi generateId() berfungsi untuk menghasilkan identitas unik pada setiap item todo. Untuk menghasilkan identitas yang unik, kita manfaatkan +new Date() untuk mendapatkan timestamp pada JavaScript.
function generateId() {
  return +new Date();
}

// Fungsi generateTodoObject() berfungsi untuk membuat object baru dari data yang sudah disediakan dari inputan (parameter function), diantaranya id, nama todo (task), waktu (timestamp), dan isCompleted (penanda todo apakah sudah selesai atau belum).
function generateTodoObject(id, task, timestamp, isCompleted) {
  return {
    id,
    task,
    timestamp,
    isCompleted,
  };
}

document.addEventListener(RENDER_EVENT, function () {
  // console.log(todos);

  const uncompletedTODOList = document.getElementById("todos");
  uncompletedTODOList.innerHTML = "";

  const completedTODOList = document.getElementById("completed-todos");
  completedTODOList.innerHTML = "";
  // Agar tidak terjadi duplikasi oleh item yang ada di tampilan ketika memperbarui data todo yang ditampilkan, maka hapus terlebih dahulu elemen sebelumnya (yang sudah ditampilkan) dengan perintah innerHTML = “”

  for (const todoItem of todos) {
    const todoElement = makeTodo(todoItem);
    if (!todoItem.isCompleted)
      // Oke, disini perubahan yang kita lakukan ialah memasang kondisi if statement untuk mem-filter hanya todo “Yang harus dibaca” saja lah yang perlu ditampilkan.
      uncompletedTODOList.append(todoElement);
    // Kemudian, pada perulangan kita juga menambahkan cabang logika else statement baru dengan kode yang digunakan untuk menambahkan todoElement ke completedTODOList.
    else completedTODOList.append(todoElement);
  }
});

// makeTodo
function makeTodo(todoObject) {
  // Mulai dari document.createElement(). Method tersebut berfungsi untuk membuat objek DOM, yakni elemen HTML.
  const textTitle = document.createElement("h2");
  // ebagai contoh, jika Anda ingin membuat elemen Heading level-2 (seperti yang dicontoh di atas), Anda bisa mengisi argumentnya dengan nama dari tag tersebut sehingga hasilnya menjadi document.createElement("h2").
  // Tipe argumen atau parameter yang diperlukan adalah string. Jika ingin membuat elemen lain seperti <div> dan sebagainya, Anda dapat menyesuaikan nama tag yang dituju pada parameter tersebut.
  textTitle.innerText = todoObject.task;

  const textTimestamp = document.createElement("p");
  textTimestamp.innerText = todoObject.timestamp;
  // Jika berhasil dibuat, elemen baru ini akan memiliki properti innerText. Properti ini berfungsi untuk menyematkan konten berupa teks (tak berformat HTML) pada elemen HTML.

  const textContainer = document.createElement("div");
  textContainer.classList.add("inner");
  // Salah satu cara yang bisa dilakukan adalah dengan menggunakan property classList, yang mana kita bisa menambahkan satu atau beberapa class dengan menggunakan classList.add().
  textContainer.append(textTitle, textTimestamp);

  const container = document.createElement("div");
  container.classList.add("item", "shadow");
  container.append(textContainer);
  container.setAttribute("id", `todo-${todoObject.id}`);
  // Kemudian, agar setiap todo item mudah di-track dan dikelola, kita perlu memberikan identitas (ID) unik pada setiap elemen todo tersebut. Untuk menetapkan id pada elemen, kita bisa menggunakan setAttributes("id", ""). Agar elemen yang telah kita buat tadi bisa digunakan, kita perlu mengembalikan hasilnya dengan menggunakan return statement.

  if (todoObject.isCompleted) {
    const undoButton = document.createElement("button");
    undoButton.classList.add("undo-button");

    undoButton.addEventListener("click", function () {
      undoTaskFromCompleted(todoObject.id);
    });

    // Tombol lain, seperti undoButton & trashButton, juga menerapkan hal yang sama, di mana memanggil fungsi undoTaskFromCompleted dan removeTaskFromCompleted. Yang mana masing - masing akan memindahkan todo dari selesai ke belum selesai, dan menghapus todo.
    const trashButton = document.createElement("button");
    trashButton.classList.add("trash-button");

    trashButton.addEventListener("click", function () {
      removeTaskFromCompleted(todoObject.id);
    });

    container.append(undoButton, trashButton);
  } else {
    const checkButton = document.createElement("button");
    checkButton.classList.add("check-button");
    // Kemudian, agar tombol tersebut bisa diinteraksikan, kita perlu menerapkan event listener “click”, dengan fungsi yang memanggil fungsi lain sesuai dengan konteks dari tombol tersebut. Misalnya, pada tombol ini (checkButton) memanggil addTaskToCompleted, yang mana akan memindahkan todo dari rak “Yang harus dilakukan” ke rak “Yang sudah dilakukan”.

    checkButton.addEventListener("click", function () {
      addTaskToCompleted(todoObject.id);
    });

    container.append(checkButton);
  }

  return container;
}

// Seperti yang sudah dijelaskan sebelumnya, fungsi ini digunakan untuk memindahkan todo dari rak “Yang harus dilakukan” ke “Yang sudah dilakukan”.
// Prinsipnya adalah merubah state isCompleted dari sebelumnya false ke true, kemudian panggil event RENDER_EVENT untuk memperbarui data yang ditampilkan.
function addTaskToCompleted(todoId) {
  const todoTarget = findTodo(todoId);

  if (todoTarget == null) return;

  todoTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
}
// Kemudian, fungsi ini memanggil fungsi baru, yaitu findTodo, yang mana berfungsi untuk mencari todo dengan ID yang sesuai pada array todos.
// agar tidak error tambahkan fungsi berikut:

function findTodo(todoId) {
  for (const todoItem of todos) {
    if (todoItem.id === todoId) {
      return todoItem;
    }
  }
  return null;
}

function removeTaskFromCompleted(todoId) {
  // Kemudian untuk removeTaskFromCompleted, fungsi ini akan menghapus Todo berdasarkan index yang didapatkan dari pencarian Todo dengan menggunakan findTodoIndex(). Apabila pencarian berhasil, maka akan menghapus todo tersebut menggunakan fungsi splice() yang disediakan oleh JavaScript.
  const todoTarget = findTodoIndex(todoId);

  if (todoTarget === -1) return;

  todos.splice(todoTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function undoTaskFromCompleted(todoId) {
  // dimulai dari undoTaskFromCompleted. Fungsi ini sebenarnya mirip dengan addTaskToCompleted, namun perbedaannya adalah pada state isCompleted yang diubah nilainya ke false, hal ini bertujuan agar todo task yang sebelumnya completed (selesai), bisa dipindah menjadi incomplete (belum selesai).
  const todoTarget = findTodo(todoId);

  if (todoTarget == null) return;

  todoTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function findTodoIndex(todoId) {
  for (const index in todos) {
    if (todos[index].id === todoId) {
      return index;
    }
  }

  return -1;
}
