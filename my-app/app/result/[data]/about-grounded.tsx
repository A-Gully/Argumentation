"use-client";

import React from "react";
import { AiOutlineQuestion } from "react-icons/ai";

// reactstrap components
import { Button, Modal, ModalBody, ModalFooter } from "reactstrap";

type Props = {
  title: string;
  info: string;
};

//Information Modal: Display title and info props
function InfoModal(props: Props) {
  const { title, info } = props;
  const [modalOpen, setModalOpen] = React.useState(false);
  return (
    <>
      <button className="info" onClick={() => setModalOpen(!modalOpen)}>
        <AiOutlineQuestion />
      </button>
      <Modal toggle={() => setModalOpen(!modalOpen)} isOpen={modalOpen}>
        <div className=" modal-header">
          <h5 className=" modal-title" id="exampleModalLabel">
            {title}
          </h5>
          <button
            aria-label="Close"
            className=" close"
            type="button"
            onClick={() => setModalOpen(!modalOpen)}
          >
            <span aria-hidden={true}>×</span>
          </button>
        </div>
        <ModalBody>{info}</ModalBody>
        <ModalFooter>
          <Button
            color="secondary"
            type="button"
            onClick={() => setModalOpen(!modalOpen)}
          >
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}

export default InfoModal;
