import React, { useCallback, useRef, useState } from "react";
import { format } from "../lib/format-date.tsx";

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

  const fileInputRef = useRef<HTMLInputElement>(null);
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
    // const form = document.getElementById("upload-form") as HTMLFormElement;
    const formData = new FormData();

    if (fileInputRef.current && fileInputRef.current.files) {
      const files = fileInputRef.current.files;
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        formData.append("files", file);
      }
    } else {
      console.error("no <input> ref");
    }

    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener("loadstart", progressUpdate);
    xhr.upload.addEventListener("progress", progressUpdate);
    xhr.upload.addEventListener("loadend", progressUpdate);

    xhr.upload.addEventListener("error", handleError);
    xhr.upload.addEventListener("abort", handleError);
    xhr.open("POST", "/api/upload", true);
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
      <section id="upload">
        <div className="full-width">
          <h1>Simple Upload</h1>
        </div>

        <br />

        <input
          id="file-input"
          type="file"
          name="files"
          multiple
          onInput={onInput}
          ref={fileInputRef}
        />

        <br />
        <br />

        <button onClick={submitForm} className="btn" id="submit-button">
          Submit
        </button>

        <br />

        {selectedFiles.status == "files-selected" && (
          <div className="full-width">
            <SelectedFiles files={selectedFiles.files} />
          </div>
        )}

        <br />

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
      </section>
      <hr />
    </div>
  );
};

const SelectedFiles: React.FC<{ files: File[] }> = ({ files }) => {
  console.log("<SelectedFiles> files:", files);
  return (
    <div>
      {files.map((f) => (
        <div className="file-info" key={f.name}>
          <div>{f.name}</div>
          {/* <div>{f.type}</div> */}
          <div>
            {summarizeFileSize(f.size)}
            &nbsp; &nbsp; &nbsp; &nbsp;
            {format(
              new Date(f.lastModified),
              "{yyyy}-{MM}-{dd} {HH}:{mm}:{ss}"
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
function summarizeFileSize(n: number) {
  if (n < 1000000) {
    return `${Math.floor(n / 1000)}K`;
  }

  if (n < 10 * 1000000) {
    return `${(n / 1000000).toFixed(1)}M`;
  }

  return `${(n / 1000000).toFixed(0)}M`;
}

export default Home;
