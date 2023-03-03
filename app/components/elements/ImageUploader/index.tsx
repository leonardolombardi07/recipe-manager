import React from "react";
import { Button, Card, Header, Icon, Image } from "semantic-ui-react";

interface ImageUploaderProps {
  initialImage: string | null;
  name: string;
  width?: number;
}

export default function ImageUploader({
  initialImage,
  name,
  width,
}: ImageUploaderProps) {
  const [file, setFile] = React.useState<Blob | null>(null);
  const [touched, setTouched] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  function resetInputValue() {
    if (inputRef.current?.value) {
      inputRef.current.value = "";
    }
  }

  function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files && event.target.files[0]) {
      setTouched(true);
      setFile(event.target.files[0]);
    } else {
      // Fix for https://stackoverflow.com/questions/42192346/how-to-reset-reactjs-file-input
      // (Bug when uploading the same file twice)
      resetInputValue();
    }
  }

  function onReset() {
    setTouched(true);
    setFile(null);
    resetInputValue();
  }

  const CHANGED_IMAGE = file !== null;
  const RESETED_IMAGE = !file && touched;
  const STILL_INITIAL_IMAGE = !file && !touched;

  const displayImageSrc = (function getImageSrc() {
    if (CHANGED_IMAGE) return URL.createObjectURL(file);
    if (RESETED_IMAGE) return "";
    if (STILL_INITIAL_IMAGE) return initialImage || "";
  })();

  const typeOfImageOnAction = (function () {
    if (CHANGED_IMAGE) return "file";
    if (RESETED_IMAGE) return "text";
    if (STILL_INITIAL_IMAGE) return "text";
  })();

  return (
    <Card
      style={{
        placeItems: "center",
        marginLeft: "auto",
        marginRight: "auto",
        width,
        minHeight: 250,
      }}
    >
      <Card.Content
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width,
        }}
      >
        {displayImageSrc ? (
          <React.Fragment>
            <Image
              src={displayImageSrc}
              fluid
              style={{ height: "100%", width: "100%" }}
            />

            <Button
              // type="button" fixes a onClick trigger when pressing enter key on different input
              // See: https://stackoverflow.com/questions/12325066/button-click-event-fires-when-pressing-enter-key-in-different-input-no-forms
              type="button"
              circular
              color="red"
              icon="delete"
              size="huge"
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                zIndex: 5,
              }}
              onClick={onReset}
            />
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Icon name="camera" size="huge" />
            <Header style={{ marginTop: 10, textAlign: "center" }}>
              Tap or click to add a photo
              <Header.Subheader style={{ marginTop: 30 }}>
                *Please ensure this is your own image
              </Header.Subheader>
            </Header>
          </React.Fragment>
        )}

        {/* Nasty hack to make sure that if the display image is the initial image,
          the value of formData.get(name) on action is right */}

        {typeOfImageOnAction === "text" && (
          <input hidden name={name} type={"text"} value={displayImageSrc} />
        )}

        <input
          ref={inputRef}
          name={typeOfImageOnAction === "text" ? undefined : name}
          onChange={onChange}
          type="file"
          accept="image/*"
          style={{
            color: "transparent",
            opacity: 0,
            position: "absolute",
            height: "100%",
            cursor: "pointer",
          }}
        />
      </Card.Content>
    </Card>
  );
}
