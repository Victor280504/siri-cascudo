import { ButtonHTMLAttributes, useRef, useState } from "react";
import styles from "./Delete.module.css";
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;
import { createPortal } from "react-dom";
import { ApiError, ServerCreateResponse } from "../../../../services/api";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import Item from "../../Item";

const Delete = ({ style, ...props }: ButtonProps) => {
  const [hover, setHover] = useState(false);

  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <button
        ref={buttonRef}
        className={styles.delete}
        style={style}
        {...props}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        Excluir Conta
      </button>
    </>
  );
};

interface DeleteConfirmationProps {
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirmation = ({
  onConfirm,
  onCancel,
}: DeleteConfirmationProps) => {
  return createPortal(
    <div className={styles.confirmationOverlay}>
      <div className={styles.confirmationBox}>
        <p className={styles.p}>
          Você tem certeza
          <br />
          que gostaria de deletar?
        </p>
        <Item.Row justifyContent="space-around" width="100%">
          <button className={styles.button} onClick={onConfirm}>
            Sim
          </button>
          <button className={styles.button} onClick={onCancel}>
            Não
          </button>
        </Item.Row>
      </div>
    </div>,
    document.body
  );
};

interface DeleteWithConfirmationProps extends ButtonProps {
  id: string;
  onDelete: (
    id: string
  ) => Promise<AxiosError | ApiError | ServerCreateResponse>;
  link?: string;
}

const DeleteWithConfirmation = ({
  id,
  onDelete,
  link,
  ...props
}: DeleteWithConfirmationProps) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [message, setMessage] = useState<
    ServerCreateResponse | ApiError | null
  >(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const navigate = useNavigate();
  const handleDeleteClick = () => {
    setShowConfirmation(true);
  };

  const handleConfirm = () => {
    setShowConfirmation(false);
    const res = onDelete(id);
    if ((res as unknown as ApiError).statusCode) {
      setMessage(res as unknown as ApiError);
    } else {
      setMessage(res as unknown as ServerCreateResponse);
    }
    setFeedback("Deletando...");
    setTimeout(() => {
      navigate(`/${link}`);
    }, 3000);
  };

  const handleCancel = () => {
    setShowConfirmation(false);
  };

  return (
    <>
      <Delete {...props} onClick={handleDeleteClick} />
      {showConfirmation && (
        <DeleteConfirmation onConfirm={handleConfirm} onCancel={handleCancel} />
      )}
      {message && <span className={styles.feedback}>{message.message}</span>}
      <Item.Row justifyContent="center" width="100%">
        {feedback && <span className={styles.feedback}>{feedback}</span>}
      </Item.Row>
    </>
  );
};

export default DeleteWithConfirmation;
