import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
import Checkbox from "../Checkbox";
import { TagInput } from "./TagInput";
import { connect } from "react-redux";

import { pushJob } from "../../actions/jobActions";

interface IJobModalState {
  input: {
    [key: string]: any;
    hideAddress: false;
    label: string;
    description: string;
    time: number;
    tags: string[];
    distance: number;
    price: number;
  };
}

interface IJobModalProps {
  open: boolean;
  toggle: () => void;
}

class AddJobModal extends React.Component<any & IJobModalProps> {
  state = {
    input: {
      author: "Пупапапап",
      hideAddress: false,
      label: "",
      description: "",
      time: 0,
      tags: ["hi"],
      distance: 0,
      price: 0
    }
  };

  toggleCheckbox = (e: any) => {
    const { input } = this.state;
    this.setState({ input: { ...input, [e.target.id]: e.target.checked } });
  };
  pushJob = () => {
    this.props.pushJob(this.state.input);
  };

  onChange = (e: any) => {
    const { input } = this.state;
    this.setState({ input: { ...input, [e.target.name]: e.target.value } });
  };

  addTag = (tag: string) => {
    const { input } = this.state;
    input.tags.push(tag);
    this.setState({ input });
  };
  removeTag = (tag: string) => {
    // this.props.removeTag(tag);
    const input = this.state.input;
    input.tags = input.tags.filter(t => t != tag);

    this.setState({ input });
  };

  render() {
    const { open, toggle } = this.props;
    const { hideAddress, tags, label, description, time, price } = this.state.input;
    return (
      <div>
        <Modal isOpen={open} toggle={toggle}>
          <ModalHeader>Создание новой вакансии</ModalHeader>
          <ModalBody>
            <p>Заголовок</p>
            <input value={label} className="w-100" onChange={this.onChange} name="label" />
            <p>Содержание вакансии</p>
            <textarea value={description} onChange={this.onChange} name="description" className="w-100" />
            <p>Время выполнения (в часах)</p>
            <div className="d-flex">
              <input value={time} onChange={this.onChange} name="time" className="w-100" /> <span>ч.</span>
            </div>
            <p>Теги</p>
            <TagInput addTag={this.addTag} removeTag={this.removeTag} tags={tags} />
            <p>Город</p>
            <input className="w-100" onChange={this.onChange} name="city" />
            <p>Скрытая информациия</p>
            <textarea className="w-100 mb-1" />
            <small>Видна только для нанятого Вами работника</small>

            {/* <Checkbox className="mb-3" id="hideAddress" label="Спрятать адрес" checked={hideAddress} toggle={this.toggleCheckbox} /> */}
            <p className="mt-3">Цена</p>
            <div className="d-flex">
              <input className="w-100" value={price} onChange={this.onChange} name="price" /> <span>₽</span>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button onClick={this.pushJob} className="rounded-0" color="primary">
              Опубликовать
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
  pushJob
};

const mapStateToProps = (state: any) => {};

export default connect(
  null,
  mapDispatchToProps
)(AddJobModal);
