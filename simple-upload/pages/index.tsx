import React, { useCallback, useState } from "react";

type UploadState =
  | {
    status: "empty";
  }
  | {
    status: "in-progress";
    loaded: number;
    total: number;
    percentage: string;
  }
  | {
    status: "error";
    error: string;
  };

const Home: React.FC = () => {
  const [uploadState, setUploadState] = useState<UploadState>({
    status: "empty",
  });
  const progressUpdate = useCallback(
    (e: ProgressEvent<XMLHttpRequestEventTarget>) => {
      setUploadState({
        status: "in-progress",
        loaded: e.loaded,
        total: e.total,
        percentage: `${Math.round((100 * e.loaded) / e.total)}%`,
      });
    },
    []
  );
  const handleError = useCallback(
    (e: ProgressEvent<XMLHttpRequestEventTarget>) => {
      console.log("Upload error!", e);
    },
    []
  );

  const submitForm = useCallback(() => {
    console.log("submitting programmatically with XHR()..");
    const form = document.getElementById("upload-form") as HTMLFormElement;
    const formData = new FormData(form);
    console.log(
      "entries?",
      Array.from(formData.entries()) //.map(([a, b]) => b.length)
    );
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener("loadstart", progressUpdate);
    xhr.upload.addEventListener("progress", progressUpdate);
    xhr.upload.addEventListener("loadend", progressUpdate);

    xhr.upload.addEventListener("error", handleError);
    xhr.upload.addEventListener("abort", handleError);
    xhr.open("POST", form.action);
    xhr.send(formData);
  }, []);

  const responseMessage = false;
  return (
    <div className="page">
      <head>
        <title>Simple Upload</title>
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
        <button onClick={submitForm}>Submit (XHR)</button>

        {responseMessage && (
          <div className="responseMessage"> {{ responseMessage }} </div>
        )}
        {/* <p>status {JSON.stringify(uploadState)}</p> */}
        {uploadState.status == "in-progress" && (
          <>
            <div className="upload-status">{uploadState.percentage}</div>
            <div>
              {uploadState.loaded} / {uploadState.total}
            </div>

            <div className="progress-bar-outer">
              <div className="progress-bar-inner" style={{
                height: "24px",
                width: uploadState.percentage
              }}></div>
            </div>
          </>
        )}
      </div>
      <hr />
    </div>
  );
};

export default Home;
