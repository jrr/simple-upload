function submitForm() {
  console.log("submitting programmatically with fetch()..");
  const form = document.getElementById("upload-form");
  fetch(form.action, { method: "post", body: new FormData(form) });
}

function submitForm2() {
  console.log("submitting programmatically with XHR()..");
  const form = document.getElementById("upload-form");
  const formData = new FormData(form);
  console.log(
    "entries?",
    Array.from(formData.entries()) //.map(([a, b]) => b.length)
  );
  const xhr = new XMLHttpRequest();
  addListeners(xhr);
  xhr.open("POST", form.action);
  xhr.send(formData);
}

function handleEvent(e) {
  //   console.log("event?", e);
  console.log(
    `${e.type}: computable?=${e.lengthComputable} ${e.loaded}/${e.total} bytes transferred`
  );
}

function addListeners(xhr) {
  xhr.addEventListener("loadstart", handleEvent);
  xhr.addEventListener("load", handleEvent);
  xhr.addEventListener("loadend", handleEvent);
  xhr.addEventListener("progress", handleEvent);
  xhr.addEventListener("error", handleEvent);
  xhr.addEventListener("abort", handleEvent);
}
