"use client";

import Input from "./Input";
import styles from "./Input.module.css";

export default function InputTest() {
  return (
    <div className={styles.inputs}>
      <h2 className={styles.heading}>Inputs</h2>

      <div className={styles.textInput}>
        <h3>Text Input</h3>

        <div className={styles.textInputContent}>
          <Input placeholder="Placeholder" state="default" />

          <Input value="Example text" state="default" />

          <Input autoFocus onChange={() => {}} state="focus" />

          <div className={styles.error}>
            <Input value="Example text" state="error" />
            <div className={styles.errorMessage}>Error text</div>
          </div>
        </div>
      </div>
      <div className={styles.textArea}>
        <h3>Text Area</h3>
        <div className={styles.textAreaContent}>
          <textarea
            className={styles.textAreaField}
            placeholder="Type your message..."
          />
          <textarea
            className={styles.textAreaFilled}
            value="Example message"
            readOnly
          />
          <textarea
            className={styles.textAreaFocused}
            value="Example message"
            readOnly
          />
          <div className={styles.textAreaError}>
            <textarea
              className={styles.textAreaErrorField}
              value="Example message"
              readOnly
            />
            <div className={styles.textAreaErrorMessage}>Error Text</div>
          </div>
        </div>
      </div>
    </div>
  );
}
