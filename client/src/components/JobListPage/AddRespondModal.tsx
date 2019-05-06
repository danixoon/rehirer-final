import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
import Checkbox from "../Checkbox";
import { TagInput } from "./TagInput";
import { connect } from "react-redux";
import { addRespond } from "../../actions/jobActions";

// import { pushJob } from "../../actions/jobActions";

interface IJobModalProps {
  jobId: string;
  open: boolean;
  toggle: () => void;
}

class AddJobModal extends React.Component<any & IJobModalProps> {
  state = {
    input: {
      message: ""
    }
  };

  onChange = (e: any) => {
    const { input } = this.state;
    this.setState({ input: { ...input, [e.target.name]: e.target.value } });
  };

  render() {
    const { open, toggle, jobId } = this.props;
    const { message } = this.state.input;
    return (
      <div>
        <Modal isOpen={open} toggle={toggle}>
          <ModalHeader>Заявка</ModalHeader>
          <ModalBody>
            <p>Информация для работодателя</p>
            <textarea
              placeholder="Я гений всея руси и легко выгуляю вашу Жужу не моргнув и глазом!"
              value={message}
              onChange={this.onChange}
              name="message"
              className="w-100 mb-1"
              rows={5}
            />
            <small>Опишите свои навыки и заинтересуйте работодателя</small>
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={() => {
                this.props.addRespond(jobId, message);
                toggle();
              }}
              className="rounded-0"
              color="primary"
            >
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
  addRespond
};

const mapStateToProps = (state: any) => {};

export default connect(
  null,
  mapDispatchToProps
)(AddJobModal);
