import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
import Checkbox from "../Checkbox";
import { TagInput } from "./TagInput";
import { connect } from "react-redux";
import { addUserRespond } from "../../store/actions/respondActions";
import joi from "joi";
import InputCheck, { InputValidate, InputValidateGroup } from "../ValidateInputField";

interface IJobModalProps {
  jobId: string;
  open: boolean;
  toggle: () => void;
}

class AddJobModal extends React.Component<any & IJobModalProps> {
  state = {
    forceValidate: false,
    correct: false,
    input: {} as any
  };

  addRespond = () => {
    const { toggle, addUserRespond, jobId } = this.props;
    const { correct, input } = this.state;
    if (!correct) return this.setState({ forceValidate: true });
    addUserRespond(jobId, input.message);
    toggle();
  };

  validated = (correct: boolean, value: any) => {
    this.setState({ correct, input: value });
  };

  render() {
    const { open, toggle } = this.props;
    const { forceValidate } = this.state;
    return (
      <div>
        <Modal isOpen={open} toggle={toggle}>
          <ModalHeader>Заявка</ModalHeader>
          <ModalBody>
            <InputValidateGroup forceValidate={forceValidate} validated={this.validated}>
              <p>Информация для работодателя</p>
              <InputValidate
                name="message"
                successMessage="Всё верно"
                idleMessage="Опишите свои навыки и заинтересуйте работодателя"
                schema={joi
                  .string()
                  .min(4)
                  .error(e => "Минимум 4 символа")}
              >
                <textarea
                  placeholder="Я гений всея руси и легко выгуляю вашу Жужу не моргнув и глазом!"
                  // value={message}
                  // onChange={this.onChange}
                  className="w-100 mb-1"
                  rows={5}
                />
              </InputValidate>
            </InputValidateGroup>
          </ModalBody>
          <ModalFooter>
            <Button onClick={this.addRespond} className="rounded-0" color="primary">
              Откликнуться
            </Button>
            <Button className="rounded-0" color="secondary" onClick={toggle}>
              Отмена
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

const mapDispatchToProps = {
  addUserRespond
};

const mapStateToProps = (state: any) => {};

export default connect(
  null,
  mapDispatchToProps
)(AddJobModal);
