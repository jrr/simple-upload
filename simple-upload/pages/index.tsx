import React from 'react'


function submitFormXHR() {
  console.log("submitting programmatically with XHR()..");
  const form = document.getElementById("upload-form") as HTMLFormElement;
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

function handleError(e: any) {
  //   console.log("event?", e);
  console.log(
    `2: ${e.type}: computable?=${e.lengthComputable} ${e.loaded}/${e.total} bytes transferred`
  );
}
function progressUpdate(e: ProgressEvent<XMLHttpRequestEventTarget>) {
  //   console.log("event?", e);
  console.log("progress", (e.loaded / e.total) * 100)
  // console.log(
  //   `2: ${e.type}: computable?=${e.lengthComputable} ${e.loaded}/${e.total} bytes transferred`
  // );
}

function addListeners(xhr: XMLHttpRequest) {

  xhr.upload.addEventListener("loadstart", progressUpdate);
  xhr.upload.addEventListener("progress", progressUpdate);
  xhr.upload.addEventListener("loadend", progressUpdate);

  // xhr.upload.addEventListener("load", handleEvent);
  xhr.upload.addEventListener("error", handleError);
  xhr.upload.addEventListener("abort", handleError);
}

export default function Home() {

  const responseMessage = false;
  return (
    <div className="page">
      <head>
        <title>Hello World - Aleph.js</title>
        <link rel="stylesheet" href="../style/index.css" />
      </head>
      <hr />
      <div className="box">
        <h1>Simple Upload</h1>

        <br />
        <form
          action="/api/upload"
          encType="multipart/form-data"
          method="post"
          id="upload-form"
        >
          {/* todo: replace this with custom button.
          can we get the filename(s) programmatically? */}
          <input type="file" name="files" multiple />
          <br />
        </form>
        <button onClick={submitFormXHR}>Submit (XHR)</button>

        {responseMessage &&
          <div className="responseMessage"> {{ responseMessage }} </div>
        }
      </div>
      <hr />
    </div>
  )
}
