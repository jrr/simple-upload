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
type SelectedFiles =
  | {
    status: "none-selected";
  }
  | {
    status: "files-selected";
    files: File[];
  };

const Home: React.FC = () => {
  const [uploadState, setUploadState] = useState<UploadState>({
    status: "empty",
  });
  const [selectedFiles, setSelectedFiles] = useState<SelectedFiles>({
    status: "none-selected",
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
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener("loadstart", progressUpdate);
    xhr.upload.addEventListener("progress", progressUpdate);
    xhr.upload.addEventListener("loadend", progressUpdate);

    xhr.upload.addEventListener("error", handleError);
    xhr.upload.addEventListener("abort", handleError);
    xhr.open("POST", form.action);
    xhr.send(formData);
  }, []);
  const onInput: React.FormEventHandler<HTMLInputElement> = (e) => {
    const files = (e.target as HTMLInputElement).files;
    if (files) {
      console.log("onInput", files);

      setSelectedFiles({
        status: "files-selected",
        files: Array.from(files),
      });
    }
  };

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
          <input type="file" name="files" multiple onInput={onInput} />
          <br />
        </form>
        <button onClick={submitForm}>Submit (XHR)</button>

        {selectedFiles.status == "files-selected" && (
          <SelectedFiles files={selectedFiles.files} />
        )}
        {responseMessage && (
          <div className="responseMessage"> {{ responseMessage }} </div>
        )}
        {uploadState.status == "in-progress" && (
          <>
            <div className="upload-status">{uploadState.percentage}</div>
            <div>
              {uploadState.loaded} / {uploadState.total}
            </div>

            <div className="progress-bar-outer">
              <div
                className="progress-bar-inner"
                style={{
                  height: "24px",
                  width: uploadState.percentage,
                }}
              ></div>
            </div>
          </>
        )}
      </div>
      <hr />
    </div>
  );
};

const SelectedFiles: React.FC<{ files: File[] }> = ({ files }) => {
  console.log("<SelectedFiles> files:", files);
  return (
    <div>
      {files.map((f) => (
        <li key={f.name}>
          {f.name} {f.type} {f.size}{" "}
          {format(new Date(f.lastModified), "{yyyy}-{MM}-{dd} {HH}:{mm}:{ss}")}
        </li>
      ))}
    </div>
  );
};

/*
from https://deno.land/x/light_date@1.2.0/index.ts .
(importing it wasn't working)
 */
export const format = (date: Date, exp: string): string =>
  exp.replace(/\\?{.*?}/g, (key) => {
    if (key.startsWith("\\")) {
      return key.slice(1);
    }
    switch (key) {
      case "{yyyy}":
        return `${date.getFullYear()}`;
      case "{yy}":
        return `${date.getFullYear()}`.slice(-2);
      case "{MM}":
        return `${date.getMonth() + 1}`.padStart(2, "0");
      case "{dd}":
        return `${date.getDate()}`.padStart(2, "0");
      case "{HH}":
        return `${date.getHours()}`.padStart(2, "0");
      case "{mm}":
        return `${date.getMinutes()}`.padStart(2, "0");
      case "{ss}":
        return `${date.getSeconds()}`.padStart(2, "0");
      case "{SSS}":
        return `${date.getMilliseconds()}`.padStart(3, "0");
      default:
        return "";
    }
  });

export default Home;
