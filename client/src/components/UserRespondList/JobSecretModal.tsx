import React from "react";
import { Spinner, Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
export class JobSecretModal extends React.Component<any> {
  render() {
    const { open, toggle, secretData } = this.props;
    return (<Modal isOpen={open} toggle={toggle}>
      <ModalHeader>Подробнее</ModalHeader>
      <ModalBody className="d-flex flex-column">
        {secretData ? (<div>
          <p>Данные о работе</p>
          <span> {secretData.secretInfo || "Работодатель ничего не сообщил"} </span>
          <p className="mt-2">Связь с работодателем</p>
          <span> {secretData.socialURL || secretData.email} </span>
        </div>) : (<Spinner color="primary" className="m-auto" />)}
      </ModalBody>
      <ModalFooter>
        <Button className="rounded-0" color="secondary" onClick={toggle}>
          Закрыть
          </Button>
      </ModalFooter>
    </Modal>);
  }
}
