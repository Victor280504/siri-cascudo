import { ButtonHTMLAttributes, useEffect, useRef, useState } from "react";
import styles from "./Delete.module.css";
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;
import { createPortal } from "react-dom";
import { ApiError, ServerCreateResponse } from "../../../../services/api";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import Item from "../../Item";
import { useAuth } from "../../../../hooks/useAuth";
import { Message } from "../../../../pages/Admin/Dashboard/components/Stock/EditIngredient";

const Delete = ({ style, ...props }: ButtonProps) => {
  const [hover, setHover] = useState(false);

  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <button
        type="button"
        ref={buttonRef}
        className={styles.delete}
        style={style}
        {...props}
      >
        {hover ? (
          <>
            <span className={`material-symbols-outlined light sm`}>delete</span>
          </>
        ) : (
          <>
            <span className={`material-symbols-outlined light sm`}>delete</span>
          </>
        )}
        Excluir
      </button>
    </div>
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
  handleLogout?: boolean;
  onlyDelete?: boolean;
  alternativeMessage?: ServerCreateResponse | ApiError | null;
  setAlternativeMessage?: () => void;
}

const DeleteWithConfirmation = ({
  id,
  onDelete,
  link,
  handleLogout = false,
  onlyDelete = false,
  alternativeMessage,
  setAlternativeMessage,
  ...props
}: DeleteWithConfirmationProps) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [message, setMessage] = useState<
    ServerCreateResponse | ApiError | null
  >(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const navigate = useNavigate();
  const { logout } = useAuth();
  const handleDeleteClick = () => {
    setShowConfirmation(true);
  };

  const handleConfirm = () => {
    setShowConfirmation(false);
    setFeedback("Deletando...");
    const res = onDelete(id);
    if ((res as unknown as ApiError).status) {
      setMessage(res as unknown as ApiError);
    } else {
      setMessage(res as unknown as ServerCreateResponse);
    }

    setTimeout(() => {
      if (handleLogout) {
        logout();
      }
      navigate(`/${link}`);
    }, 3000);
  };

  const handleCancel = () => {
    setShowConfirmation(false);
  };

  useEffect(() => {
    if (message) {
      setTimeout(() => {
        setMessage(null);
      }, 3000);
    }
  }, [message]);

  useEffect(() => {
    if (message) {
      setTimeout(() => {
        setAlternativeMessage && setAlternativeMessage();
      }, 3000);
    }
  }, [alternativeMessage]);
  useEffect(() => {
    if (feedback) {
      setTimeout(() => {
        setFeedback(null);
      }, 3000);
    }
  }, [feedback]);
  return (
    <>
      <Delete {...props} onClick={handleDeleteClick} />
      {showConfirmation && (
        <DeleteConfirmation onConfirm={handleConfirm} onCancel={handleCancel} />
      )}
      {feedback && (
        <Message
          message={feedback}
          variant="INFO"
          bottom="130px"
          show={feedback ? true : false}
        />
      )}
      {message &&
        (message.message != "" || message != null || message != undefined) &&
        !feedback &&
        onlyDelete && (
          <Message
            message={message.message}
            variant={message.flag}
            bottom="50px"
            show={message ? true : false}
          />
        )}
      {onlyDelete && alternativeMessage && (
        <Message
          message={alternativeMessage.message}
          variant={alternativeMessage.flag}
          bottom="50px"
          show={alternativeMessage ? true : false}
        />
      )}
    </>
  );
};

export default DeleteWithConfirmation;
