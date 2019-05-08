import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
import Checkbox from "../Checkbox";
import { TagInput } from "./TagInput";
import { connect } from "react-redux";

// import { fetchJobs } from "../../actions/jobListActions";

import axios from "axios";

import joi from "joi";
import InputCheck from "../ValidateInputField";
import { addUserJob } from "../../store/actions/jobActions";

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

function validationMessage(details: any[], field: string) {
  const det = details.find(c => c.context.key === field);
  if (det !== undefined) return det.message;
}

function isEmpty(str: string) {
  return str === undefined || str === null || str.length === 0 || !str.trim();
}

class AddJobModal extends React.Component<any & IJobModalProps> {
  state = {
    input: {
      label: "",
      description: "",
      timespan: "",
      tags: ["hi"],
      city: "",
      secretInfo: "",
      price: "",
      validate: null as any,
      schema: {
        label: joi
          .string()
          .min(5)
          .required()
          .error(e => "Минимум 5 символов"),
        description: joi
          .string()
          .min(10)
          .required()
          .error(e => "Минимум 10 символов"),
        timespan: joi
          .number()
          .integer()
          .required()
          .error(e => "Требуется целое число"),
        // city: joi.string(),
        // secretInfo: joi.string(),
        price: joi
          .number()
          .required()
          .integer()
          .error(e => "Требуется целое число")
      }
    }
  };

  toggleCheckbox = (e: any) => {
    const { input } = this.state;
    this.setState({ input: { ...input, [e.target.id]: e.target.checked } });
  };
  pushJob = () => {
    this.validate();
    if (!this.state.input.validate) {
      const { city, label, description, price, secretInfo, timespan, tags } = this.state.input;
      this.props.toggle();
      this.props.addJob({
        city: isEmpty(city) ? undefined : city,
        label,
        description,
        price,
        secretInfo: isEmpty(secretInfo) ? undefined : secretInfo,
        timespan: Number(timespan) * 60 * 60 * 1000,
        tags
      });
    }
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

  validate = () => {
    const { input } = this.state;
    // console.log("validationn");
    input.validate = joi.validate(input, input.schema, { allowUnknown: true, convert: true });
    if (!input.validate.error) input.validate = null;
    this.setState({ input });
  };

  render() {
    const { open, toggle } = this.props;
    const { tags, label, description, timespan, price, validate } = this.state.input;
    const inputDetails = (validate && validate.error.details) || [];
    return (
      <div>
        <Modal isOpen={open} toggle={toggle}>
          <ModalHeader>Создание новой вакансии</ModalHeader>
          <ModalBody>
            <p>Заголовок</p>
            <input value={label} placeholder="Выгул собаки" className="w-100 mb-1" onChange={this.onChange} name="label" />
            <InputCheck className="mr-auto" error={validationMessage(inputDetails, "label")} />
            <p className="mt-3">Содержание вакансии</p>
            <textarea rows={5} value={description} placeholder="Работа заключается в.." onChange={this.onChange} name="description" className="w-100 mb-1" />
            <InputCheck idle="Видно всем" className="mr-auto" error={validationMessage(inputDetails, "description")} />
            <p className="mt-3">Время выполнения (в часах)</p>
            <div className="d-flex">
              <input value={timespan} onChange={this.onChange} name="timespan" placeholder="3" className="w-100 mb-1" /> <span>ч.</span>
            </div>
            <InputCheck className="mr-auto" idle="Расчётное время выполнения" error={validationMessage(inputDetails, "timespan")} />
            <p className="mt-3">Теги</p>
            <TagInput addTag={this.addTag} removeTag={this.removeTag} tags={tags} />
            <p>Город</p>
            <input className="w-100 mb-1" onChange={this.onChange} name="city" placeholder="Москва" />
            <small>По умолчанию - Ваш</small>
            <p className="mt-3">Скрытая информациия</p>
            <textarea rows={5} onChange={this.onChange} name="secretInfo" placeholder="Ключ от дома - под горшком" className="w-100 mb-1" />
            <small>Видна только для нанятого Вами работника</small>
            {/* <Checkbox className="mb-3" id="hideAddress" label="Спрятать адрес" checked={hideAddress} toggle={this.toggleCheckbox} /> */}
            <p className="mt-3">Цена</p>
            <div className="d-flex">
              <input className="w-100 mb-1" value={price} placeholder="1000" onChange={this.onChange} name="price" /> <span>₽</span>
            </div>
            <InputCheck className="mr-auto" error={validationMessage(inputDetails, "price")} />
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={() => {
                this.pushJob();
              }}
              className="rounded-0"
              color="primary"
            >
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
  addJob: addUserJob
};

const mapStateToProps = (state: any) => {};

export default connect(
  null,
  mapDispatchToProps
)(AddJobModal);
